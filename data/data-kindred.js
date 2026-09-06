const CASE_STUDY_DATA = {
  layout: 'continuous',
  title: 'KINDRED',
  category: 'PRODUCT DESIGN / UI / UX',
  intro: 'Kindred is a shared care and observation platform that helps parents of autistic children preserve everyday context, coordinate support across caregivers and professionals, and prepare for more informed conversations, without attempting to interpret or diagnose a child’s emotions.<span class="block mt-12 font-geistmono text-xs uppercase text-label">My Role</span><span class="block mt-3 font-geist text-xs leading-[1.6] text-muted">I developed the research synthesis, composite caregiver journey, information architecture, core interaction flows, visual system, and high-fidelity mobile prototype.</span>',
  author: 'CREATED BY TIM SHIH — WINTER 2022',
  backHref: 'index.html',

  overview: {
    content: [
      {
        title:'Connecting Everyday Care With Professional Support',
        text:'Parents of autistic children develop valuable knowledge about their child’s communication, routines, preferences, and what support works for them. Yet this understanding is often scattered across conversations with family members, teachers, and care professionals. Kindred explores how parents can turn everyday observations into organized records that preserve the original context and can be selectively shared with trusted members of their child’s care team.'
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
                title:'Parent Interviews & Research',
                text:'I interviewed three parents of autistic children to understand their everyday interactions with their child and how their emotional experiences had evolved as their child grew. These conversations explored parents’ reflections on their experiences over time. I complemented the interviews with published research and caregiver stories about autism, emotional regulation, family support, and access to services.'
            },
            {
                title:'The Context Gap',
                text:'The research revealed three connected challenges: emotional signals are easily interpreted without enough context, hard-earned family knowledge does not consistently travel between caregivers, and support often becomes reactive because observations and outcomes are recorded separately. When adults are responsible for interpreting behavior, assumptions can also be recorded as facts and unintentionally override the child’s own communication, preferences, and agency.',
            },
            {
                style:'quote',
                align:'center',
                text:'“How might we help parents and autistic children build shared understanding from everyday experiences, so they can make care decisions together?”'
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
                text:'Caregivers may initially take the lead in documenting observations and coordinating care because children may need help recording their experiences, using tools, or managing care arrangements. Because these records concern the child’s own life, Kindred’s long-term direction is to support children in expressing their preferences from the start and gaining a greater say in what is recorded, what is shared, and how they are supported. Participation should adapt to each child’s communication preferences and support needs, with caregivers helping them express and act on their choices.',
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
                text:'In this prototype flow, caregivers type or speak a quick observation before details are forgotten. AI asks follow-up questions to clarify what happened, the surrounding context, what support was offered, and what followed. The responses become an organized report that caregivers can review and edit before saving or sharing. AI helps clarify the observation without diagnosing the child or determining the cause of an event.'
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
                type:'image', src:'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/KINDRED/DESIGN%20SYSTEM/COMPONENTS_2.png',afterParagraph:2,
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