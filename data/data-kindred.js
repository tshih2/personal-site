const CASE_STUDY_DATA = {
  layout: 'continuous',
  title: 'KINDRED',
  category: 'PRODUCT DESIGN / UI / UX',
  intro: 'A shared care and observation platform that helps families preserve everyday context, coordinate support, and prepare for professional conversations—without attempting to read or diagnose a child’s emotions<span class="block mt-12 font-geistmono text-xs uppercase text-label">My Role</span><span class="block mt-3 font-geist text-xs leading-[1.6] text-muted">I developed the research synthesis, composite caregiver journey, information architecture, core interaction flows, visual system, and high-fidelity mobile prototype.</span>',
  author: 'CREATED BY TIM SHIH — WINTER 2022',
  backHref: 'index.html',

  overview: {
    content: [
      {
        title:'Connecting Everyday Care With Professional Support',
        text:'Families often build valuable knowledge about a child’s communication, routines, preferences, and effective supports. However, that context can become fragmented across family members, schools, and care professionals. Kindred explores how everyday observations could become structured, traceable information that families can review and selectively share with trusted members of a care team.'
      },
       {
        title:'Prototype Status',
        text:'Kindred is a high-fidelity product prototype, not a deployed or clinically validated care system. Its reports organize caregiver observations; they do not measure emotional states, determine causes, or provide a diagnosis.'
      },
      
    ],
    media: [
      { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/A Message To The End/Overview/Project_ShowCase_Subtitled.mp4', afterParagraph: -1 },
    ],
  },

  sections: [
    {
        title:'RESEARCH & PROBLEM FRAMING',
        content:[
            {
                title:'Learning From Secondary Sources',
                text:'I reviewed published research and public caregiver stories about autism, emotional regulation, family support, and access to services. These stories were synthesized into a Composite Caregiver Journey rather than presented as direct interviews.'
            },
            {
                title:'The Context Gap',
                text:'The research revealed three connected challenges: emotional signals are easily interpreted without enough context, hard-earned family knowledge does not consistently travel between caregivers, and support often becomes reactive because observations and outcomes are recorded separately. When adults are responsible for interpreting behavior, assumptions can also be recorded as facts and unintentionally override the child’s own communication, preferences, and agency.',
            },
            {
                style:'quote',
                align:'center',
                text:'“How might we help caregivers and autistic children turn everyday observations into shared understanding, so support can become more confident, coordinated, and increasingly self-directed over time?”'
            }
        ]
    },
    {
        title:'PRODUCT DIRECTION',
        content:[
            {
                title:'Preserve Context, Not Interpret Emotion',
                text:'Kindred is designed to help caregivers document what they observed, what happened around the event, what support was provided, and what followed. The product organizes evidence without claiming to know what the child felt or why an event occurred.'
            },
            {
                title:'From Caregiver-Led Support to Self-Directed Agency',
                text:'During early support, caregivers may take greater responsibility for documenting context and coordinating care. As the child grows, participation, consent, privacy, and ownership should gradually shift toward shared decision-making and self-directed support.',
            },
        ]
    }
  ],
};