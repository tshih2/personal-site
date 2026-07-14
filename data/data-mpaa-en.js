const CASE_STUDY_DATA = {
  // 左欄大標題
  title: 'The Mary Pickford Arts Alliance',

  // 標題下方的分類標籤
  category: 'Product Design · Sponsored Project',

  // 左欄的介紹段落,一段文字(不是陣列)
  intro: 'A digital platform that helps LA-based arts nonprofits showcase their work, find collaborators, and share resources — with AI-assisted matching at the core.',

  // 左欄底部的作者/meta 資訊
  author: 'CREATED BY TIM SHIH, JACEY CHUNG & CLAIRE LI — DESIGNMATTERS AT ARTCENTER, FALL 2024, 14 WEEKS',

  // 「← BACK」連結目標
  backHref: 'index.html',

  // 中欄 Overview 的媒體堆疊
  media: [
    { type: 'placeholder', label: 'Hero video — reuse existing Framer hero asset' },
    { type: 'placeholder', label: 'Research/interview photo' },
    { type: 'placeholder', label: 'Persona / sample project' },
    { type: 'placeholder', label: 'Solution / prototype overview' },
    { type: 'placeholder', label: 'Closing video — reuse existing Framer closing asset' },
  ],

  // Overview 右側的描述文字
  overview: {
    paragraphs: [
      'Working with the Mary Pickford Foundation and Designmatters at ArtCenter, our team of three designed a platform to help LA’s arts nonprofits stop working in silos: a public project showcase to drive donations, AI-powered collaboration matching, and a resource-sharing marketplace.',
    ],
  },

  // 底下的手風琴區塊
  sections: [
    {
      title: 'Our Goal In Project',
      content: 'The Arts Consortium LA, created by the Mary Pickford Foundation, works with nonprofit arts organizations across Los Angeles that use art as a tool for mental health and social change. Our goal was to help these nonprofits collaborate more effectively within their own local ecosystem — instead of continuing to work in isolation from each other.',
    },
    {
      title: 'Quote From Interview',
      content: '“How do we build connections with other nonprofits that are just a few blocks away?” — Guillermo Perez, Art Division\n\n“Showcasing successful projects and collective programs can increase visibility and exposure to find donors.”\n\n“How can we share the resources? Can our students use resources from other organizations? We need to find available spaces within the community and explore partnerships.”',
    },
    {
      title: 'Insight',
      content: 'Three things came up again and again across our interviews with Keith, Cynthia, and Art Division’s Guillermo Perez: nonprofits that showcase their work well have an easier time finding donors; nonprofits rarely have any real channel to connect with peers doing similar work nearby; and resources like space, equipment, and expertise often sit unused because there’s no way to match orgs that have them with orgs that need them.',
    },
    {
      title: 'Opportunity',
      content: 'How might we help nonprofits collaborate more effectively within their local ecosystem — streamlining communication, sharing resources and ideas, and helping them tell their story in a way that resonates with the public?',
    },
    {
      title: 'My Role',
      content: 'My role covered research and product design across the full process. I helped run and synthesize the stakeholder interviews, build the two personas (an individual donor and an arts nonprofit) directly from that interview data, and design the three core features — iterating through multiple rounds of critique on the AI-matching screens in particular.',
    },
    {
      title: 'Solution & Features',
      content: 'Collaborative Project Showcase — A public showcase where nonprofits post their projects and collective programs, built to increase visibility and help them find donors, including a path toward larger state or federal funding for smaller orgs.\n\nAI-Powered Collaboration Matching — The AI collects and analyzes each nonprofit’s resource data and suggests matches: potential collaborators nearby, and donors whose interests align with a given org’s mission.\n\nResource-Sharing Marketplace — A marketplace where nonprofits list spare resources — space, equipment, expertise — so organizations that need them can find and request them directly.',
    },
    {
      title: 'After Thoughts',
      content: 'This was a 14-week sponsored project with Designmatters and Arts Consortium LA, and I want to be upfront about where it stands. We validated the problem and the personas against real interview data, but we never ran the AI matching against real resource or donor data, so I can’t say yet how good those recommendations actually are. We also never tested the full flow with real users end to end, and there’s no formal, ongoing collaboration workflow between real nonprofits in place. The project ended at a high-fidelity prototype, presented to our instructors and to people connected with Arts Consortium LA.\n\nWhat makes this one feel different from a typical class project: Mary Pickford Arts Alliance has since built an actual, live site on the foundation our work laid, at mpartsalliance.org. I don’t know exactly how much of our specific screens carried over versus how much they rebuilt independently, but knowing our direction became a real starting point for something that shipped is a different kind of validation than a grade.\n\nThis project taught me three specific things: design restraint on AI features is its own skill, since an AI feature can look impressive and get in the user’s way at the same time; talking to real nonprofit stakeholders surfaces detail a desk-research persona never would; and a three-person team needs explicit division of research, design, and iteration rather than assuming it will sort itself out.',
    },
  ],
};
