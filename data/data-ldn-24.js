const CASE_STUDY_DATA = {
  title: 'LDN 24',

  category: 'Typography & Graphic Design',

  intro: 'A custom wordmark and black-and-white poster system for a fictional London typography conference, inspired by the city’s industrial bridges and architectural drawings.',

  author: 'CREATED BY TIM SHIH — FALL 2023',

  backHref: 'index.html',

  overview: {
    content: [
      '<strong>Overview</strong><br><br>LDN 24 was a 14-week typography and graphic design project completed in Fall 2023. The assignment was to create an identity for a fictional typography conference in a chosen city, beginning with a custom wordmark and extending it into two large-format posters: black on white and white on black.',
      '<strong>My Role</strong><br><br>Graphic Designer<br><br><strong>Scope</strong><br><br>Concept, custom lettering, visual identity, and poster design<br><br><strong>Tools</strong><br><br>Adobe Illustrator and InDesign',
      '<strong>Conference Context</strong><br><br>The fictional two-day event was designed for an adult audience of designers interested in typography and type design. Each 3 × 6-foot poster needed to carry the LDN 24 wordmark alongside event dates, venue information, and a multi-speaker program while remaining legible in either color inversion.',
    ],

    media: [
      { type: 'image', src: 'Img/Typography Conference/Cover/B&W_Ver.jpg', alt: 'LDN 24 black and white typography conference posters' },
    ],
  },

  sections: [
    {
      title: 'From London to Letterforms',
      content: [
        '<strong>A City With Personal Meaning</strong><br><br>I chose London shortly after returning from a trip there with friends, while my memories of the city were still vivid. The project became an opportunity to translate that personal connection into a visual identity rather than relying on familiar landmarks or literal imagery.',
        '<strong>Inspired by Industrial Structure</strong><br><br>From a distance, London’s iron bridges appeared to be assembled from blocks and lines. Their engineered structure, combined with the visual language of Industrial Age design drawings, inspired a system of cubes, dimensional forms, and wireframe construction. The background behaves like an architectural blueprint, allowing the overall poster to suggest an iron bridge without depicting one directly.',
      ],
    },
    {
      title: 'Building the Wordmark',
      content: [
        '<strong>Constructing Type Like Architecture</strong><br><br>I began with a 3D cube in Illustrator, then duplicated and connected it piece by piece to construct the LDN 24 letterforms. The process felt closer to building a structure than drawing conventional type: each cube became a modular unit, and every letter had to follow the same dimensional logic.',
        '<strong>Balancing Dimension and Consistency</strong><br><br>The central challenge was making the letters feel convincingly three-dimensional while keeping their apparent scale consistent. I repeatedly compared proportions, cube sizes, and viewing angles so the wordmark could read as one typographic family rather than a collection of unrelated forms.',
      ],
    },
    {
      title: 'A Reversible Poster System',
      content: [
        '<strong>Two Posters, One Identity</strong><br><br>The final system uses the same geometric language in two inverted versions. On black, white dimensional letterforms emerge from a dense field of wireframe structures; on white, black forms and lighter construction lines create a more open interpretation. The contrast changes the atmosphere without changing the underlying identity.',
        '<strong>Hierarchy Across a Tall Format</strong><br><br>The narrow 3 × 6-foot composition organizes the wordmark, speaker groups, date, venue, and supporting information along a strong vertical path. Large constructed letters create the primary rhythm, while smaller text blocks and frame elements anchor the conference details without competing with the custom typography.',
      ],
      media: [
        { type: 'image', src: 'Img/Typography Conference/Design/Black_Ver.jpg', alt: 'LDN 24 white-on-black conference poster' },
        { type: 'image', src: 'Img/Typography Conference/Design/White_Ver.jpg', alt: 'LDN 24 black-on-white conference poster' },
      ],
    },
  ],
};
