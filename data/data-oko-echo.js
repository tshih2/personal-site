const CASE_STUDY_DATA = {
  layout: 'continuous',
  title: 'OkoEcho',
  category: 'Product Design / UI/UX Design / Sustainability',
  intro: 'An interactive Figma prototype that makes the hidden carbon cost of everyday choices easier to understand through personal feedback, shared city signals, and practical rewards.',
  author: 'CREATED BY TIM SHIH — 14-WEEK CONCEPT PROJECT',
  backHref: 'index.html',

  overview: {
    content: [
      {
        title:'Making Environmental Impact Visible',
        text: 'Everyday choices create environmental costs that are difficult to recognize in the moment. OkoEcho explores how a mobile experience could connect personal emissions, community activity, and rewards—making lower-impact behavior feel more understandable and achievable.',
      }
    ],
    media: [
      { type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/OkoEcho/Design%20MockUp/02_2.png', afterParagraph: -1 },
      { type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/OkoEcho/Design%20MockUp/03_3.png', afterParagraph: -1 },
      { type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/OkoEcho/Design%20MockUp/04_4.png', afterParagraph: -1 },
      { type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/OkoEcho/Design%20MockUp/05_5.png', afterParagraph: -1 },
    ],
  },

  sections: [
    {
      title: 'RESEARCH',
      content: [
        {
          title:'Awareness Did Not Become Action',
          align:'right',
          text:'Interview participants understood the importance of environmental protection, but awareness rarely translated into action. Sustainable choices were often perceived as more expensive or inconvenient, while the impact of everyday behavior remained distant and invisible.',
        },
        {
          title:'From Interviews to Priorities',
          align:'right',
          text:'I synthesized the research into three composite personas representing different motivations, financial constraints, and tolerance for effort. The central opportunity was not simply providing more information, but making environmental feedback timely, personal, and actionable.',
        },
        {
          style: 'quote',
          align:'center',
          text:'“How might we make the carbon cost of daily behavior visible without asking people to sacrifice their quality of life?”'
        }
      ],
      media: [
        { type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/OkoEcho/Research/Persona.png',afterParagraph:-1, },
      ],
    },
    {
      title: 'PRODUCT DIRECTION',
      content: [
        {
          title:'Feedback Before Guilt',
          align:'right',

          text:'Rather than relying on fear or abstract global totals, OkoEcho brings feedback closer to the moment of action. Personal progress, small suggestions, community visibility, and rewards work together to make change feel achievable.',
        },
        {
          title:'A Permission-Based Concept',
          align:'right',
          text:'The concept proposes using selected signals from movement, purchases, deliveries, and utilities to estimate environmental impact. Local processing and explicit sharing controls were explored as privacy safeguards, but the architecture was not technically tested.',
        },
        {
          title:'Core Flow',
          align:'right',
          text:'Choose data permissions → review personal feedback → explore community activity → earn rewards for lower-impact choices.',
        }

      ],
      media: [
        { type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/OkoEcho/Design Screen/Wireframe.png', alt: 'OkoEcho splash screen introducing the product experience', afterParagraph:-1 },
      ],
    },
    {
      title: 'CORE EXPERIENCE',
      content: [
        {
          title:'Personal Carbon Dashboard',
          text:'The dashboard prioritizes one clear total, comparison with previous activity, progress trends, and a small suggested action. The hierarchy moves from overall status to explanation without overwhelming users with environmental data.',
        },
        {
          title:'Urban Resonance Map',
          text:'The map transforms individual activity into a shared city signal. Color-coded points help users explore relative impact across neighborhoods and understand how personal behavior connects to a larger community pattern.',
        },
        {
          title:'Closing the Motivation Loop',
          text:'Lower-impact activity earns points that can be exchanged for practical rewards. The intended loop is simple: understand an action, receive feedback, observe progress, and gain a reason to continue.',
        },
        // {
        //   title:'Visual System and Prototype',
        //   text:'Dark surfaces, luminous green accents, rounded cards, and consistent status colors organize dense information without making the experience feel clinical or punitive. The final Figma prototype connects onboarding, the dashboard, emission history, the Resonance Map, and reward redemption in one interactive flow.',
        // },
],
      media: [
        { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/OkoEcho/Prototype Demo/DashBoard_AE.mp4',afterParagraph:-1 },
        { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/OkoEcho/Prototype Demo/Map_AE.mp4',afterParagraph:0 },
        { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/OkoEcho/Prototype Demo/Redeem_AE.mp4',afterParagraph:1 },
        { type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/OkoEcho/Design System/Design System.png', afterParagraph:2 },

        // { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/OkoEcho/Prototype Demo/Login_AE.mp4' },
      ],
    },
    // {
    //   title: 'Design System & Prototype',
    //   content: [
    //     '<strong>A Calm Environmental Interface</strong><br><br>I used a dark foundation with luminous green accents to connect environmental themes with a contemporary technology product. Rounded cards, restrained borders, and soft gradients organize dense data without making the product feel clinical or punitive.',
    //     '<strong>Identity</strong><br><br>The OkoEcho mark combines a water drop, a leaf, and a three-part cycle. The symbol reflects ecological resources, natural systems, and the feedback loop between personal behavior and the larger environment.',
    //     '<strong>Reusable UI Language</strong><br><br>I developed a consistent system for typography, icons, navigation, cards, charts, status colors, inputs, and buttons. Green communicates lower-impact or successful states, yellow signals attention, and orange-red marks comparatively higher-impact activity across the dashboard and map.',
    //     '<strong>Interactive Prototype</strong><br><br>The final Figma prototype connects onboarding, account creation, the dashboard, emission histories, the Resonance Map, and the coupon-redemption flow. After Effects was used to present the interface through motion and product mockups.',
    //   ],
    //   media: [
    //     { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/OkoEcho/Design Screen/_Design Screen.mp4' },
    //     { type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/OkoEcho/Design System/Design System.png', alt: '' },
    //   ],
    // },
    {
      title: 'OUTCOME & REFLECTION',
      content: [
        {
          title:'TESTING-LED ITERATION',
          text:'I conducted three interviews with people living in Berlin followed by two rounds of prototype testing and iteration. Feedback led me to refine the interface and introduce the Resonance Map, which allows users to compare personal activity with signals from friends and surrounding neighborhoods. Participants responded positively to the map’s ability to make collective behavior visible, suggesting that community-level feedback could encourage people to reflect on their own choices.',
        },
        {
          title:'WHAT THE PROTOTYPE DEMONSTRATED',
          text:'The final Figma prototype connected three core ideas—personal carbon tracking, shared city signals, and practical rewards—into one behavioral loop. It established a coherent product and visual direction, but did not prove carbon-data accuracy or sustained behavior change. A future iteration should test one measurable behavior before expanding the system.',
        }
],
      media: [
        { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/OkoEcho/Design Screen/_Design Screen.mp4', afterParagraph:-1, },
      ],
    },
  ],
};
