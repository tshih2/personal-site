const CASE_STUDY_DATA = {
  title: 'VisionControl. AI',
  category: 'GENERATIVE AI / CREATIVE TECHNOLOGY / POSE TRACKING',
  intro: 'A browser-based AI prototype that turns physical movement into controllable image-generation input. Developed independently over 14 weeks, VisionControl explores how people can communicate visual intent to AI by demonstrating a pose instead of relying on text alone.',
  author: 'CREATED BY TIM SHIH — AI PRODUCT DESIGNER / CREATIVE TECHNOLOGIST — SPRING 2024 — 14 WEEKS',
  backHref: 'index.html',

  overview: {
    content: [
      'When an intention is difficult to describe, let the user demonstrate it directly.',
      'VisionControl is an interactive proof of concept that combines real-time pose tracking with Stable Diffusion and ControlNet. A user can pose in front of a webcam, capture their body position as a skeletal map, and use that structure—together with a text prompt—to guide an AI-generated character.',
      'The project began with a problem I observed during an internship and was developed independently during a 14-week academic course. It allowed me to turn an ambiguous content-production challenge into a functional system while learning unfamiliar technologies, including pose tracking, API integration, ControlNet, and local server configuration.',
    ],
    media: [
      { type: 'image', src: 'Img/VisionControl_Sources/vision-control-new/03-hero-thumbnail.png', alt: 'VisionControl AI project overview' },
      { type: 'image', src: 'Img/VisionControl_Sources/vision-control-new/04-problem-framing-image-1.png', alt: 'Early text-to-image generation experiment' },
      { type: 'image', src: 'Img/VisionControl_Sources/vision-control-new/05-problem-framing-image-2.png', alt: 'Example showing the limitations of controlling poses through text prompts' },
      { type: 'video', src: 'Img/VisionControl_Sources/vision-control-new/06-ml5-pose-tracking-demo.mp4' },
      { type: 'image', src: 'Img/VisionControl_Sources/vision-control-new/07-javascript-skeleton-capture.png', alt: 'JavaScript interface capturing a skeletal pose from the webcam' },
      { type: 'image', src: 'Img/VisionControl_Sources/vision-control-new/08-stable-diffusion-controlnet-result.png', alt: 'AI-generated character following the captured ControlNet pose' },
    ],
  },

  sections: [
    {
      title: 'Research & Problem Framing',
      content: [
        '<strong>Internship Discovery</strong><br><br>During my internship, I was exposed to the operational effort behind producing large volumes of commercial imagery featuring people in different poses.',
        '<strong>Traditional Production Costs</strong><br><br>Traditional photoshoots involve more than hiring models. They also require a production team, locations, scheduling, and significant time spent reviewing and selecting images. While some shoots move quickly, the overall cost and timeline can be difficult to predict. As generative AI began changing how visual content was produced, I saw an opportunity to explore whether it could reduce some of this production overhead.',
        '<strong>Early AI Experiments</strong><br><br>My initial experiments relied on text prompts to describe the subject, composition, and pose. Although the models could produce visually compelling images, the results were not controllable enough for a repeatable production workflow. Requested poses were often interpreted incorrectly, character appearance changed between generations, and detailed instructions competed for the model\'s attention. Describing the composition in depth could weaken the character description, while focusing on the character could reduce control over the composition. Common artifacts—including distorted faces, hands, and extra fingers—also required repeated attempts and manual review.',
        '<strong>Key Pain Points</strong><br><br>The workflow exposed four recurring problems: inaccurate poses, inconsistent characters, competing prompt instructions, and malformed visual details. The problem was therefore not simply generating an image. It was giving people enough control to intentionally direct the result.',
        '<strong>Opportunity Statement</strong><br><br>How might we give content creators direct control over a generated character\'s pose without requiring them to describe every physical detail through text?',
      ],
      media: [
        {
          type: 'image',
          src: {
            desktop: 'Img/VisionControl_Sources/Research &amp; Problem Framing/R&amp;PF_ID+TPC — Internship Discovery + Traditional Production Costs.png',
            mobile: 'Img/VisionControl_Sources/Research &amp; Problem Framing/R&amp;PF_ID+TPC — Internship Discovery + Traditional Production Costs - Mobile.png',
          },
          alt: 'Internship discovery and traditional production costs overview',
        },
        {
          type: 'image',
          src: {
            desktop: 'Img/VisionControl_Sources/Research &amp; Problem Framing/R&amp;PF_EAIE+KPP — Early AI Experiments + Key Pain Points.png',
            mobile: 'Img/VisionControl_Sources/Research &amp; Problem Framing/R&amp;PF_EAIE+KPP — Early AI Experiments + Key Pain Points - Mobile.png',
          },
          alt: 'Early AI experiments and key pain points',
        },
        {
          type: 'image',
          src: {
            desktop: 'Img/VisionControl_Sources/Research &amp; Problem Framing/R&amp;PF_OS — Opportunity Statement.png',
            mobile: 'Img/VisionControl_Sources/Research &amp; Problem Framing/R&amp;PF_OS — Opportunity Statement  - Mobile.png',
          },
          alt: 'Opportunity statement summary',
        },
      ],
    },
    {
      title: 'Solution & Product Direction',
      content: [
        '<strong>Design Principle</strong><br><br>Some poses are difficult to describe, and the right reference image may not always exist. Rather than forcing users to translate every visual intention into words, I explored a more direct interaction: allowing them to demonstrate the pose themselves in front of a camera.',
        '<strong>Live Pose Input</strong><br><br>The prototype used a webcam to track the user\'s body in real time. Once the user found the desired pose, the system captured it as a skeletal map and passed that structural information into the ControlNet generation workflow. The text prompt could then focus on the character, setting, and visual direction without also carrying the full burden of describing body position.',
        '<strong>Reference Image Concept</strong><br><br>The working prototype focused on camera-based pose input. I also envisioned a second input method: uploading an existing reference image when the desired pose was already available. Although image upload was not implemented in the original prototype, it became part of the product direction. Together, the two input methods support a simple principle: use a reference when one exists, and demonstrate the pose directly when showing is easier than describing.',
        '<strong>Proposed System Flow</strong><br><br>Webcam pose or reference image → skeletal pose map → text prompt → ControlNet and Stable Diffusion → generated character following the intended pose.',
      ],
      media: [
        {
          type: 'image',
          src: {
            desktop: 'Img/VisionControl_Sources/Solution &amp; Product Direction/S&amp;PD — Direct Input &amp; System Flow.png',
            mobile: 'Img/VisionControl_Sources/Solution &amp; Product Direction/S&amp;PD — Direct Input &amp; System Flow  - Mobile.png',
          },
          alt: 'Direct input and system flow diagram',
        },
      ],
    },
    {
      title: 'Building the PoC',
      content: [
        '<strong>Technology Stack</strong><br><br>I built the prototype as a browser-based experience using HTML, CSS, and JavaScript in Visual Studio Code. ML5.js handled real-time body tracking, ControlNet provided structural guidance, and Stable Diffusion generated the final image through an API supported by a server configured locally on my MacBook.',
        '<strong>Pose Capture</strong><br><br>ML5.js tracked the user\'s body through the webcam and rendered the detected pose as a skeletal overlay. I created a JavaScript trigger that allowed the user to freeze a chosen moment and extract only the skeleton as an image. The skeletal map became structural input for ControlNet, while a text prompt described the character, environment, and visual direction.',
        '<strong>Integration Challenge</strong><br><br>The most difficult part was getting the complete system to behave correctly. At one stage, the JavaScript and API requests ran without returning code errors, but the ControlNet input had no visible effect on the generated result.',
        '<strong>Debugging Approach</strong><br><br>I separated the pipeline into smaller parts and tested each one independently: webcam tracking, skeletal capture, image export, API generation, and finally the ControlNet connection. This helped me focus on whether data produced the intended behavior at each stage instead of relying only on the absence of error messages.',
        '<strong>Technical Breakthrough</strong><br><br>The breakthrough came when I could move freely in front of the camera and see an AI-generated character reproduce my pose while transforming the person, environment, and visual direction through the prompt. That moment validated the central idea behind VisionControl: physical movement could become a direct form of communication between a person and a generative AI system.',
      ],
      media: [
        {
          type: 'image',
          src: {
            desktop: 'Img/VisionControl_Sources/Build The PoC/BTPC — Debug the Pipeline One Layer at a Time.png',
            mobile: 'Img/VisionControl_Sources/Build The PoC/BTPC — Debug the Pipeline One Layer at a Time  - Mobile.png',
          },
          alt: 'Debugging the pipeline one layer at a time',
        },
        {
          type: 'image',
          src: {
            desktop: 'Img/VisionControl_Sources/Build The PoC/BTPC — From Movement to Generated Image.png',
            mobile: 'Img/VisionControl_Sources/Build The PoC/BTPC — From Movement to Generated Image  - Mobile.png',
          },
          alt: 'From movement to generated image',
        },
      ],
    },
    {
      title: 'Outcome & Reflection',
      content: [
        '<strong>Outcome</strong><br><br>By the end of the 14-week course, I had built a functional interactive prototype connecting physical movement with AI image generation. The project was presented during our department\'s end-of-semester showcase, where a production team documented the students\' work. Faculty and classmates responded positively to the concept and were especially interested in seeing physical movement translated into AI-generated imagery. My instructor highlighted the independent research process and our ability to apply emerging technology toward a working proof of concept.',
        '<strong>What the Prototype Validated</strong><br><br>The prototype demonstrated that a user\'s physical pose could be captured through a standard webcam, transformed into usable ControlNet input, and combined with a text prompt in an image-generation pipeline. It validated the technical feasibility of the concept, but did not yet validate whether the workflow was reliable, efficient, or intuitive enough for professional content-production teams.',
        '<strong>Limitations</strong><br><br>The prototype required a locally configured server and significant computing resources. Because Stable Diffusion and the supporting server were both running on my MacBook, each image took approximately five to ten minutes to generate. I therefore used a prerecorded demonstration during the final presentation rather than asking the audience to wait for a live result. Image upload remained a product concept, the prototype was not tested with professional content creators, and character consistency and common AI artifacts were not fully resolved. I also did not establish a reliable version-control and documentation process, and the original source code was eventually lost.',
        '<strong>What I Learned</strong><br><br>VisionControl taught me how to move from an ambiguous observation to a testable technical system. I entered the project without prior experience in server configuration or AI API integration, but learned to break unfamiliar problems into smaller parts, test them independently, and reconnect them into a working experience. It also changed how I think about human–AI interaction: better results do not always come from asking users to write more precise prompts. Sometimes the more natural interface is to let people show the system what they mean.',
      ],
    },
    {
      title: 'Rebuilding VisionControl',
      content: [
        '<strong>Why Rebuild It</strong><br><br>I am now rebuilding VisionControl as a web-based product that people can try online. The rebuild is an opportunity to preserve the original interaction, address the prototype\'s technical limitations, and document the development process more responsibly.',
        '<strong>Experience Goals</strong><br><br>The new version will support both live camera input and uploaded reference images, convert either input into a pose condition, combine the pose with character, setting, and visual-direction prompts, and return a result without requiring users to configure their own AI server. It will also provide clear progress and fallback states when generation is slow or unavailable.',
        '<strong>Technical Goals</strong><br><br>The rebuild will replace the local generation setup with a hosted inference workflow and target a substantially shorter waiting time. The development process will be preserved through version control, architecture documentation, experiment records, screenshots, and video.',
        '<strong>Ongoing Documentation</strong><br><br>This section will continue to grow as the new system is designed, built, tested, and deployed. When complete, the case study will include a public experience link, a demonstration video, and documented findings from user testing.',
      ],
    },
  ],
};
