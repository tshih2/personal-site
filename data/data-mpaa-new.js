// Draft created from the original MPAA portfolio page, the Art Division interview,
// and follow-up interview notes. The CASE_STUDY_DATA schema is unchanged.

const CASE_STUDY_DATA = {
  title: 'Mary Pickford Arts Alliance',

  category: 'Product Design · UX Research · AI-Assisted Collaboration',

  intro: 'A role-based collaboration platform concept that helps Los Angeles arts nonprofits discover partners, share resources, and turn potential collaborations into actionable event proposals.<span class="block mt-12 font-geistmono text-xs uppercase text-label">My Role</span><span class="block mt-3 font-geist text-xs leading-[1.6] text-muted">I originated the core two-sided platform model and helped design the event-proposal flow, nonprofit dashboard, and interactive Figma prototype.</span>',

  author: 'CREATED BY TIM SHIH, Claire Li, Jacey Chung — SPRING 2025 · 14 WEEKS',

  backHref: 'index.html',

  overview: {
    content: [
      '<strong>Sponsored project</strong><br><br>In a 14-week ArtCenter project with the Mary Pickford Foundation, our three-person team researched how Los Angeles arts nonprofits build visibility, secure resources, and collaborate across organizations. We worked together across research, strategy, interface design, prototyping, and presentation.',
      '<strong>Outcome</strong><br><br>We delivered a fully clickable Figma prototype that demonstrated the complete product concept and its role-based flows. It was a design prototype rather than an engineered or deployed system.',
    ],
    media: [
      { type: 'video', src: 'Img/MPAA_Sources/Overview/Promo_Video_Ver_Final.mp4' },
    ],
  },

  sections: [
    {
      title: 'Research & Problem Framing',
      content: [
        '<strong>Our Goal in Project</strong><br><br>Working with the Mary Pickford Foundation, we aimed to bridge the gap between Los Angeles arts nonprofits by designing a platform that could make partnerships, shared resources, and collaborative events easier to initiate and sustain.',
        '<strong>Quote from Interview</strong><br><br>Our team interviewed Art Division\'s main graphic designer, who also taught classes and supported the organization\'s website and social media. He described nonprofit collaboration as “very organic” and “not very formal,” and explained that nearby organizations “don\'t talk to each other often” or collaborate consistently.',
        '<strong>Insight</strong><br><br>Small nonprofit teams carry overlapping responsibilities while depending on donations to provide free programs and materials. Collaboration often relies on personal connections, and organizations lack the time, staffing, and shared infrastructure to consistently discover partners, coordinate resources, and follow through on new opportunities.',
      ],
      media: [
        { type: 'image', src: 'Img/MPAA_Sources/Research &amp; Problem Framing/MPAA — Research Signals to Product Opportunity.png', alt: 'Research signals to product opportunity synthesis' },
        { type: 'image', src: 'Img/MPAA_Sources/Research &amp; Problem Framing/MPAA_Interview.avif', alt: 'Art Division interview' },
      ],
    },
    {
      title: 'Product Strategy',
      content: [
        '<strong>Opportunity</strong><br><br>How might we help local nonprofits turn scattered relationships and resources into structured, mutually beneficial collaborations—without adding more administrative work to already stretched teams?',
        '<strong>From a directory to an active collaboration system</strong><br><br>We chose not to frame the product as a passive list of organizations. The concept connects organizational goals, available resources, proposed activities, and follow-up tasks so that discovering a partner can lead directly to coordinated action.',
        '<strong>Why explore AI</strong><br><br>Our hypothesis was that routine reminders, confirmations, and early proposal organization did not always require manual effort. AI-assisted matching and proposal generation could help surface relevant opportunities, reduce repetitive coordination, and keep the network active. The Art Division interview supported exploring AI as a way to simplify workflows, save time, and generate ideas, but it did not validate the quality of a specific AI model.',
        '<strong>One platform, two modes</strong><br><br>I proposed separating the experience by role. The public-facing website helps general users discover organizations, events, and ways to participate. After authentication, nonprofit members enter a workspace designed for partnership management, proposal review, resources, and progress tracking.',
      ],
      media: [
        { type: 'image', src: 'Img/MPAA_Sources/Product Strategy/MPAA Product Strategy 01 — Strategic Focus.png', alt: 'Strategic focus' },
        { type: 'image', src: 'Img/MPAA_Sources/Product Strategy/MPAA Product Strategy 02 — Feature Prioritization.png', alt: 'Feature prioritization' },
        { type: 'image', src: 'Img/MPAA_Sources/Product Strategy/MPAA Product Strategy 03 — One Platform, Two Modes.png', alt: 'One platform, two modes' },
      ],
    },
    {
      title: 'Designing the Experience',
      content: [
        '<strong>Personalized activity matching</strong><br><br>The concept uses an organization\'s goals, interests, and available resources to surface activities and potential partners that may be a good fit. Recommendations are starting points for human review—not automatic commitments between organizations.',
        '<strong>Turning a match into a proposal</strong><br><br>The event-proposal flow organizes the idea, participating nonprofits, required resources, and next actions in one place. AI can prepare an initial draft, while organizations retain control over reviewing, editing, accepting, or declining the proposal.',
        '<strong>A dashboard for follow-through</strong><br><br>The nonprofit dashboard brings proposals, requests, reminders, and progress updates into a shared view. This responds to the interview finding that collaboration already occurred, but coordination was dispersed and difficult to sustain alongside other responsibilities.',
        '<strong>A complete interactive prototype</strong><br><br>We connected the public and nonprofit-facing journeys in Figma so the end-to-end concept could be explored through clickable interactions. The prototype communicated the proposed information architecture and workflow; it did not contain a working recommendation engine, backend, or live organizational data.',
      ],
      media: [
        { type: 'image', src: 'Img/MPAA_Sources/Designing The Experience/feature 1.png', alt: 'Designing the experience — feature 1' },
        { type: 'image', src: 'Img/MPAA_Sources/Designing The Experience/feature 2.png', alt: 'Designing the experience — feature 2' },
        { type: 'image', src: 'Img/MPAA_Sources/Designing The Experience/feature 3.png', alt: 'Designing the experience — feature 3' },
      ],
    },
    {
      title: 'Outcome & Reflection',
      content: [
        '<strong>Stakeholder presentation</strong><br><br>We presented the final prototype and recall receiving a positive response. Because the exact comments were not retained, this case study does not attribute specific validation claims or quote feedback that cannot be verified.',
        '<strong>What the prototype demonstrated</strong><br><br>The project showed how a role-based platform could connect nonprofit discovery, partnership formation, event proposals, resource exchange, and follow-through within one coherent experience. It also gave the team a concrete way to discuss where AI might reduce coordination overhead while preserving human approval.',
        '<strong>What remained unproven</strong><br><br>The work stopped at an interactive Figma prototype. There was no engineering implementation and no real organizational dataset, so we did not validate recommendation quality, operational adoption, or long-term engagement in a live network.',
        '<strong>A direction that later appeared in public</strong><br><br>A later Mary Pickford Arts Alliance website presents a similar mission around nonprofit profiles, partnerships, projects, resource exchange, and volunteer engagement. This is a retrospective comparison based on the public site—not verified evidence that specific screens or features were implemented from our prototype.',
        '<strong>Reflection</strong><br><br>The project strengthened my ability to translate qualitative research into product strategy, structure a multi-sided information system, and communicate a complex proposal to stakeholders. It also taught me to separate the promise of an AI-assisted concept from what a design prototype can actually prove.',
      ],
    },
  ],
};

// REVIEW NOTES — keep outside CASE_STUDY_DATA so the renderer schema stays unchanged.
// 1. Replace every placeholder with an existing screenshot, prototype recording, or recreated diagram.
// 2. Exact stakeholder feedback is not available; keep the outcome phrased as recalled positive feedback.
// 3. The relationship between the student prototype and the current MP Arts Alliance site is unverified.
// 4. Add teammate names and any additional tools only after confirming what may be published.
