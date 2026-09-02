const CASE_STUDY_DATA = {
  layout: 'continuous',
  title: 'A Message To The End.',
  category: 'INTERACTION DESIGN / PHYSICAL COMPUTING / INTERACTIVE INSTALLATION',
  intro: 'An exhibited installation that transforms a handwritten farewell into a changing seasonal landscape. Visitors write a message, place it inside a handmade mailbox, and trigger a flower response in Unreal Engine 5.<span class="block mt-12 font-geistmono text-xs uppercase text-label">My Role</span><span class="block mt-3 font-geist text-xs leading-[1.6] text-muted">I independently developed the concept, interaction, Unreal Engine environment, physical-computing system, and handmade mailbox over eight weeks.</span>',
  author: 'CREATED BY TIM SHIH — SPRING 2026',
  backHref: 'index.html',

  overview: {
    content: [
      {
        title:'A Ritual for Letting Go',
        text:'Graduation felt like both an ending and a beginning. I designed a physical and digital ritual that invited people to acknowledge what they were leaving behind: write a farewell, place it inside a mailbox, and watch the surrounding world respond.'
      },
      {
        title:'The Exhibited Experience',
        text:'The final installation connected a handmade mailbox and sensor to an Unreal Engine environment. Each inserted letter triggered a randomized season and flower animation. Approximately 60 handwritten messages were collected during the graduation exhibition.'
      }
    ],
    media: [
      { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/A Message To The End/Overview/Project_ShowCase_Subtitled.mp4', afterParagraph: -1 },
    ],
  },

  sections: [
    {
      title: 'DESIGNING THE DIGITAL WORLD',
      content: [
        {
          title:'A Farewell Told Through Four Seasons',
          text:'Spider lilies became the central symbol because of their associations with separation, longing, and independence. Four environments—spring morning, summer midday, autumn sunset, and winter night—presented transition as a cycle rather than a final ending.',
        },
        {
          title:'Building the World in Unreal Engine',
          text:'I chose Unreal Engine 5 for its control over a complete three-dimensional environment. Lumen shaped the atmospheric lighting, Niagara generated the flower effects, and Blueprints and Data Layers controlled the seasonal states and transitions.'
        },
        {
          title:'Keeping Every Response Visible',
          text:'My first flower-placement system often generated results outside the camera view. I replaced it with trigger areas attached to the moving camera, preserving visual variation while keeping each flower composition visible to the audience.',
        }
      ],
      media: [
        { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/A Message To The End/Building the Digital World/Winter Scene_2.mp4',afterParagraph:-1 },

        { type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/A Message To The End/Building the Digital World/Flower Spawn with Keyboard.png', alt: 'Unreal Engine Data Layer setup for the seasonal environments',afterParagraph: 1 },
        { type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/A Message To The End/A Farewell Told Through Four Seasons/4_Season_Flowers.png', alt: 'Early concept development for the spider lily installation',afterParagraph: 0 },
        ],
    },
    {
      title:'BUILDING THE PHYSICAL INTERACTION',
      content:[
        {
          title:'Connecting a Letter to Unreal Engine',
          text:'The mailbox used a XIAO ESP32C3 microcontroller and a TCS34725 sensor. When a letter entered the box, the signal traveled through USB serial communication and triggered the corresponding Blueprint event in Unreal Engine.'
        },
        {
          title:'Simplifying for Exhibition Reliability',
          text:'The original concept assigned different paper colors to four seasons. In practice, color readings changed with lighting, paper position, and the interior of the mailbox. For the exhibition, I simplified the sensor to detect letter entry and randomized the seasonal response. This removed the direct color-to-season relationship, but created a more reliable interaction that visitors could use without instructions or troubleshooting.',
        },
        {
          title:'Making the Interface Part of the Story',
          text:'I designed and fabricated the mailbox structure, exterior, sensor placement, and connection to the exhibition computer. Its familiar form made the technical interaction feel like a simple act of sending a personal letter.',
        },
      ],
      media: [
        { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/A Message To The End/Experimenting Failing and Rebuilding/Machine_testing_2.mp4', alt: 'Final mailbox design with integrated sensor', afterParagraph:-1 },
        { type: 'video', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/A Message To The End/Experimenting Failing and Rebuilding/Furniture_Process.mp4', alt: 'Final mailbox design with integrated sensor',afterParagraph: 0 },

      ],

    },
    {
      title: 'EXHIBITION & REFLECTION',
      content: [
        {
          title:'Approximately 60 Farewells',
          text:'During the graduation exhibition, visitors left approximately 60 handwritten messages. Together, the letters became a physical archive of the people, memories, and transitions surrounding the event.',
        },
        {
          title:'Reliability Is Part of the Experience',
          text:'The most important decision was not adding another technical feature, but simplifying the system when the original sensing method proved unreliable. The color mapping changed, but the essential ritual remained intact: write a farewell, let it go, and see the world respond.',
        }
        ],
      media: [
        { type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/A Message To The End/From Prototype to Graduation Exhibition/Grad_Show.png', alt: 'Completed interactive mailbox and Unreal Engine installation at the graduation exhibition',afterParagraph:0 },
        { type: 'image', src: 'https://pub-8db552ff737f4c078c20b51e96636eb5.r2.dev/Img/A Message To The End/From Prototype to Graduation Exhibition/Letters.jpg', alt: 'Approximately 60 handwritten farewell messages collected during the exhibition', afterParagraph:-1 },
      ],
    },
  ],
};
