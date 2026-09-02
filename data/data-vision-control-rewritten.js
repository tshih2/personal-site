const CASE_STUDY_DATA = {
  layout: 'continuous',
  title: 'VisionControl.AI',
  category: 'GENERATIVE AI / CREATIVE TECHNOLOGY / POSE TRACKING',
  intro: 'A browser-based AI prototype that turns physical movement into controllable image-generation input. Developed independently over 14 weeks, VisionControl explores how people can communicate visual intent to AI by demonstrating a pose instead of relying on text alone.',
  author: 'CREATED BY TIM SHIH — AI PRODUCT DESIGNER / CREATIVE TECHNOLOGIST — SPRING 2024 — 14 WEEKS',
  backHref: 'index.html',

  overview: {
    content: [
      {
        text: 'VisionControl.AI is an interactive proof of concept that combines real-time pose tracking with Stable Diffusion and ControlNet. A user can pose in front of a webcam, capture their body position as a skeletal map, and use that structure together with a text prompt—to guide an AI-generated character.',
      }
    ],
    media: [
      { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/VisionControl_Sources/Vision Control Demo/Vision Control Demo.mp4', alt: 'VisionControl demo video', afterParagraph: -1 },
    ],
  },

  sections: [
    {
      title: 'RESEARCH',
      content: [
        'Traditional image production requires creators to communicate precise visual intent across people and tools. As generative AI entered this workflow, I noticed that text prompts were especially weak at describing spatial details such as body position. I narrowed the experiment to one question: could creators communicate pose through demonstration rather than description?',
        {
          style: 'quote',
          align: 'center',
          text: '”How might we give content creators direct control over a generated character’s pose without requiring them to describe every physical detail through text?’'
        },
      ],
      
      media: [
        {
          type: 'image',
          src: {
            desktop: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/VisionControl_Sources/Research & Problem Framing/R&PF_ID+TPC — Internship Discovery + Traditional Production Costs - Mobile.png',
            mobile: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/VisionControl_Sources/Research & Problem Framing/R&PF_ID+TPC — Internship Discovery + Traditional Production Costs - Mobile.png',
          },
          alt: 'Internship discovery and traditional production costs overview',
          afterParagraph: -1,
        },
      ],
    },

    {
      title: 'SOLUTION & DIRECTION',
      // 示範:順序改成「影片 > content > 圖片」——影片用 afterParagraph:
      // -1 放在這個 section 的第一段文字之前;兩張圖改成 afterParagraph:
      // 2(=最後一段文字的 index),排在所有內文段落之後。同一個
      // afterParagraph 值如果有多個素材,會照它們在 media 陣列裡原本的
      // 順序依序排列(POSES.png 先、S&PD 那張後),不需要額外欄位控制
      // 同一個位置裡的排序。
      media: [
        { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/VisionControl_Sources/vision-control-new/06-ml5-pose-tracking-demo.mp4', alt: 'Live pose-tracking experiment', afterParagraph: -1 },
        {
          type: 'image',
          src: {
            desktop: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/VisionControl_Sources/Solution & Product Direction/POSES.png',
            mobile: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/VisionControl_Sources/Solution & Product Direction/POSES.png',
          },
          alt: 'Pose to image workflow diagram',
          afterParagraph: 0,
        },
        {
          type: 'image',
          src: {
            desktop: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/VisionControl_Sources/Solution & Product Direction/S&PD — Direct Input & System Flow  - Mobile.png',
            mobile: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/VisionControl_Sources/Solution & Product Direction/S&PD — Direct Input & System Flow  - Mobile.png',
          },
          alt: 'Pose to image workflow diagram',
          afterParagraph: 1,
        },
      ],
      content: [
        {
          title: 'Live Pose Input',
          align: 'right',
          text: 'The prototype used a webcam to track the users body in real time. Once the user found the desired pose, the system captured it as a skeletal map and passed that structural information into the ControlNet generation workflow. The text prompt could then focus on the character, setting, and visual direction without also carrying the full burden of describing body position.',
        },
        {
          title: 'Reference Image Concept',
          text: 'The working prototype focused on camera-based pose input. I also envisioned a second input method: uploading an existing reference image when the desired pose was already available. Although image upload was not implemented in the original prototype, it became part of the product direction. Together, the two input methods support a simple principle: use a reference when one exists, and demonstrate the pose directly when showing is easier than describing.',
        },
        {
          title: 'Proposed System Flow',
          align: 'right',
          text: 'Webcam pose or reference image → skeletal pose map → text prompt → ControlNet and Stable Diffusion → generated character following the intended pose.',
        }
      ],

    },

    {
      title: 'OUTCOME REFLECTION',
      media: [
        { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/VisionControl_Sources/Vision Control Demo/Vision Control Demo.mp4', alt: 'VisionControl demo video', afterParagraph: -1 },
      ],
      content: [
        'VisionControl taught me how to move from an ambiguous observation to a testable technical system. I entered the project without prior experience in server configuration or AI API integration, but learned to break unfamiliar problems into smaller parts, test them independently, and reconnect them into a working experience. It also changed how I think about human–AI interaction: better results do not always come from asking users to write more precise prompts. Sometimes the more natural interface is to let people show the system what they mean.',
      ],

    },
  ],
};
