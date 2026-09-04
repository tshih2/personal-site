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
      { type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/KINDRED/MOCKUP/MOCKUP_1_1.png', afterParagraph: -1 },
    ],
  },

  sections: [
    {
        title:'RESEARCH & PROBLEM FRAMING',
        content:[
            {
                title:'Learning From Secondary Sources',
                text:'I reviewed published research and caregiver stories about autism, emotional regulation, family support, and access to services, while also interviewing three parents of autistic children to understand their firsthand experiences.'
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
        ],
        media:[
            {
                type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/KINDRED/IMG/User%20Research.png', afterParagraph:-1,
            },
            {
                type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/KINDRED/IMG/user-journey-map.png', afterParagraph:0,
            },
            {
                type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/KINDRED/IMG/INSIGHT.png', afterParagraph:1,
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
        ],
        media:[
            {
                type: 'image', src:'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/KINDRED/IMG/INFORAMTION%20ARCHITECTURE.png',afterParagraph:-1
            },
            {
                type: 'image', src:'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/KINDRED/IMG/INFORAMTION%20ARCHITECTURE-1.png',afterParagraph:-1

            }
        ]
    },
    {
        title:'CORE EXPERIENCE',
        content:[
            {
                title:'Capture First, Clarify Later',
                text:'Caregivers can quickly type or speak what they noticed before important details are forgotten. AI then asks focused questions about missing context, communication, support, and outcomes. The caregiver reviews and edits the structured observation before saving or sharing it. AI guides clarification; it does not diagnose the child or decide what an event means.'
            },
            {
                title:'See Patterns Without Losing Context',
                text:'Daily, weekly, and monthly reports organize recorded observations into recurring situations, supports, and outcomes. Every summarized pattern remains linked to its original observations so caregivers can review the evidence before acting on it.',
            },
            {
                title:'Connect With Professional Support',
                text:'Caregivers can prepare for appointments by selecting relevant observations, reports, and questions. Information remains private by default and is shared only with chosen professionals or care-team members.'
            },
            {
                title:'A Calm and Structured Interface',
                text:'The visual system uses a restrained teal palette, generous spacing, clear hierarchy, and reusable components to make sensitive information feel understandable without appearing diagnostic or clinical.'
            }
        ],
        media:[
            {
                type:'video',src:'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/KINDRED/PROTOTYPE/RECORD_OBSERVATION_AE.mp4',afterParagraph:-1,
            },
            {
                type:'video', src:'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/KINDRED/PROTOTYPE/DAILY_GRAPH_AE.mp4',afterParagraph:0,
            },
            {
                type:'video', src:'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/KINDRED/PROTOTYPE/APPOINTMENT_WITH_PROFESSIONAL_AE.mp4', afterParagraph:1,

            },
            {
                type:'image', src:'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/KINDRED/DESIGN%20SYSTEM/Color%20Palette%20%2B%20Type.png', afterParagraph:2,
            },
            {
                type:'image', src:'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/KINDRED/DESIGN%20SYSTEM/COMPONENTS.png',afterParagraph:2,
            },
            {
                type:'image', src:'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/KINDRED/DESIGN%20SYSTEM/ICON.png', afterParagraph:2
            },
        ]
    },
    {
        title:'OUTCOME & NEXT VALIDATION',
        content:[
            {
                title:'Research-Informed Iteration',
                text:'Interviews with three parents of autistic children, followed by ongoing message-based feedback, informed two prototype iterations. The second iteration revised how children’s information was recorded and introduced a professional appointment-booking flow in response to parents’ stated needs. Faculty feedback recognized the continuity between the research, caregivers’ emotional experiences, and the resulting product decisions.'
            },
            {
                title:'PROTOTYPE OUTCOME AND NEXT VALIDATION',
                text:'The final Figma prototype established an age-progressive care model: caregiver-led documentation for children ages 2–7 gradually transitions toward greater participation, consent, and ownership for the child. Daily, weekly, and monthly summaries connect recorded observations with preparation for professional conversations. The prototype was not usability-tested by the interviewed parents or clinical professionals. The next step would be to evaluate whether families can record observations clearly, understand the reports, trust the sharing controls, and confidently prepare for appointments.'
            },
        ]
    },  
  ],
};