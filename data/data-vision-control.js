const CASE_STUDY_DATA = {
  title: 'VisionControl. AI',
  category: 'Generative AI / Pose Tracking / ML5.JS / Javascript / Stable Diffusion',
  intro: '一個探索介面如何回應人與 AI 協作節奏的概念作品，示範性佔位文字，之後替換成實際案例說明。',
  author: 'CREATED BY TIM SHIH — AI PRODUCT DESIGNER — SPRING 2024 — 14 WEEKS',
  backHref: 'index.html',

  media: [
    { type: 'image', src: 'Img/vision-control-new/03-hero-thumbnail.png', alt: 'VisionControl. AI project thumbnail' },
    { type: 'image', src: 'Img/vision-control-new/04-problem-framing-image-1.png', alt: 'Sample AI-generated pose reference image, first example' },
    { type: 'image', src: 'Img/vision-control-new/05-problem-framing-image-2.png', alt: 'Sample AI-generated pose reference image, second example' },
    { type: 'video', src: 'Img/vision-control-new/06-ml5-pose-tracking-demo.mp4' },
    { type: 'image', src: 'Img/vision-control-new/07-javascript-skeleton-capture.png', alt: 'JavaScript interface capturing red skeletal pose-tracking lines' },
    { type: 'image', src: 'Img/vision-control-new/08-stable-diffusion-controlnet-result.png', alt: 'Stable Diffusion ControlNet generation result' },
  ],

  overview: {
    paragraphs: [
      '"Solving the unpredictability of Generative AI in commercial photography."',
      'This project introduces a pose-guided AI pipeline designed to reduce the high operational costs for small businesses. By integrating real-time pose tracking with stable diffusion, I replaced the \'black box\' nature of AI with a controlled, professional-grade production workflow.',
    ],
  },

  sections: [
    {
      title: 'Problem Framing & Technical Pivot',
      content: 'During my internship, I observed that the financial and time costs of traditional photoshoots were prohibitive for small businesses. My role involved researching AI-driven solutions to streamline this process. Initially, I used LLMs to craft prompts for Text-to-Image generation, but found the results too inconsistent for professional use. Small brands lack the budget and time for professional models, studios, and lengthy post-production, and text-to-image is essentially a \'blind box\'—AI can create, but it lacks the precision for specific poses. The missing link was clear: traditional methods are too slow, while basic AI is too random for commercial use. To achieve higher precision, I pivoted to ControlNet, leveraging specific reference images to provide structural guidance and ensure the AI-generated poses aligned perfectly with our requirements.',
    },
    {
      title: 'Opportunity',
      content: 'How might we create brand imagery by giving small businesses precise, intuitive control over AI-generated poses?',
    },
    {
      title: 'direction',
      content: 'To address this, I want developed a hardware-software integrated pipeline using real-time cameras and API-driven automation.',
    },
    {
      title: 'Process',
      content: 'I came across ML5.js and its ability to track poses through a webcam using red skeletal lines, and began integrating the ML5.js code into my JavaScript project to bring the interactive elements to life. Because ML5.js tracks motion in real-time, I needed a way to freeze a single frame—I solved this by creating a trigger: when the button is pressed, JavaScript executes a function that extracts only the red skeletal lines from the code and saves the result as a PNG file. After obtaining the skeletal maps, I used ControlNet within Stable Diffusion to generate images based on those poses. The technical challenge was a significant learning curve for me, as I had no prior experience with server setup or API integration—I sought guidance from my instructor, which allowed me to successfully navigate these technical hurdles.',
    },
    {
      title: 'After Thoughts',
      content: 'Over these 14 weeks, I have successfully delivered a Proof of Concept that validates my vision. However, there is still significant room for evolution—my future roadmap includes seamlessly integrating diverse models and LoRAs, streamlining the user experience for better intuitiveness, and incorporating LLMs to help users articulate and refine their character prompts more effectively. This course has been incredibly inspiring: while AI replacement is a common concern today, I believe it\'s actually a call to action. By identifying and reimagining how specific fields operate through AI-driven systems, we don\'t just replace old methods—we pave the way for the next wave of innovation.',
    },
  ],
};
