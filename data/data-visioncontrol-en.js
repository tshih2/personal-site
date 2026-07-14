const CASE_STUDY_DATA = {
  // 左欄大標題
  title: 'VisionControl.AI',

  // 標題下方的分類標籤
  category: 'Generative AI · Computer Vision',

  // 左欄的介紹段落,一段文字(不是陣列)
  intro: 'A proof-of-concept tool that lets designers control AI image generation with real-time body pose tracking — built to solve a very specific frustration from my internship: AI-generated marketing photos you can look at, but can\'t actually control.',

  // 左欄底部的作者/meta 資訊
  author: 'CREATED BY TIM SHIH — ARTCENTER COLLEGE OF DESIGN, 2026',

  // 「← BACK」連結目標
  backHref: 'index.html',

  // 中欄 Overview 的媒體堆疊
  media: [
    { type: 'placeholder', label: 'Demo: live pose capture next to the generated result' },
    { type: 'placeholder', label: 'Pipeline diagram — webcam to skeleton to ControlNet to Stable Diffusion' },
    { type: 'placeholder', label: 'Sample generated outputs across different poses' },
  ],

  // Overview 右側的描述文字
  overview: {
    paragraphs: [
      'VisionControl.AI is a proof-of-concept system that lets you steer an AI image generator with your own body. Stand in front of a webcam, strike a pose, and the system reads your skeleton in real time, feeds it into ControlNet, and generates an image through Stable Diffusion that follows the exact composition you gave it.',
      'Most AI tools that small brands use for marketing photos are cheap and fast, but the results are a gamble — the same prompt can return five unrelated compositions in five tries. VisionControl.AI trades that gamble for direct, physical control.',
    ],
  },

  // 底下的手風琴區塊
  sections: [
    {
      title: 'Research',
      content: 'This project started with my own frustration. During my internship, I was doing AI research for marketing and ad asset generation, and I kept hitting the same wall in my own work.\n\nThree limits stood out. Pose and composition were basically uncontrollable — the same prompt could produce a completely different composition every time. Visual style drifted from one generation to the next. And getting a model to behave consistently meant a customization pipeline most small teams don\'t have the budget or technical background to run.\n\nI spent a lot of my own time outside work digging through open-source projects, trying to get around exactly those three limits. That\'s really where this project started — not a formal user study, just frustration turning into curiosity.\n\nStepping back from my own experience, I kept coming back to small ecommerce sellers and independent brand owners. They need product and marketing photography that looks consistent and on-brand, but a full photoshoot for every SKU or campaign isn\'t realistic on their budget. I\'ll be upfront that this persona is a working hypothesis built from my internship and my own research, not something I\'ve validated with interviews yet.',
    },
    {
      title: 'Process',
      content: 'What if your pose was the prompt? That question is the core of VisionControl.AI: instead of typing increasingly specific descriptions and hoping, a designer can steer an AI image generator directly, with their own body.\n\nHere\'s how it works. A webcam feed runs through ML5.js, which does real-time pose detection and extracts a skeleton from whatever position you\'re standing in. That skeleton becomes the conditioning input for ControlNet, paired with a text prompt, and passed into Stable Diffusion. The model generates an image that respects both the pose you gave it and the style or subject you described.\n\nIn practice, that means standing in front of a webcam, trying a few poses while watching a live skeleton overlay, locking in the one that matches the shot you want, and generating from there.',
    },
    {
      title: 'Outcome & Reflection',
      content: 'The core hypothesis held up: skeleton input reliably steers what Stable Diffusion produces, and the output follows the pose and the prompt together instead of drifting into something unrelated.\n\nSo far, I\'ve only tested this on myself — there\'s no external user testing yet, and the system doesn\'t have an interface for picking between different LoRA models or style presets, which would matter for a brand that wants a consistent look across shoots. Both are next on my list.\n\nWhat three months of building this really changed for me: I used to treat generative tools as something you prompt and hope. This project convinced me that a designer can build direct, physical control into an AI system instead of leaving the result to chance. I also got real, hands-on experience wiring a machine learning pipeline into an actual interactive experience end to end. And I have more confidence now that the pain point I felt at my internship is real, and specific enough that the right interaction design can actually solve it.',
    },
  ],
};
