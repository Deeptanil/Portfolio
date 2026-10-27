/**
 * Weekly Traffic Summary Dispatcher
 * Queries PostHog for multi-domain metrics and sends rich Discord embeds.
 */

const TARGET_DOMAINS = [
  'deeptanil.in',
  'platter.deeptanil.in',
  'files.deeptanil.in',
  'blog.deeptanil.in',
];

async function runHogQL(query, host, projectId, apiKey) {
  const res = await fetch(`${host}/api/projects/${projectId}/query/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {
        kind: 'HogQLQuery',
        query,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PostHog query failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  return json.results || [];
}

function calcTrend(curr, prev) {
  if (prev === 0 && curr === 0) return null;
  if (prev === 0) return '🟢 **+100%**';
  const diff = ((curr - prev) / prev) * 100;
  const sign = diff >= 0 ? '+' : '';
  const icon = diff >= 0 ? '🟢' : '🔴';
  return `${icon} **${sign}${diff.toFixed(1)}%**`;
}

async function sendDiscordWebhook(webhookUrl, payload) {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Discord webhook delivery failed (${res.status}): ${text}`);
  }
}

async function main() {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID || '@current';
  const host = process.env.POSTHOG_HOST || 'https://us.i.posthog.com';

  if (!webhookUrl || !apiKey) {
    throw new Error(
      'Missing required environment variables: DISCORD_WEBHOOK_URL and/or POSTHOG_PERSONAL_API_KEY'
    );
  }

  // 1. Fetch current metrics (7d, 30d, 90d)
  const [curr7d, prev7d, curr30d, prev30d, curr90d, prev90d] = await Promise.all([
    runHogQL(
      `SELECT properties.$host AS domain, count() AS views, count(DISTINCT distinct_id) AS visitors
       FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 7 DAY GROUP BY domain`,
      host, projectId, apiKey
    ),
    runHogQL(
      `SELECT properties.$host AS domain, count() AS views
       FROM events WHERE event = '$pageview' AND timestamp < now() - INTERVAL 7 DAY AND timestamp >= now() - INTERVAL 14 DAY GROUP BY domain`,
      host, projectId, apiKey
    ),
    runHogQL(
      `SELECT properties.$host AS domain, count() AS views, count(DISTINCT distinct_id) AS visitors
       FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY GROUP BY domain`,
      host, projectId, apiKey
    ),
    runHogQL(
      `SELECT properties.$host AS domain, count() AS views
       FROM events WHERE event = '$pageview' AND timestamp < now() - INTERVAL 30 DAY AND timestamp >= now() - INTERVAL 60 DAY GROUP BY domain`,
      host, projectId, apiKey
    ),
    runHogQL(
      `SELECT properties.$host AS domain, count() AS views, count(DISTINCT distinct_id) AS visitors
       FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 90 DAY GROUP BY domain`,
      host, projectId, apiKey
    ),
    runHogQL(
      `SELECT properties.$host AS domain, count() AS views
       FROM events WHERE event = '$pageview' AND timestamp < now() - INTERVAL 90 DAY AND timestamp >= now() - INTERVAL 180 DAY GROUP BY domain`,
      host, projectId, apiKey
    ),
  ]);

  // Aggregate by domain
  const stats = {};
  for (const d of TARGET_DOMAINS) {
    stats[d] = {
      v7: 0, u7: 0, p7: 0,
      v30: 0, u30: 0, p30: 0,
      v90: 0, u90: 0, p90: 0,
    };
  }

  let total7 = 0, totalPrev7 = 0;
  let total30 = 0, totalPrev30 = 0;
  let total90 = 0, totalPrev90 = 0;
  let totalU7 = 0, totalU30 = 0, totalU90 = 0;

  curr7d.forEach(([d, v, u]) => {
    const key = (d || '').toLowerCase().trim();
    if (stats[key]) { stats[key].v7 += Number(v); stats[key].u7 += Number(u); }
    total7 += Number(v); totalU7 += Number(u);
  });
  prev7d.forEach(([d, v]) => {
    const key = (d || '').toLowerCase().trim();
    if (stats[key]) stats[key].p7 += Number(v);
    totalPrev7 += Number(v);
  });

  curr30d.forEach(([d, v, u]) => {
    const key = (d || '').toLowerCase().trim();
    if (stats[key]) { stats[key].v30 += Number(v); stats[key].u30 += Number(u); }
    total30 += Number(v); totalU30 += Number(u);
  });
  prev30d.forEach(([d, v]) => {
    const key = (d || '').toLowerCase().trim();
    if (stats[key]) stats[key].p30 += Number(v);
    totalPrev30 += Number(v);
  });

  curr90d.forEach(([d, v, u]) => {
    const key = (d || '').toLowerCase().trim();
    if (stats[key]) { stats[key].v90 += Number(v); stats[key].u90 += Number(u); }
    total90 += Number(v); totalU90 += Number(u);
  });
  prev90d.forEach(([d, v]) => {
    const key = (d || '').toLowerCase().trim();
    if (stats[key]) stats[key].p90 += Number(v);
    totalPrev90 += Number(v);
  });

  // Check if 30d / 90d have meaningful data, otherwise hide them dynamically
  const has30d = total30 > 0;
  const has90d = total90 > 0;

  const totalTrend7 = calcTrend(total7, totalPrev7);
  const totalTrend30 = has30d ? calcTrend(total30, totalPrev30) : null;
  const totalTrend90 = has90d ? calcTrend(total90, totalPrev90) : null;

  const isOverallUp = total7 >= totalPrev7;
  const embed1Color = isOverallUp ? 0x2ecc71 : 0xe74c3c; // Green if up, Red if down

  const overallLines = [
    `• **7 Days** : \`${total7.toLocaleString()}\` (\`${totalU7.toLocaleString()}\`) ${totalTrend7 || ''}`,
  ];
  if (has30d) overallLines.push(`• **30 Days**: \`${total30.toLocaleString()}\` (\`${totalU30.toLocaleString()}\`) ${totalTrend30 || ''}`);
  if (has90d) overallLines.push(`• **90 Days**: \`${total90.toLocaleString()}\` (\`${totalU90.toLocaleString()}\`) ${totalTrend90 || ''}`);

  const domainFields = TARGET_DOMAINS.map((domain) => {
    const s = stats[domain];
    const t7 = calcTrend(s.v7, s.p7);
    const t30 = has30d ? calcTrend(s.v30, s.p30) : null;
    const t90 = has90d ? calcTrend(s.v90, s.p90) : null;

    const lines = [`• 7d : \`${s.v7.toLocaleString()}\` (\`${s.u7.toLocaleString()}\`) ${t7 || ''}`];
    if (has30d) lines.push(`• 30d: \`${s.v30.toLocaleString()}\` (\`${s.u30.toLocaleString()}\`) ${t30 || ''}`);
    if (has90d) lines.push(`• 90d: \`${s.v90.toLocaleString()}\` (\`${s.u90.toLocaleString()}\`) ${t90 || ''}`);

    return {
      name: `🌐 ${domain}`,
      value: lines.join('\n'),
      inline: true,
    };
  });

  const message1 = {
    embeds: [
      {
        title: '📊 Network Traffic Digest (Weekly Summary)',
        description: 'Aggregated view counts and unique visitor trends across your active subdomains.',
        color: embed1Color,
        fields: [
          {
            name: '⚡ Overall Network Volume',
            value: overallLines.join('\n'),
            inline: false,
          },
          ...domainFields,
        ],
        footer: {
          text: 'Legend: Views (Unique Visitors) • Trend % • PostHog Network Telemetry',
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  // 2. Fetch audience, blog, devices, and conversion events
  const [sources, devices, conversions, topBlogs] = await Promise.all([
    runHogQL(
      `SELECT properties.$referring_domain AS source, count() AS views
       FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 7 DAY
       GROUP BY source ORDER BY views DESC LIMIT 5`,
      host, projectId, apiKey
    ),
    runHogQL(
      `SELECT properties.$device_type AS device, count() AS views
       FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 7 DAY
       GROUP BY device ORDER BY views DESC`,
      host, projectId, apiKey
    ),
    runHogQL(
      `SELECT event, count() AS total
       FROM events
       WHERE event IN ('project_website_clicked', 'project_github_clicked', 'resume_downloaded', 'email_copied')
         AND timestamp >= now() - INTERVAL 7 DAY
       GROUP BY event`,
      host, projectId, apiKey
    ),
    runHogQL(
      `SELECT properties.$page_title AS title, properties.$pathname AS path, count() AS views
       FROM events
       WHERE event = '$pageview'
         AND properties.$host = 'blog.deeptanil.in'
         AND timestamp >= now() - INTERVAL 7 DAY
       GROUP BY title, path
       ORDER BY views DESC
       LIMIT 5`,
      host, projectId, apiKey
    ),
  ]);

  // Format sources
  const totalSourceViews = sources.reduce((acc, [, v]) => acc + Number(v), 0) || 1;
  const sourceLines = sources.length > 0
    ? sources.map(([s, v], i) => {
        const name = s ? `**${s}**` : '**Direct / Bookmarks**';
        const pct = Math.round((Number(v) / totalSourceViews) * 100);
        return `${i + 1}. ${name} — \`${pct}%\` (${Number(v).toLocaleString()})`;
      })
    : ['*No external referral data recorded yet.*'];

  // Format devices
  const totalDeviceViews = devices.reduce((acc, [, v]) => acc + Number(v), 0) || 1;
  const deviceLines = devices.length > 0
    ? devices.map(([d, v]) => {
        const name = d ? (d.charAt(0).toUpperCase() + d.slice(1)) : 'Desktop';
        const icon = name.toLowerCase().includes('mobile') ? '📱' : name.toLowerCase().includes('tablet') ? '📟' : '🖥️';
        const pct = Math.round((Number(v) / totalDeviceViews) * 100);
        return `• ${icon} **${name}**: \`${pct}%\` (${Number(v).toLocaleString()})`;
      })
    : ['• 🖥️ **Desktop**: `100%`'];

  // Format conversions
  const convMap = {};
  conversions.forEach(([e, count]) => { convMap[e] = Number(count); });
  const convLines = [
    `• 🔗 **Live Project Links**: \`${(convMap['project_website_clicked'] || 0).toLocaleString()} clicks\``,
    `• 🐙 **View GitHub**: \`${(convMap['project_github_clicked'] || 0).toLocaleString()} clicks\``,
    `• 📄 **Resume Downloads**: \`${(convMap['resume_downloaded'] || 0).toLocaleString()} downloads\``,
    `• 📋 **Copied Email Address**: \`${(convMap['email_copied'] || 0).toLocaleString()} copies\``,
  ];

  // Format top blogs
  const blogLines = topBlogs.length > 0
    ? topBlogs.map(([t, p, v], i) => {
        const cleanTitle = (t || p || 'Untitled Post').trim();
        const cleanPath = p ? (p.startsWith('/') ? p : `/${p}`) : '';
        const url = `https://blog.deeptanil.in${cleanPath}`;
        return `${i + 1}. [${cleanTitle}](${url}) — \`${Number(v).toLocaleString()} views\``;
      })
    : ['*No blog traffic recorded yet.*'];

  const message2 = {
    embeds: [
      {
        title: '⚡ Audience Insights, Top Posts & Conversions',
        description: 'Visitor origins, portfolio conversions, popular posts, and device usage.',
        color: 0x55ffff,
        fields: [
          {
            name: '🗺️ Top Traffic Sources (7 Days)',
            value: sourceLines.join('\n'),
            inline: true,
          },
          {
            name: '📱 Device Breakdown',
            value: deviceLines.join('\n'),
            inline: true,
          },
          {
            name: '🎯 Portfolio Action Conversions',
            value: convLines.join('\n'),
            inline: false,
          },
          {
            name: '📝 Top 5 Blog Posts (blog.deeptanil.in)',
            value: blogLines.join('\n'),
            inline: false,
          },
        ],
        footer: {
          text: 'Reporting Period: Last 7 Days • Deeptanil Portfolio Automation',
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  // Send message 1
  await sendDiscordWebhook(webhookUrl, message1);
  console.log('✓ Message 1 sent successfully');

  // Pause briefly so Discord always displays in order
  await new Promise((r) => setTimeout(r, 700));

  // Send message 2
  await sendDiscordWebhook(webhookUrl, message2);
  console.log('✓ Message 2 sent successfully');
}

main().catch(async (err) => {
  console.error('Fatal execution error:', err);

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await sendDiscordWebhook(webhookUrl, {
        embeds: [
          {
            title: '⚠️ Traffic Telemetry Error Report',
            description: `An error occurred while compiling your weekly metrics dispatch:\n\`\`\`\n${err.message || err}\n\`\`\``,
            color: 0xe74c3c, // Red
            footer: { text: 'Deeptanil Network Watchdog' },
            timestamp: new Date().toISOString(),
          },
        ],
      });
      console.log('✓ Dispatched error notification embed to Discord');
    } catch (webhookErr) {
      console.error('Failed to dispatch error embed:', webhookErr);
    }
  }

  process.exit(1);
});
