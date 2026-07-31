const CASE_STUDY_DATA = {
  title: 'MahJong Ledger',
  category: 'Product Design / Vibe Coding',
  intro: 'A shared Mahjong ledger I designed and built for my family in three days. It replaces scattered LINE messages with a real-time record that all four players can see.',
  author: 'CREATED BY TIM SHIH — 3-DAY BUILD',
  backHref: 'index.html',

  overview: {
    content: [
      '<strong>A Family Problem</strong><br><br>Mahjong is a regular part of my family gatherings. We use playing cards as fixed-value chips and check after every hand that all four results add up to zero. The system works at the table, but each result was recorded manually in a LINE group. Understanding the long-term balance meant scrolling through messages and calculating everything again.',
      '<strong>A Shared Ledger, Not a Scoring App</strong><br><br>Most Mahjong apps focus on calculating tai, but every Taiwanese family has its own rules. For us, scoring is part of the conversation and does not need to be replaced. I built a small tool that records money, synchronizes four phones, and keeps a clear history while leaving the game itself to the players.',
      '<strong>Three-Day Solo Build</strong><br><br>I independently handled the product decisions, design, development, deployment, and presentation, using Claude as a development assistant. The app has been released to my family’s LINE group and is ready for its first full game session.',
    ],
    media: [
      { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/MahJong/Video/mahjong_AE_Render.mp4' },
    ],
  },

  sections: [
    {
      title: 'Key Product Decisions',
      content: [
        '<strong>Designed Around the Table</strong><br><br>The system records money but does not calculate tai. Players can also switch identity when borrowing another person’s phone. Entries are corrected through a visible audit history instead of being silently deleted.',
        '<strong>Built-In Trust</strong><br><br>A settlement can only be completed when all four results add up to zero. This turns an existing family habit into a clear system safeguard and makes mistakes easier to find before the next hand begins.',
        '<strong>Correcting the Chip Model</strong><br><br>I initially treated one playing card as the value of one tai because both happened to equal NT$10 under our usual rules. A different room setting exposed the mistake. I separated the fixed NT$10 chip value from the configurable base and tai values so every result can be represented with whole cards.',
      ],
    },
    {
      title: 'Built for Real Family Use',
      content: [
        '<strong>Simple, Durable Technology</strong><br><br>The app uses native HTML and ES modules without a framework or build step. Supabase provides the database and real-time synchronization, GitHub Actions keeps the occasional-use database active, and Vercel deploys every update.',
        '<strong>Opened Where the Family Already Talks</strong><br><br>LINE LIFF opens the tool inside LINE and suggests the current player from their LINE profile. I chose its minimized floating window over automatic group posting because switching between the ledger and conversation is more useful throughout a game.',
        '<strong>Current Status</strong><br><br>The working app includes real-time balances, configurable room settings, zero-sum validation, player switching, auditable corrections, LINE integration, and automatic deployment. It has been shared with my family, but long-term usability will be evaluated after real weekend sessions.',
      ],
    },
  ],
};
