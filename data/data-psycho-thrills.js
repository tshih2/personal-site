const CASE_STUDY_DATA = {
  title: 'Psycho Thrills',

  category: 'Editorial & Graphic Design',

  intro: 'A two-color film-series identity designed to work as both a 22 × 33-inch poster and a folded brochure, balancing psychological tension with visual attraction.',

  author: 'CREATED BY TIM SHIH — FALL 2023',

  backHref: 'index.html',

  overview: {
    content: [
      '<strong>Overview</strong><br><br>Psycho Thrills was a 14-week graphic design project completed in Fall 2023. I independently researched and curated a ten-title psychological thriller series, then created a unified calendar in two formats: a large poster and a folded brochure.',
      '<strong>Design Challenge</strong><br><br>The same visual system had to remain balanced at poster scale while becoming clear and intentional after folding. The project required more than adapting one layout to a smaller page: every image, title, and screening detail needed to work across two different reading experiences.',
    ],

    // 素材來源:Img/PsychoThriller_Sources/(原本是 Framer 上的遠端圖床
    // 網址,現在 Tim 提供了本地素材,換成本地路徑——Poster/ 是海報實拍
    // 情境照跟細節照,Brochure/ 是折頁手冊的封面跟內頁展開照。
    // Cover/Poster_Close-up_4.jpg 跟 Poster/Poster_Close-up_4.jpg 是同一
    // 個檔案(md5 核對過),Cover/ 那份專門給首頁 Works 卡片縮圖用,這裡
    // 沿用 Poster/ 底下的那份。
    media: [
      { type: 'image', src: 'Img/PsychoThriller_Sources/Poster/Black_Framed_Poster_Mockup.jpg', alt: 'Psycho Thrills poster displayed in an outdoor framed signage mockup' },
      { type: 'image', src: 'Img/PsychoThriller_Sources/Poster/Poster_Close-up_1.jpg', alt: 'Close-up of the rolled poster showing the film schedule and screening details' },
      { type: 'image', src: 'Img/PsychoThriller_Sources/Poster/Poster_Close-up_2.jpg', alt: 'Close-up of the rolled poster from an alternate angle, showing the Psycho Thrills wordmark' },
      { type: 'image', src: 'Img/PsychoThriller_Sources/Poster/Poster_Close-up_4.jpg', alt: 'Detail of the poster’s central portrait imagery and typography' },
      { type: 'image', src: 'Img/PsychoThriller_Sources/Poster/Poster_Close-up_5.jpg', alt: 'Full poster laid flat, showing the complete two-color photographic collage and film listings' },
      { type: 'image', src: 'Img/PsychoThriller_Sources/Poster/Poster_Close-up_6.jpg', alt: 'Detail of the poster’s screening schedule and film information' },
      { type: 'image', src: 'Img/PsychoThriller_Sources/Brochure/Front_Cover.jpg', alt: 'Brochure front cover alongside the unfolded interior spread' },
      { type: 'image', src: 'Img/PsychoThriller_Sources/Brochure/Back_Cover.jpg', alt: 'Brochure back cover' },
      { type: 'image', src: 'Img/PsychoThriller_Sources/Brochure/Front_Back_Cover.jpg', alt: 'Brochure front and back covers shown together, with the full ten-title screening schedule' },
      { type: 'image', src: 'Img/PsychoThriller_Sources/Brochure/Page_2-3.jpg', alt: 'Brochure interior spread with screening details' },
      { type: 'image', src: 'Img/PsychoThriller_Sources/Brochure/Page_4-5.jpg', alt: 'Brochure interior spread with screening details' },
      { type: 'image', src: 'Img/PsychoThriller_Sources/Brochure/Page_6-7.jpg', alt: 'Brochure interior spread with screening details' },
      { type: 'image', src: 'Img/PsychoThriller_Sources/Brochure/Page_8-9.jpg', alt: 'Brochure interior spread with screening details' },
      { type: 'image', src: 'Img/PsychoThriller_Sources/Brochure/Page_10-11.jpg', alt: 'Brochure interior spread with screening details' },
    ],
  },

  sections: [
    {
      title: 'Brief & Constraints',
      content: [
        '<strong>One Calendar, Two Formats</strong><br><br>The course brief called for a curated film-series calendar using the same design as both a 22 × 33-inch poster and a brochure folded to 5.5 × 11 inches. The final piece needed to present ten weekly selections with each title’s date, director, year, runtime, and short synopsis.',
        '<strong>Designing Within Print Rules</strong><br><br>The identity was limited to two colors and no more than two typefaces. Photography had to remain high enough in quality for full-size 300 dpi printing. These restrictions made image selection, typography, and hierarchy part of a single system rather than separate styling decisions.',
      ],
    },
    {
      title: 'Concept & Visual Direction',
      content: [
        '<strong>The Attraction of Uncertainty</strong><br><br>I chose psychological thrillers because they create a specific tension: I know the story may frighten me, but I do not know how or from which angle the fear will arrive. That uncertainty can also feel strangely beautiful, holding my attention as if I were being drawn under a spell.',
        '<strong>Beautiful, Mysterious, and Unsettling</strong><br><br>I built the main image as a photographic collage assembled from multiple online sources. Purple and blue became the dominant palette, creating a mysterious atmosphere that feels inviting at first and gradually more unsettling. The contrast reflects the genre itself—the desire to keep looking even when the viewer senses danger.',
      ],
    },
    {
      title: 'A Cross-Format Design System',
      content: [
        '<strong>Designing With the Fold From the Start</strong><br><br>I created the brochure’s cutting and folding outline on a separate layer, then moved repeatedly between the poster and brochure files. This let me check whether every piece of information felt harmonious at full scale without becoming awkward, divided, or difficult to read after folding.',
        '<strong>More Than a Resized Poster</strong><br><br>The process expanded my understanding of a design system. I was not creating a visual language for one fixed composition; I was testing whether the same hierarchy, imagery, color, and typography could support two distinct physical experiences. The finished poster and brochure demonstrate one identity adapting across scale and sequence while remaining recognizable as the same series.',
      ],
    },
  ],
};
