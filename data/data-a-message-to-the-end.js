const CASE_STUDY_DATA = {
  title: 'A Message To The End.',
  category: 'Physical Computing / Unreal Engine 5 / Interactive Installation',
  intro: 'An interactive graduation installation that turns a handwritten farewell into a changing seasonal landscape. Visitors write a message, place it into a handmade mailbox, and trigger a flower animation inside a world built in Unreal Engine 5.',
  author: 'CREATED BY TIM SHIH — SPRING 2026',
  backHref: 'index.html',

  overview: {
    content: [
      '<strong>Project Overview</strong><br><br>A Message To The End. was my eight-week graduation project and a reflection on leaving college. Graduation marked both an ending and a beginning: saying goodbye to familiar people and places while carrying those memories into an uncertain future. I translated that emotional transition into a physical and digital ritual centered on handwritten farewell messages.',
      '<strong>Role & Scope</strong><br><br>I independently developed the concept, interaction, Unreal Engine environment, physical-computing system, and the structure and appearance of the mailbox. My roles included Product Designer and Creative Technologist. The final installation combined Unreal Engine 5, a XIAO ESP32C3 microcontroller, a TCS34725 color sensor, and a custom-built mailbox connected to the exhibition computer through USB-C.',
      '<strong>Final Experience</strong><br><br>A visitor selects a sheet of paper, writes a farewell, and drops it into the mailbox. The sensor detects the incoming letter and sends a signal to the computer. The Unreal Engine experience then randomly selects a seasonal environment and flower response. During the graduation exhibition, the installation collected approximately 60 handwritten messages.',
      '<strong>Watch the Project</strong><br><br><a href="https://youtu.be/6Ebcn9hrrlM" target="_blank" rel="noopener noreferrer">Watch the final installation film</a><br><a href="https://youtu.be/cp0RGuOdbmQ" target="_blank" rel="noopener noreferrer">Watch the mailbox fabrication process</a>',
    ],
    media: [
      { type: 'video', src: 'Img/A Message To The End/Overview/Project_Showcase.mov' },
    ],
  },

  sections: [
    {
      title: 'A Farewell Told Through Four Seasons',
      content: [
        '<strong>Beginning With a Personal Transition</strong><br><br>The project began with the mixed emotions I felt while approaching graduation. College held many personal firsts, friendships, and moments of growth. I wanted the work to create space for people to acknowledge what they were leaving behind instead of treating graduation only as a celebration of what comes next.',
        '<strong>The Spider Lily</strong><br><br>Spider lilies became the central visual symbol because of their associations with separation, longing, and independence. A flower blooming and fading offered a way to represent memory as something temporary but meaningful: an experience can end while still leaving a lasting impression.',
        '<strong>Color and Season</strong><br><br>The original concept assigned four paper colors to four seasons. Red represented spring, pink represented summer, gold represented autumn, and white represented winter. Each letter was intended to call forth its corresponding environment and flower animation, turning an intimate written message into a visible change in the landscape.',
      ],
      media: [
        { type: 'image', src: 'Img/A Message To The End/A Farewell Told Through Four Seasons/Flower Spawn.png', alt: 'Early concept development for the spider lily installation' },
        { type: 'image', src: 'Img/A Message To The End/A Farewell Told Through Four Seasons/4_Season_Flowers.png', alt: 'Early concept development for the spider lily installation' },
        ],
    },
    {
      title: 'Building the Digital World',
      content: [
        '<strong>Choosing Unreal Engine 5</strong><br><br>I considered both TouchDesigner and Unreal Engine 5. I chose Unreal Engine because it gave me more predictable control over a complete three-dimensional environment. Lumen supported atmospheric lighting, Niagara handled particle-based flower effects, and Blueprints allowed me to construct the interaction without relying on a separate programming environment.',
        '<strong>From Visual Reference to 3D Asset</strong><br><br>I used Midjourney images as visual references, then generated an initial flower mesh with Meshy.ai and brought it into Unreal Engine. These tools accelerated exploration, but the project also taught me that generated assets and AI suggestions could not replace understanding the underlying system. When a Blueprint failed, I still needed to trace its logic and rebuild it deliberately.',
        '<strong>Designing the Seasonal System</strong><br><br>I developed four environments that move from spring morning to summer midday, autumn sunset, and winter night. Data Layers organized the seasonal states, while Actor Tags and a custom visibility function controlled which generated flowers appeared. A Current Season Index prevented the same state from being triggered redundantly.',
        '<strong>Making the Transition Feel Alive</strong><br><br>Timeline Nodes shaped each transition with a slow–fast–slow rhythm. I tested changes in camera field of view, motion blur, and lens flares to avoid a simple cut between scenes. An orbiting camera built with an Actor Blueprint, SpringArm, and Camera component gave the environment continuous motion.',
      ],
      media: [
        { type: 'video', src: 'Img\\A Message To The End\\Building the Digital World\\Winter Scene_2.mp4' },
        { type: 'image', src: 'Img\\A Message To The End\\Building the Digital World\\Meshy.AI.png', alt: 'Early Unreal Engine environment development' },
        { type: 'image', src: 'Img\\A Message To The End\\Building the Digital World\\Flower Spawn with Keyboard.png', alt: 'Unreal Engine Data Layer setup for the seasonal environments' },
        { type: 'image', src: 'Img\\A Message To The End\\Building the Digital World\\Camera_Shift.png', alt: 'Blueprint logic for controlling seasonal scene visibility' },
        ],
    },
    {
      title: 'Experimenting, Failing, and Rebuilding',
      content: [
        '<strong>Keeping Flowers Inside the Camera View</strong><br><br>My first flower-placement tests used Line Traces and impact points, but they did not consistently produce compositions that the camera could see. I replaced that approach with three trigger boxes attached to the moving camera. An array and two stages of random selection varied the flower position while keeping each result within the active field of view.',
        '<strong>Connecting a Physical Letter to UE5</strong><br><br>I first prototyped the hardware with Arduino and tested sensors, wiring, and serial communication. Inside Unreal Engine, I used the UE4Duino plugin, Print String debugging, and Switch on String logic to confirm that incoming serial values could trigger the correct Blueprint events.',
        '<strong>Original Concept vs. Exhibited System</strong><br><br>The original plan used the TCS34725 to identify the paper color and select its matching season. In practice, color readings changed with lighting, paper position, and the interior of the mailbox. This made the four-color interaction too unreliable for a public exhibition. I changed the sensor to detect whether a letter had entered the mailbox, then randomized the seasonal and flower response. The final version sacrificed a direct color-to-season mapping in exchange for a stable interaction that visitors could use without instruction or troubleshooting.',
        '<strong>Final Hardware</strong><br><br>The exhibited system used a Seeed Studio XIAO ESP32C3 soldered to a TCS34725 sensor. It connected to the exhibition computer through USB-C. I designed and fabricated the entire physical mailbox, including its structure, exterior, sensor placement, and integration with the digital display.',
      ],
      media: [
        { type: 'image', src: 'Img\\A Message To The End\\Experimenting Failing and Rebuilding\\Flowers Inside the Camera View_1.png', alt: 'Initial microcontroller signal test during physical-computing development' },
        { type: 'image', src: 'Img\\A Message To The End\\Experimenting Failing and Rebuilding\\Flowers Inside the Camera View_2.png', alt: 'TCS34725 sensor after soldering' },
        { type: 'video', src: 'Img\\A Message To The End\\Experimenting Failing and Rebuilding\\Machine_testing_1.mp4', alt: 'Final mailbox design with integrated sensor' },
        { type: 'video', src: 'Img\\A Message To The End\\Experimenting Failing and Rebuilding\\Machine_testing_2.mp4', alt: 'Final mailbox design with integrated sensor' },
        { type: 'video', src: 'Img\\A Message To The End\\Experimenting Failing and Rebuilding\\Furniture_Process.mp4', alt: 'Final mailbox design with integrated sensor' },
      ],
    },
    {
      title: 'From Prototype to Graduation Exhibition',
      content: [
        '<strong>A Complete Public Installation</strong><br><br>The final work brought the handmade mailbox, sensor system, exhibition computer, and seasonal Unreal Engine world together as one installation. Visitors could participate through a familiar action—writing and mailing a note—while the large display transformed that private gesture into a shared visual moment.',
        '<strong>Approximately 60 Farewell Messages</strong><br><br>By the end of the exhibition, the mailbox had collected around 60 handwritten messages. The notes are tangible evidence that visitors understood the invitation and chose to leave something personal behind. Their accumulation also became an unplanned physical archive of the exhibition itself.',
        '<strong>Reflection</strong><br><br>The most important decision was not adding another technical feature, but simplifying the interaction when the original sensing method proved unstable. Building the installation taught me to treat reliability as part of the audience experience and to separate the emotional purpose of an interaction from one specific implementation. The color mapping changed, but the essential ritual—writing a farewell, letting it go, and seeing the world respond—remained intact.',
      ],
      media: [
        { type: 'image', src: 'Img/A Message To The End/From Prototype to Graduation Exhibition/Grad_Show.png', alt: 'Completed interactive mailbox and Unreal Engine installation at the graduation exhibition' },
        { type: 'image', src: 'Img/A Message To The End/From Prototype to Graduation Exhibition/Letters.jpg', alt: 'Approximately 60 handwritten farewell messages collected during the exhibition' },
      ],
    },
  ],
};
