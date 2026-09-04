// Draft created from the original MPAA portfolio page, the Art Division interview,
// and follow-up interview notes. The CASE_STUDY_DATA schema is unchanged.

const CASE_STUDY_DATA = {
  layout: 'continuous',
  title: 'Mary Pickford Arts Alliance',
  category: 'Product Design · UX Research · AI-Assisted Collaboration',
  intro: 'A role-based collaboration platform concept that helps Los Angeles arts nonprofits discover partners, share resources, and turn potential collaborations into actionable event proposals.<span class="block mt-12 font-geistmono text-xs uppercase text-label">My Role</span><span class="block mt-3 font-geist text-xs leading-[1.6] text-muted">I originated the core two-sided platform model and helped design the event-proposal flow, nonprofit dashboard, and interactive Figma prototype.</span>',
  author: 'CREATED BY TIM SHIH, Claire Li, Jacey Chung — SPRING 2025 · 14 WEEKS',
  backHref: 'index.html',

  overview: {
    content: [
        {
          title: 'Our Goal in Project',
          text: 'Working with the Mary Pickford Foundation, we aimed to bridge the gap between Los Angeles arts nonprofits by designing a platform that could make partnerships, shared resources, and collaborative events easier to initiate and sustain.',
        },
     ],
     media: [
       { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/MPAA_Sources/Overview/Promo_Video_Ver_Final.mp4',
        afterParagraph: -1,
       },
      ],
  },

  sections: [
    {
      title: 'RESEARCH',
      content: [
        {
          text: 'Working with the Mary Pickford Foundation, we aimed to bridge the gap between Los Angeles arts nonprofits by designing a platform that could make partnerships, shared resources, and collaborative events easier to initiate and sustain.',
        },
        {
          title: 'INSIGHT',
          text: 'Small nonprofit teams carry overlapping responsibilities while depending on donations to provide free programs and materials. Collaboration often relies on personal connections, and organizations lack the time, staffing, and shared infrastructure to consistently discover partners, coordinate resources, and follow through on new opportunities. This question highlights the need for a more intuitive way for content creators to manipulate generated characters.’'
        },
        {
          style: 'quote',
          align: 'center',
          text: '”How might we help local nonprofits turn scattered relationships and resources into structured, mutually beneficial collaborations—without adding more administrative work to already stretched teams?’'
        },
      ],
      media: [
        
        { type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/MPAA_Sources/Research &amp; Problem Framing/MPAA_Interview.avif', alt: 'Art Division interview',
          afterParagraph: -1,
         },
         { type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/MPAA_Sources/Research &amp; Problem Framing/MPAA — Research Signals to Product Opportunity.png', alt: 'Research signals to product opportunity synthesis',
          afterParagraph: 0,
        },
      ],
    },
    {
      title: 'DESIGNING THE EXPERIENCE',
      content: [
        {
          title: 'Personalized activity matching',
          text: 'The system aims to match users with activities and partners based on their interests, availability, and goals, reducing the manual effort required to find suitable collaborations.',
        },
         {
          title: 'Turning a match into a proposal',
          text: 'Once a match is identified, the system facilitates turning that connection into a formal proposal, streamlining the process of initiating collaboration.',
        },
        {
          title: 'Following up on proposals',
          text: 'After a proposal is submitted, the system helps track its status and facilitates follow-up actions, ensuring that collaborations move forward effectively.',
        }
      ],
       media: [
        { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/MPAA_Sources/Designing The Experience/MPAA.mp4', 
          afterParagraph: -1,
        },
      ],
    },
    {
      title: 'OUTCOME',
      content:[
      {
        title: 'FROM RESEARCH TO SPONSOR PROPOSAL',
        text: 'Over 14 weeks, our three-person team translated an in-depth interview with Art Division and three sponsor sessions into two iterations of a multi-audience platform prototype. I co-created the information architecture and owned the AI-assisted partnership proposal concept, event discovery and registration flow, and nonprofit dashboard.',
      },
      {
        title:'WHAT THE PROTOTYPE DEMONSTRATED',
        text: 'The final Figma prototype demonstrated how one platform could connect nonprofits, funders, and the public through shared activities, collaboration proposals, and visible community impact. We presented the final concept to MPAA stakeholders, and the student collaboration was later featured in an official MPAA video. A later MPAA website reflects a similar direction around profiles, partnerships, events, and resource exchange. This represents continuity in the organization’s public direction, but is not proof that specific screens or features from our prototype were implemented.',
      },
      ],
    },
  ],
};

// REVIEW NOTES — keep outside CASE_STUDY_DATA so the renderer schema stays unchanged.
// 1. Replace every placeholder with an existing screenshot, prototype recording, or recreated diagram.
// 2. Exact stakeholder feedback is not available; keep the outcome phrased as recalled positive feedback.
// 3. The relationship between the student prototype and the current MP Arts Alliance site is unverified.
// 4. Add teammate names and any additional tools only after confirming what may be published.
