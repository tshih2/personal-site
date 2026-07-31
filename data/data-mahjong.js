const CASE_STUDY_DATA = {
  title: 'MahJong Ledger',

  category: 'Product Design / Vibe Coding / Family Utility',

  intro: 'A shared Mahjong ledger built for my family in three days. It replaces scattered LINE messages with a real-time table that four players can trust without replacing the conversations and house rules that make the game ours.',

  author: 'CREATED BY TIM SHIH — 3-DAY BUILD',

  backHref: 'index.html',

  overview: {
    content: [
      '<strong>A Family Ritual</strong><br><br>Mahjong is how my family spends time together. Whether we return to my grandmother’s house, travel, or go camping, a game begins whenever four people are available. Instead of handling cash at the table, we use playing cards as chips: each suit belongs to one player, each card is worth NT$10, and a complete stack represents NT$1,000.',
      '<strong>The Problem Was Not Scoring</strong><br><br>After every hand, the four results must add up to zero. If they do not, we trace the history until the mistake is found. We previously recorded each result manually in a LINE group, but the records disappeared into the conversation. Finding the overall winner meant scrolling through dozens of messages and calculating everything again.',
      '<strong>A Shared Ledger, Not a Mahjong Calculator</strong><br><br>Most Mahjong apps calculate scoring, but Taiwanese families often use different rules and exceptions. For us, calculating tai is also part of the conversation and a strength of the older players. I therefore designed a shared ledger that manages money and history without taking over the game itself.',
      '<strong>Role & Status</strong><br><br>I independently took the project from idea and product decisions through interface design, development, deployment, and presentation in three days, using Claude as a development assistant. Every feature described in this case study is implemented. The app has been released to the family LINE group and is awaiting its first full weekend game session.',
    ],
    media: [
      { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/MahJong/Video/mahjong_AE_Render.mp4' },
    ],
  },

  sections: [
    {
      title: 'Designing Around the Real Table',
      content: [
        '<strong>Preserve What Already Works</strong><br><br>The first product decision was to leave tai calculation outside the system. Encoding every family exception would make the tool harder to trust and would turn a social ritual into an argument with software. Players continue calculating the hand together; the app records only the financial result.',
        '<strong>Identity Should Not Belong to a Device</strong><br><br>Borrowing phones is normal during a Mahjong game. Someone may be charging their phone or have no battery, so identity cannot be permanently attached to hardware. When the app opens through LINE, it asks whether the detected person is correct. If not, the user can select anyone from the family roster and enter data on their behalf.',
        '<strong>Make Corrections Visible</strong><br><br>Records are never silently deleted. When someone notices that a previous hand was wrong, the entry is voided or corrected while preserving who made the change, when it happened, and the before-and-after values. This turns correction into a safe and public part of the shared ledger.',
        '<strong>Translate a Family Rule Into Validation</strong><br><br>The family’s existing zero-sum check became a system constraint: all four players’ results must total zero before settlement. If the total is incorrect, the interface blocks completion because either the calculation or the implementation needs review. The message treats the discrepancy as a shared accounting problem rather than blaming one user.',
      ],
    },
    {
      title: 'A Small System Built to Last',
      content: [
        '<strong>Choosing Longevity Over Frameworks</strong><br><br>This tool is meant to serve my family for years, not exist only as a portfolio demo. I built it without a framework or bundler, using one HTML entry point and native ES modules. The deliberately small architecture reduces dependency maintenance and keeps the project understandable after long periods without active development.',
        '<strong>One Table Across Four Phones</strong><br><br>Supabase provides the shared Postgres database and Realtime subscriptions. When one player records a payment, the other three screens update immediately. SQL remains the source of truth, while the client listens for changes instead of maintaining four separate versions of the game.',
        '<strong>Keeping an Occasional Tool Available</strong><br><br>Supabase free projects can pause after inactivity, but my family does not play every week. A scheduled GitHub Actions workflow contacts the database twice a week to keep the project available. GitHub also stores the project and triggers deployment to Vercel whenever I push an update.',
        '<strong>Removing the Last Adoption Barrier</strong><br><br>LINE LIFF allows the app to open inside the family’s existing LINE conversation and uses the LINE profile to suggest the current player. This removes a browser handoff and repeated name selection—small points of friction that could decide whether older family members actually use the tool.',
      ],
      media: [
        { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/MahJong/Video/MahJongDemo.mp4' },
      ],
    },
    {
      title: 'Tradeoffs & Corrections',
      content: [
        '<strong>Chat Access Over One-Tap Sharing</strong><br><br>LIFF offers a minimized window that keeps the app available as a floating icon while users return to LINE. That capability conflicts with the permission needed to post settlement results directly into the group. I chose minimization because switching between the ledger and family conversation happens throughout the game, while copying one final result happens only once.',
        '<strong>A Hidden Assumption in the Chip Model</strong><br><br>I initially treated one playing card as the monetary value of one tai. Under our usual NT$30 base and NT$10-per-tai rule, both values happened to be NT$10, so the mistake remained invisible. A NT$50 base and NT$20-per-tai room exposed the flaw: the starting stack became NT$2,000 and a three-tai win produced 5.5 cards, even though half a playing card cannot exist.',
        '<strong>Separating Currency From Scoring</strong><br><br>The correction was conceptual before it was technical. A playing card is a fixed-value chip and is always worth NT$10. The base and tai settings determine the payment for a hand, but they do not redefine the chip. Separating those two concepts allowed different room settings to work without breaking the physical system used at the table.',
      ],
    },
    {
      title: 'Released, With Validation Still Ahead',
      content: [
        '<strong>What Is Working</strong><br><br>The deployed app supports shared real-time balances, LINE LIFF identity suggestions, player switching across devices, configurable base and tai settings, zero-sum settlement validation, auditable corrections, scheduled database keep-alive, and automatic Vercel deployment.',
        '<strong>Current Evidence</strong><br><br>The product has been delivered to the family LINE group, and the complete workflow is operational. However, it has not yet been used through a full family Mahjong session. I therefore treat the current result as a shipped working tool, not as evidence of long-term adoption or usability validation.',
        '<strong>Next Weekend Is the Real Test</strong><br><br>The first live session will reveal what a solo build cannot: whether the language is clear to older family members, whether four people can record hands without interrupting play, and whether corrections remain understandable during a real disagreement. Those observations will determine the next iteration.',
      ],
    },
  ],
};
