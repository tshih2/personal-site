// 首頁 [ BLOG ] 分頁 + blog-post.html 共用的唯一資料來源。每篇文章是
// 一個物件,格式比照 case-study 資料檔的「資料/樣板分離」精神——這裡
// 不放任何版面/樣式資訊,只放內容,渲染邏輯全部在 js/blog-post-template.js。
//
// 格式:
// {
//   slug: string,        // 網址識別碼,對應 blog-post.html?slug=<slug>,
//                         // 同時也是首頁卡片連結目標的一部分
//   title: string,
//   date: string,        // 顯示用日期字串,不強制格式
//   coverImage: string,  // 封面圖路徑——只用在首頁卡片縮圖,不會出現在
//                         // 文章內頁本身(文章內頁是純文字版面,見下方)
//   author: string,
//   content: [           // 內文區塊,依序渲染,種類可自由混用:
//     { type: 'paragraph', text }  — 一般段落
//     { type: 'heading', text }    — 小標題
//     { type: 'quote', text }      — 引言(blockquote)
//   ],
// }
//
// 文章內頁刻意不支援 image/video 類型(見 js/blog-post-template.js 檔案
// 開頭註解)——之後新增文章不要往 content 裡塞圖片或影片連結,樣板不會
// 渲染它們。
//
// 首頁 BLOG 分頁卡片上的兩位數流水號(01./02./...)不存在這份資料裡,
// 是 js/works-grid.js 依這個陣列目前的排列順序即時算出來的——新增/
// 調整文章順序時編號自動跟著對,不需要手動維護。
const BLOG_POSTS = [
  {
    slug: 'minecraft-plagiarism',
    title: 'Reflections on Minecraft Shorts Plagiarism and the Content Ecosystem',
    date: 'Mar 30, 2026',
    coverImage: 'Img/Blog_Cover/Cover_01.jpg',
    author: 'Tim Shih',
    // 逐字稿來源:Blog_content/01.Reflections on Minecraft Shorts
    // Plagiarism and the Content Ecosystem/minecraft-shorts-reflection-en.md
    // ——原文開頭有一段引用的 YouTube 影片連結,依 Tim 的指示不使用
    // (文章內頁是純文字版面,不放影片連結)。
    content: [
      { type: 'paragraph', text: "This morning I woke up and watched a YouTube video about the flood of Minecraft ripoff videos. At first I thought it was going to be about whether Mojang, the studio behind Minecraft, had copied someone else's work. Instead, the video was actually about the Minecraft community, especially the Shorts side of it. It pointed out that a lot of Chinese-language creators just lift and re-shoot skit content from overseas creators wholesale, and apparently this happens constantly." },
      { type: 'heading', text: 'The cheap-copy, high-payoff cycle' },
      { type: 'paragraph', text: "The video's argument: this kind of copying costs almost nothing and pays off well. Whoever's ripping something off can just plug in a format someone else already proved works, skipping all the time, risk, and uncertainty that comes with actually figuring something out." },
      { type: 'paragraph', text: 'The line that stuck with me most:' },
      { type: 'quote', text: "When we're scrolling through shorts, we get this feeling of 'I think I've seen this somewhere before, but I can't place it,' so we stop and watch it again." },
      { type: 'paragraph', text: "That happens to me constantly. I never actually bother to figure out which platform or channel I saw the same thing on before. Which, now that I think about it, is a pretty unsettling thing about how we consume content these days." },
      { type: 'heading', text: 'Shorts versus long-form: a different kind of habit' },
      { type: 'paragraph', text: "In the past, when we watched someone like 志祺七七 or Joeman explain their take on something, we'd usually watch it once and move on. Unless a video had real research value, knowing their opinion was enough. We didn't go back for seconds." },
      { type: 'paragraph', text: "But shorts run on a remix culture, and even 30-second clips add up. You watch a 30-second version today, then run into a near-identical version tomorrow, and that's another 30 seconds. Now you're at a full minute, and none of it added anything. Multiply that by however many times a week it happens, and it's a lot of time spent on nothing." },
      { type: 'heading', text: "Challenge remakes aren't the same as straight-up copying" },
      { type: 'paragraph', text: 'The video also brings up the "challenge remake" format that\'s huge on platforms like TikTok. From what I\'ve seen, that mostly shows up around K-pop groups promoting a new album. But there\'s a real difference between that and what\'s happening with Minecraft content.' },
      { type: 'paragraph', text: "A K-pop challenge is something the label creates and hands out on purpose, encouraging people to join in as a form of promotion. The rights holder wants this to spread. Minecraft ripoffs are just theft. Changing the language, or having someone else perform it, doesn't make it any less copied." },
      { type: 'heading', text: 'What worries me about where original content is headed' },
      { type: 'paragraph', text: "But when it comes down to it, does the audience even care? Someone who just got home from work and wants to zone out isn't going to stop and think about where a video's ideas came from, or who made it first." },
      { type: 'paragraph', text: "If this is how the ecosystem works now, does it just get flooded with more and more low-effort knockoffs over time? And once original creators notice they can make money without doing the actual work, how many of them decide to stop bothering and just start copying too? At some point, does the amount of genuinely good content we get to see start shrinking?" },
    ],
  },
  {
    slug: 'ai-virtual-personas-community-ethics',
    title: 'Reflections on AI Virtual Personas and Community Ethics: When "Real" Is No Longer the Only Label',
    date: 'Apr 01, 2026',
    coverImage: 'Img/Blog_Cover/Cover_02.jpg',
    author: 'Tim Shih',
    // 逐字稿來源:Blog_content/02.AI Virtual Personas and Community Ethics -
    // When Real Is No Longer the Only Label/ai-virtual-personas-community-ethics-en.md
    // ——原文開頭同樣有一段引用連結,依同一條規則不使用。原文裡有一句
    // 提到「幾天前寫的東西」並用 [[...]] 連到 Minecraft 那篇文章,這裡
    // 對應轉成真正的站內連結(唯一明確對應得上的交互參照)。
    content: [
      { type: 'heading', text: "1. The rise of virtual personas, and the problem of not being able to tell what's real anymore" },
      { type: 'paragraph', text: "A few weeks ago I was talking with Dagen and he mentioned that Instagram is now full of hyper-realistic AI-generated accounts. These aren't just random bot posts, they have full backstories. One we looked at was a Korean girl's account billing herself as a weather anchor. Her posts looked exactly like any other influencer's: gym selfies, cafe check-ins, little slices of daily life." },
      { type: 'paragraph', text: "We actually talked about whether we should figure out how to build our own AI persona and run a whole account around it. But that conversation also left me a little uneasy. Nobody's getting directly hurt by an account like that, but it does make the line between real and fake noticeably blurrier for everyone." },
      { type: 'heading', text: "2. Digital identity theft: the BBC's skin-tone deepfake case" },
      { type: 'paragraph', text: "I just saw a BBC story about a case where someone stole a female influencer's video and used AI to change her skin tone, turning her into a Black woman." },
      { type: 'paragraph', text: "Everything else in the video stayed the same: the mouth movements, the expressions, the background. The fake account used the change to bait engagement around race and other touchy topics, and it picked up 3 million followers in a short window." },
      { type: 'heading', text: '3. The money behind the fakery' },
      { type: 'paragraph', text: "Once these accounts build up a following, they push traffic to third-party platforms like OnlyFans or other subscription sites and pull in serious money. According to the people quoted in the report, accounts that steal someone's likeness and run it through AI can be extremely profitable. At that point it's not really a technical curiosity anymore, it's straightforward infringement and fraud." },
      { type: 'heading', text: '4. Where platform moderation breaks down: the gaps in labeling' },
      { type: 'paragraph', text: 'Instagram and similar platforms do have policies requiring "AI-generated" labels, but two problems undercut them.' },
      { type: 'paragraph', text: "First, labeling is mostly left to users to do voluntarily. Anyone deliberately profiting off fake content obviously isn't going to tag themselves as AI." },
      { type: 'paragraph', text: "Second, the platforms don't have detection systems strong enough to identify AI content on their own. When followers get suspicious and ask questions, the account just replies with a normal-sounding message and an emoji or two, and that's usually enough to keep the illusion going." },
      { type: 'paragraph', text: "That leaves me stuck on a bigger question: should AI-generated content even be allowed on social platforms in the first place? This kind of deception does real damage to a community's ability to tell what's genuine." },
      { type: 'heading', text: '5. Mixed signals from the big players: Disney and OpenAI' },
      { type: 'paragraph', text: "A few days ago there was news about Disney's relationship with OpenAI shifting, and it mentioned that Disney+ had been interested in using AI to generate video content to draw in subscribers." },
      { type: 'paragraph', text: "When a company that size treats AI content as a business lever, it kind of legitimizes what regular people are already doing with AI remixes, even the parts that edge into copyright violations or genuinely controversial territory. So where's the line between creativity and theft once the biggest players are playing the same game? And how are we supposed to protect the digital space we're all living in?" },
      { type: 'heading', text: '6. Fragmented memory and the gap where verification should be' },
      { type: 'paragraph', text: 'This whole thing reminds me of something I wrote about a few days ago, <a href="blog-post.html?slug=minecraft-plagiarism" class="underline hover:text-ink transition-colors">Reflections on Minecraft Shorts Plagiarism and the Content Ecosystem</a>. Between how fragmented our memory and our time have both become, scrolling through Reels or Shorts gives us this constant low-grade déjà vu: I think I\'ve seen this before, but I can\'t say where.' },
      { type: 'paragraph', text: "But nobody's actually going to do the work of verifying where a clip came from, not the way you'd track down a source in a library. There's just too much short-form video out there. Digging back through it and comparing versions costs way more time than the clip is worth to begin with." },
      { type: 'heading', text: '7. Entertainment wins: why bother checking' },
      { type: 'paragraph', text: "My honest reaction in the moment is usually something like \"I've got better things to do, I don't have time to fact-check a video.\" Instead of digging through my watch history to satisfy some curiosity, I'd rather spend that time scrolling a few more shorts and actually enjoying myself. Multiply that instinct across everyone doing the same thing, and we've collectively given up on caring whether what we're seeing is real." },
      { type: 'heading', text: '8. How well AI face-swapping hides: an influencer dance video' },
      { type: 'paragraph', text: "Say I watch an influencer's dance video today. Five days later I come across a version where the skin tone's been altered by AI. I might get a flicker of recognition, that background looks familiar, those moves look about the same, but I am not going to dig back through five days of watch history to confirm whether the original got stolen or face-swapped." },
      { type: 'paragraph', text: "That gap, familiar but unverifiable, is exactly what lets plagiarists and AI forgers operate freely inside all this noise. They're counting on the fact that most people are too forgetful, or too tired, to check." },
    ],
  },
  {
    slug: 'world-middle-ground',
    title: "The World's Middle Ground",
    date: 'Apr 08, 2026',
    coverImage: 'Img/Blog_Cover/Cover_03.jpg',
    author: 'Tim Shih',
    // 逐字稿來源:Blog_content/03.The World's Middle Ground/world-middle-ground-en.md
    // ——原文結尾有一段「Related: [[...]]」交互參照清單,大部分連到的
    // 標題不是這個網站上已發布的文章(是 Tim 個人筆記系統裡的其他筆記),
    // 硬連過去會變成死連結,先不渲染這段,等 Tim 確認怎麼處理「相關文章」
    // 這個功能之後再補。
    content: [
      { type: 'paragraph', text: "This morning I read an article about cars and it made me notice something: most vehicles on the market these days seem to be hybrids." },
      { type: 'paragraph', text: "Not long ago, the market was still arguing over whether electric cars would completely replace gas ones. Back then it really felt like EVs were about to take over the world. But here we are, and it turns out the middle ground is where things actually landed. That got me wondering whether the same logic applies to AI, which is moving at a speed nothing else in tech ever has." },
      { type: 'heading', text: '1. Take away the scarcity, and the fun goes with it' },
      { type: 'paragraph', text: "Every day there's some new take about AI replacing human jobs, and even Elon Musk is pushing AI chips to handle internal work. A lot of people are picturing a kind of utopia: buy one AI, let it make money for you, and just lie around at home playing games and eating and sleeping on repeat." },
      { type: 'paragraph', text: 'Honestly, I can\'t picture actually wanting that life. <strong>Play gets old fast.</strong> That\'s basically what "scarcity makes things valuable" means. Work might not be fun, but it\'s exactly because work exists that your days off and your rest actually mean something. Take scarcity away entirely, and life loses its value along with it. The middle ground, for a human life, sits somewhere between working yourself into the ground and having zero direction while you play.' },
      { type: 'heading', text: "2. What AI still can't touch: feeling and empathy" },
      { type: 'paragraph', text: "AI is impressive, but its weak spots are obvious too. It loses track of context all the time, and sometimes that leads it to do something harmful just because it misread what you meant. The bigger issue is that <strong>AI doesn't feel anything.</strong>" },
      { type: 'paragraph', text: "That's part of why I believe my own field, UX, still matters. We can design good products because we have empathy, because we can put ourselves in someone else's shoes. That kind of emotional read between two people isn't something current technology can replace." },
      { type: 'heading', text: '3. Things that were declared dead and never actually died' },
      { type: 'paragraph', text: "Looking back, plenty of new technologies have come with predictions that some industry was finished. Almost every time, things settled into a middle ground instead." },
      { type: 'paragraph', text: "Retail is one example: e-commerce versus physical stores. When Amazon and Taobao took off, everyone said brick-and-mortar was finished. But it turns out shopping in person was never really about convenience. It's about <strong>the warmth of interacting with another human being.</strong> We're social animals, and we depend on that kind of connection for a lot of our happiness." },
      { type: 'paragraph', text: "Reading is another: e-books versus print. Kindle was everywhere when it launched, but print books are still standing. There's something about the physical feeling of turning a page that gives you a real sense of having absorbed something, in a way that scrolling on a phone or tablet never quite delivers." },
      { type: 'paragraph', text: "Finance too: crypto versus traditional banking. Even as crypto tries to replace the old system, companies like Visa and Mastercard keep partnering with crypto firms instead of fighting them. Not everyone is willing to trust code alone with their money. People who don't feel secure with that still want an actual institution holding it for them." },
      { type: 'heading', text: 'Conclusion: giving up on absolutes is what lets you see the whole picture' },
      { type: 'paragraph', text: "Nothing in this world seems to be truly absolute. It's a lot like a relationship: two people argue, and eventually they sit down and land on some middle ground, some compromise they can both live with." },
      { type: 'paragraph', text: "Instead of worrying about who's going to replace who, it's probably more useful to think about where the balance actually sits. <strong>Not chasing extremes, but trying to see the whole picture,</strong> that's where I think the real opportunity is." },
    ],
  },
  {
    slug: 'graduation-forbidden-archive',
    title: 'Graduation Season Notes: 400 Years in the Forbidden Archive, and My Four',
    date: 'Apr 20, 2026',
    coverImage: 'Img/Blog_Cover/Cover_04.jpg',
    author: 'Tim Shih',
    // 逐字稿來源:Blog_content/04.Graduation Season Notes 400 Years in the
    // Forbidden Archive and My Four/graduation-forbidden-archive-en.md
    // ——原文裡「Regretting the past/resources/courage」是條列式內容,
    // 沒有新增 list 類型,沿用既有慣例拆成三段各自帶 <strong>標籤:</strong>
    // 前綴的 paragraph(跟 Minecraft 那篇 K-pop 段落一開始的處理方式
    // 是同一套,後來簡化成單一段落,這裡因為是三個獨立分項,保留三段
    // 分開)。結尾同樣有 Related 交互參照清單,原因同上暫不渲染。
    content: [
      { type: 'heading', text: 'That anxious quiet after being busy' },
      { type: 'paragraph', text: 'Most of my life lately has revolved around building props and putting together a portfolio for my graduation show. Last week at school was a manic "figure it out" stretch, and this week I finally got to breathe a little. But once the immediate work slows down, the free time that opens up turns out to be fertile ground for spiraling thoughts.' },
      { type: 'paragraph', text: "I'm lucky to have friends around who fill my days with laughter, which keeps me from sinking too far into it. But in the quiet moments, the anxiety still creeps back in." },
      { type: 'heading', text: 'Beatrice\'s 400 years: are we all just waiting for a "right answer"?' },
      { type: 'paragraph', text: 'I recently binged an anime, and one of the spirit characters in it hit me hard. To keep a promise she made to her "mother," she waited alone in a library for 400 years. Day after day she just read, turned down countless invitations, all so she could wait for the "right person" her mother had spoken of. It wasn\'t until the male lead showed up and kept stubbornly disrupting her routine that the long standoff finally broke.' },
      { type: 'paragraph', text: "This story sent me completely spiraling, to the point where I started reading the novels too, because it landed right on a nerve I've had about time this whole past year." },
      { type: 'heading', text: 'The Rashomon of regret' },
      { type: 'paragraph', text: 'Watching friends around me start sending out resumes and applying for internships, I fell into a loop of regret:' },
      { type: 'paragraph', text: "<strong>Regretting the past:</strong> why didn't I push myself harder these past four years abroad, to actually experience things, to connect more with people?" },
      { type: 'paragraph', text: "<strong>Regretting resources:</strong> why didn't I make something more meaningful with my classmates, using what was right there in front of us?" },
      { type: 'paragraph', text: '<strong>Regretting courage:</strong> why did I always hide in my comfort zone longer than everyone else? Why didn\'t I become a "real adult" sooner?' },
      { type: 'paragraph', text: "I keep feeling like the way I see the world runs a beat behind everyone else's. If I'd understood how the world actually works earlier, would I have fewer regrets today?" },
      { type: 'heading', text: 'Leaving the Forbidden Archive: learning to sit with uncertainty' },
      { type: 'paragraph', text: "But deep down I know this kind of overthinking is its own Rashomon. Going back and forth over the past doesn't actually change anything. That spirit's story gave me something to hold onto:" },
      { type: 'quote', text: 'Beatrice was trapped because she was chasing an answer someone else had defined as correct.' },
      { type: 'paragraph', text: 'Maybe I\'ve been the same way, always hoping someone would just tell me what the "perfect" move was. But the truth is, most things in life don\'t come with a model answer, and you have to learn to make the choice yourself. Rather than waiting around for the perfect moment, actually facing the uncertainty and taking that first risky step is what gets a life moving.' },
      { type: 'paragraph', text: "This is a record, and it's also a kind of goodbye, goodbye to the version of me that always chased perfect and was scared of getting things wrong. From here, I'm just going to keep going on the things I actually want to do." },
    ],
  },
  {
    slug: 'ai-agent-microtransactions-subscriptions',
    title: 'Trend Watch: AI Agents, Microtransactions, and the End of Subscriptions',
    date: 'May 11, 2026',
    coverImage: 'Img/Blog_Cover/Cover_05.jpg',
    author: 'Tim Shih',
    // 逐字稿來源:Blog_content/05.Trend Watch AI Agents Microtransactions
    // and the End of Subscriptions/ai-agent-microtransactions-subscriptions-en.md
    // ——結尾 Related 清單裡「The World's Middle Ground」剛好對應得上
    // 上面那篇文章,但整段清單其餘項目對不上,先整段不渲染,理由同上。
    content: [
      { type: 'heading', text: 'Subscription fatigue versus the loyalty of one-time purchases' },
      { type: 'paragraph', text: "The subscription model getting pushed across every industry right now is genuinely exhausting. I keep seeing influencers on social media hyping up some micro AI tool that's supposedly going to help your workflow, and then you click through and it just asks you to subscribe, no free trial, nothing. Meanwhile, software like Procreate and Obsidian, which stick to a one-time purchase, end up with a more loyal user base and a stronger creator community around them. Makes me wonder whether subscriptions are actually the best business model for digital tools, or just the default everyone reaches for because it's easier to build a spreadsheet around." },
      { type: 'heading', text: 'A decentralized tool ecosystem: big companies breaking apart, studios rising' },
      { type: 'paragraph', text: 'Under the wave of globalized remote work, employees at a lot of companies are now scattered across the world, and that\'s feeding a "specialized studio" trend. Riot Games, for one, disbanded its internal animation department and outsourced that work entirely to a specialized European animation studio, which turned out to be a more efficient split of labor. I see the same pattern with a friend\'s company: everyone works fully remote, and none of his coworkers live in the same city. AI is speeding this up too. People can vibe-code a whole app now, or land on a decent idea and just start a company around it.' },
      { type: 'paragraph', text: "I think this points to where the market is headed: <strong>the world doesn't need one all-powerful mega-corporation anymore, it needs a web of countless top-tier teams, each specializing in exactly one thing, wired together.</strong>" },
      { type: 'heading', text: 'The fragmentation problem with AI tools: no one can subscribe to everything' },
      { type: 'paragraph', text: 'This same specialization shows up in the tools we actually use. Look at AI image generation and productivity software: Stable Diffusion, Leonardo, Midjourney, Nano Banana, Grok, ChatGPT, the list keeps going.' },
      { type: 'paragraph', text: "Each one is genuinely good at something different, but there's no way, as a user, you're going to subscribe to all of them just to try one out or cover some one-off need. That's a real financial burden." },
      { type: 'heading', text: 'A possible fix: AI agents plus microtransactions' },
      { type: 'paragraph', text: 'If future software dropped subscriptions entirely in favor of pay-per-use, settled in tiny amounts of stablecoin each time, that would be a great direction for both users and AI agents, and probably a solid opportunity for stablecoin issuers like Circle specifically.' },
      { type: 'paragraph', text: 'Once AI agents take over most of the repetitive, cross-system busywork and start "working" on our behalf, they\'re going to pick whichever tool actually fits the task in front of them.' },
      { type: 'paragraph', text: '<strong>The problem with traditional credit cards:</strong> hand an AI agent your credit card to go subscribe to everything on the market, and its owner goes broke fast.' },
      { type: 'paragraph', text: '<strong>Why microtransactions work better:</strong> every time an agent calls a specific tool, say having Midjourney generate one image or having GPT run a piece of code, it just deducts a few cents, or fractions of a cent, in stablecoin from a wallet. That barely registers financially.' },
      { type: 'paragraph', text: 'This kind of pay-as-you-go, auto-settled, decentralized model is really the only way a whole ecosystem of specialized AI tools and AI agents can actually coexist and run together.' },
    ],
  },
];
