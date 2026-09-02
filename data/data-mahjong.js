const CASE_STUDY_DATA = {
  layout: 'continuous',
  title: 'MahJong Ledger',
  category: 'Product Design / Vibe Coding',
  intro: 'A real-time Mahjong ledger designed and built in three days for my family. It replaces scattered LINE messages with one shared record that all four players can access. <br>I independently designed, developed, and deployed the web app, using Claude as a development assistant.<span class="block mt-12 font-geistmono text-xs uppercase text-label">My Role</span><span class="block mt-3 font-geist text-xs leading-[1.6] text-muted">I independently designed, developed, and deployed the web app, using Claude as a development assistant.</span>',
  author: 'CREATED BY TIM SHIH',
  backHref: 'index.html',

   overview: {
    content: [
      {
        title:'A Family Problem Hidden in LINE',
        text:'Mahjong is a regular part of my family gatherings. After each hand, we recorded four balances in a LINE group and checked that they added up to zero. The system worked at the table, but reviewing long-term results meant searching through old messages and calculating everything again.',
      },
      {
        title:'A Ledger, Not a Scoring App',
        text:'Most Mahjong apps calculate tai, but every family plays differently. I kept scoring as part of the table conversation and built only the missing layer: a shared ledger that synchronizes balances, preserves history, and works across four phones.',
      }
    ],
    media: [
      { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/MahJong/Video/mahjong_AE_Render.mp4', afterParagraph: -1 },
    ],
  },

  sections: [
    // {
    //   title: 'KEY PRODUCT DECISIONS',
    //   content: [
    //     {
    //       title:'Designed Around Existing Behavior',
    //       text:'Players enter the final amount after agreeing on the score together. They can also switch identities when borrowing another person’s phone, reflecting how devices are actually shared during family games.',
    //     },
    //     {
    //       title:'Trust Through Visible Rules',
    //       text:'A hand can only be settled when all four results add up to zero. Corrections remain visible in the audit history instead of being silently deleted, making mistakes easier to understand and resolve.'
    //     },
    //     {
    //       title:'Separating Chips From Scoring Rules',
    //       text:'My first model treated one playing card as one tai because both were worth NT$10 under our usual rules. A different room setting exposed the flaw. I separated the fixed chip value from configurable base and tai values so the ledger could support different family rules.'
    //     }
    //   ],
    // },
    {
      title: 'OUTCOME',
      content: [
        {
          title:'What I Learned',
          text:'The project showed me that a useful product does not always need to replace an entire activity. By preserving how my family already scores and communicates, I could focus on the one coordination problem that technology was well suited to solve.'
        }
      ],
    },
  ],
};
