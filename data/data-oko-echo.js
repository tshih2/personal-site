const CASE_STUDY_DATA = {
  title: 'OkoEcho',
  category: 'Product Design / UI/UX Design / Sustainability',
  intro: 'A 14-week personal concept project exploring how invisible carbon costs can become immediate, understandable, and socially motivating. OkoEcho is a Figma interactive prototype that connects personal emissions, city activity, and positive rewards in one mobile experience.',
  author: 'CREATED BY TIM SHIH — 14-WEEK CONCEPT PROJECT',
  backHref: 'index.html',

  overview: {
    content: [
      '<strong>Project Overview</strong><br><br>OkoEcho investigates the information gap between the convenience of modern urban life and its delayed environmental impact. Everyday choices such as transportation, food, shopping, energy use, and technology consumption produce environmental costs that are difficult to recognize at the moment a decision is made.',
      '<strong>The Product Direction</strong><br><br>I designed a mobile experience that translates those hidden costs into personal carbon-emission feedback. A dashboard summarizes progress, an Urban Resonance Map turns activity into a shared city view, and a reward store connects lower-impact behavior with practical benefits.',
      '<strong>Role, Scope & Tools</strong><br><br>I independently completed the research, interviews, product strategy, information architecture, interaction design, visual identity, UI system, motion, and presentation mockups. The project was created over 14 weeks using Figma, After Effects, Illustrator, and Photoshop.',
      '<strong>Project Status</strong><br><br>The result is a Figma interactive prototype rather than a developed application. GPS tracking, receipt and payment integrations, local AI processing, automatic carbon calculations, and reward partnerships are proposed product capabilities; they were not technically implemented or validated in this project.',
    ],
    media: [
      { type: 'image', src: 'Img/OkoEcho/Design MockUp/02.png' },
      { type: 'image', src: 'Img/OkoEcho/Design MockUp/03.png' },
      { type: 'image', src: 'Img/OkoEcho/Design MockUp/04.png' },
      { type: 'image', src: 'Img/OkoEcho/Design MockUp/05.png' },
    ],
  },

  sections: [
    {
      title: 'Research & Problem Framing',
      content: [
        '<strong>Questioning the Cost of Convenience</strong><br><br>The project began with a contradiction I repeatedly encountered: technological progress makes daily life faster and more convenient, while reports of climate change, resource consumption, electronic waste, and ecological damage continue to grow. I asked whether people can meaningfully respond to consequences that remain distant and largely invisible.',
        '<strong>Understanding the System</strong><br><br>I investigated carbon emissions across transportation, industrial manufacturing, technology infrastructure, and everyday habits. The research helped frame environmental impact as a connected urban system rather than a problem caused only by large factories. Convenience-driven decisions—rideshares, fast fashion, food waste, frequent device replacement, and household energy use—also accumulate into a significant footprint.',
        '<strong>Interview Insights</strong><br><br>Qualitative interviews revealed two recurring barriers. Participants understood that environmental protection was important, but awareness alone rarely translated into action. They also perceived sustainable products and choices as more expensive, making environmental responsibility feel like a sacrifice rather than an accessible part of everyday life.',
        '<strong>Composite Personas</strong><br><br>I synthesized the interview findings into three composite personas: Tuki, a budget-conscious international student balancing social life and affordability; Leigh, a long-term city resident concerned about collective environmental responsibility; and Bob, an efficiency-focused professional who needs concrete feedback without sacrificing convenience. These personas represent patterns from the interviews rather than three literal individual participants.',
        '<strong>Problem Statement</strong><br><br>Modern urban life creates a serious information gap between immediate convenience and invisible, delayed environmental harm. Without timely and personal feedback, people struggle to understand the consequences of daily behavior or build enough motivation to change it.',
      ],
      media: [
        { type: 'image', src: 'Img/OkoEcho/Research/Persona.png' },
      ],
    },
    {
      title: 'Product Strategy',
      content: [
        '<strong>How Might We</strong><br><br>How might we help people recognize the carbon cost of daily behavior, create motivation without demanding a lower quality of life, and expand individual action into a visible community effect?',
        '<strong>Design Principle: Feedback Before Guilt</strong><br><br>Instead of relying on fear or abstract global totals, OkoEcho provides feedback close to the moment of action. The product direction combines readable personal data, comparison with past behavior, practical suggestions, social visibility, and rewards so environmental progress can feel achievable.',
        '<strong>Proposed Data Model</strong><br><br>The concept explores permission-based inputs such as movement patterns, receipts, payment notifications, delivery services, and utility bills. Lightweight local AI processing was proposed to classify environmentally relevant activity while limiting unnecessary personal-data exposure. This architecture remains a product hypothesis and would require substantial technical, privacy, and feasibility validation.',
        '<strong>Core Experience</strong><br><br>The user flow moves through four connected stages: authorize selected data sources; review daily and monthly carbon feedback; explore personal and community activity through the Urban Resonance Map; and earn points that can be exchanged for offers from sustainability-focused partners.',
      ],
      media: [
        { type: 'image', src: 'Img/OkoEcho/Research/HMW.png', alt: 'How Might We questions for the OkoEcho project' },
        { type: 'image', src: 'Img/OkoEcho/Design Screen/Wireframe.png', alt: 'OkoEcho splash screen introducing the product experience' },
      ],
    },
    {
      title: 'Designing the Core Experience',
      content: [
        '<strong>Turning Emissions Into Actionable Feedback</strong><br><br>The dashboard prioritizes one clear total, a performance label, comparison with the previous cycle, reduction indicators, trend charts, and a daily highlight. This hierarchy moves from overall status to explanation and finally to a small suggested action, reducing the cognitive load of environmental data.',
        '<strong>Urban Resonance Map</strong><br><br>The map reframes carbon data as a shared urban signal. Proposed activity records appear as green, yellow, or red points according to their relative emission level. Users can explore aggregated neighborhood patterns, review permitted friend activity, and compare results through a leaderboard. The feature is designed as a social motivation concept, not as a working GPS system.',
        '<strong>Closing the Motivation Loop</strong><br><br>OkoEcho converts participation into points that can be redeemed for coupons from environmentally aligned businesses or everyday essentials. The intended loop is simple: understand an action, receive feedback, observe progress, and gain a tangible reason to continue.',
        '<strong>Privacy as a Product Requirement</strong><br><br>Because the concept depends on sensitive behavioral and location data, the Canvas exploration proposed limited collection, local processing, selective keyword extraction, and explicit permission for social visibility. These ideas establish privacy as a design constraint, but they were not technically tested and would require dedicated security and policy work before implementation.',
      ],
      media: [
        { type: 'video', src: 'Img/OkoEcho/Prototype Demo/DashBoard_AE.mp4' },
        { type: 'video', src: 'Img/OkoEcho/Prototype Demo/Map_AE.mp4' },
        { type: 'video', src: 'Img/OkoEcho/Prototype Demo/Redeem_AE.mp4' },
        { type: 'video', src: 'Img/OkoEcho/Prototype Demo/Login_AE.mp4' },
      ],
    },
    {
      title: 'Design System & Prototype',
      content: [
        '<strong>A Calm Environmental Interface</strong><br><br>I used a dark foundation with luminous green accents to connect environmental themes with a contemporary technology product. Rounded cards, restrained borders, and soft gradients organize dense data without making the product feel clinical or punitive.',
        '<strong>Identity</strong><br><br>The OkoEcho mark combines a water drop, a leaf, and a three-part cycle. The symbol reflects ecological resources, natural systems, and the feedback loop between personal behavior and the larger environment.',
        '<strong>Reusable UI Language</strong><br><br>I developed a consistent system for typography, icons, navigation, cards, charts, status colors, inputs, and buttons. Green communicates lower-impact or successful states, yellow signals attention, and orange-red marks comparatively higher-impact activity across the dashboard and map.',
        '<strong>Interactive Prototype</strong><br><br>The final Figma prototype connects onboarding, account creation, the dashboard, emission histories, the Resonance Map, and the coupon-redemption flow. After Effects was used to present the interface through motion and product mockups.',
      ],
      media: [
        { type: 'video', src: 'Img/OkoEcho/Design Screen/_Design Screen.mp4' },
        { type: 'image', src: 'Img/OkoEcho/Design System/Design System.png', alt: '' },
      ],
    },
    {
      title: 'Outcome & Reflection',
      content: [
        '<strong>What the Project Demonstrates</strong><br><br>OkoEcho demonstrates how broad environmental research can be translated into a focused product concept, information architecture, interaction model, visual identity, and high-fidelity prototype. It also shows how personal progress, community visibility, and rewards can be designed as one connected behavioral loop.',
        '<strong>Current Limitations</strong><br><br>The prototype has not undergone usability testing. It does not validate whether the proposed incentives would sustain behavior change, whether emission estimates would be accurate, or whether users would trust the required permissions. The external APIs, AI classification, privacy architecture, partner network, and carbon-calculation methodology remain unimplemented concepts.',
        '<strong>Next Step</strong><br><br>The next iteration should narrow the system to one measurable behavior—such as transportation—and test the complete experience with users. This would allow the feedback language, permission model, calculation transparency, and motivational value to be evaluated before expanding into food, shopping, energy, and community features.',
      ],
      media: [
        
      ],
    },
  ],
};
