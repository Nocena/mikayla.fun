import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  chromecast,
  disc02,
  discord,
  discordBlack,
  facebook,
  file02,
  framer,
  homeSmile,
  instagram,
  notification2,
  notification3,
  notification4,
  notion,
  photoshop,
  plusSquare,
  protopie,
  raindrop,
  recording01,
  recording03,
  roadmap1,
  roadmap2,
  roadmap3,
  roadmap4,
  searchMd,
  slack,
  sliders04,
  telegram,
  twitter,
  of,
  onlyfans,
  pa,
  fa,
  hh,
  jf,
  fansly,
  patreon,
  herohero
} from "../assets";

export const navigation = [
  {
    id: "0",
    title: "Features",
    url: "#features",
  },
  {
    id: "1",
    title: "How to use",
    url: "#how-to-use",
  },
  {
    id: "2",
    title: "Tokenomics",
    url: "#tokenomics",
  },
  {
    id: "3",
    title: "Roadmap",
    url: "#roadmap",
  },
  {
    id: "4",
    title: "Dex",
    url: "#signup",
    onlyMobile: true,
  },
  {
    id: "5",
    title: "Launchpad",
    url: "https://cyreneai.com/",
    onlyMobile: true,
  },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [onlyfans, fansly, patreon, herohero];

export const brainwaveServices = [
  "Context-aware responses",
  "Safe & compliant",
  "Revenue-focused",
];

export const brainwaveServicesIcons = [
  recording03,
  recording01,
  disc02,
  chromecast,
  sliders04,
];

export const roadmap = [
  {
    id: "0",
    title: "Deep industry experience",
    text: "Our team combines years of hands-on experience: former OnlyFans chatters who understand fan psychology, developers who built OF alternatives, AI engineers from deep learning backgrounds, and crypto veterans who've launched successful tokens.",
    date: "2018-2024",
    status: "done",
    imageUrl: roadmap1,
    colorful: true,
  },
  {
    id: "1",
    title: "Token launch",
    text: "Launch Mikayla to established OnlyFans agencies, helping them scale their chatter teams with AI assistance. Beta platform with multi-account management, personality modes, and real-time AI suggestions.",
    date: "Q4 2025",
    status: "progress",
    imageUrl: roadmap2,
  },
  {
    id: "2",
    title: "Direct creator platform",
    text: "Expand beyond agencies to serve independent creators directly. Launch self-service platform where individual models can train Mikayla on their personality and manage fan conversations themselves.",
    date: "2026",
    status: "progress",
    imageUrl: roadmap3,
  },
  {
    id: "3",
    title: "Full AI model ecosystem",
    text: "Build entirely AI-powered OnlyFans models on crypto-native platforms. Explore autonomous AI creators that can generate content, manage fan relationships, and operate on decentralized OF alternatives - the ultimate vision.",
    date: "2027",
    status: "progress",
    imageUrl: roadmap4,
  },
];

export const collabText =
  "With smart automation and top-notch security, it's the perfect solution for agencies looking to work smarter";
  
export const collabText2 =
  "Handle dozens of model accounts from one dashboard";

export const collabContent = [
  {
    id: "0",
    title: "Multi-account management",
    text: collabText2,
  },
  {
    id: "1",
    title: "Smart AI assistant",
  },
  {
    id: "2",
    title: "Revenue optimization",
  },
];

export const collabApps = [
  {
    id: "0",
    title: "OnlyFans",
    icon: of,
    width: 26,
    height: 36,
  },
  {
    id: "1",
    title: "Discord",
    icon: discord,
    width: 36,
    height: 28,
  },
  {
    id: "2",
    title: "Patreon",
    icon: pa,
    width: 34,
    height: 34,
  },
  {
    id: "3",
    title: "HeroHero",
    icon: hh,
    width: 34,
    height: 34,
  },
  {
    id: "4",
    title: "JustForFans",
    icon: jf,
    width: 26,
    height: 34,
  },
  {
    id: "5",
    title: "Fansly",
    icon: fa,
    width: 38,
    height: 32,
  },
];

export const pricing = [
  {
    id: "0",
    title: "Basic",
    description: "AI chatbot, personalized recommendations",
    price: "0",
    features: [
      "An AI chatbot that can understand your queries",
      "Personalized recommendations based on your preferences",
      "Ability to explore the app and its features without any cost",
    ],
  },
  {
    id: "1",
    title: "Premium",
    description: "Advanced AI chatbot, priority support, analytics dashboard",
    price: "9.99",
    features: [
      "An advanced AI chatbot that can understand complex queries",
      "An analytics dashboard to track your conversations",
      "Priority support to solve issues quickly",
    ],
  },
  {
    id: "2",
    title: "Enterprise",
    description: "Custom AI chatbot, advanced analytics, dedicated account",
    price: null,
    features: [
      "An AI chatbot that can understand your queries",
      "Personalized recommendations based on your preferences",
      "Ability to explore the app and its features without any cost",
    ],
  },
];

export const benefits = [
  {
    id: "0",
    title: "AI-enhanced chatting",
    text: "Mikayla gives chatters real-time suggestions for better engagement and higher conversion rates, allowing them to keep convesations going longer",
    backgroundUrl: "./src/assets/benefits/card-1.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "1",
    title: "Improve everyday",
    text: "Mikayla is going to only get better each day with more data it gets to interact with picking up on trends faster then any human ever could",
    backgroundUrl: "./src/assets/benefits/card-2.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "2",
    title: "24/7 Revenue",
    text: "Mikayla handles routine responses during off-hours while best performing chatters can focus on high-value conversations that drive PPV sales",
    backgroundUrl: "./src/assets/benefits/card-3.svg",
    iconUrl: benefitIcon3,
    imageUrl: benefitImage2,
  },
  {
    id: "3",
    title: "Model personalities",
    text: "Mikayla comes with multiple basic personalities that we know drive converion on OnlyFans. However you can prompt your own ideas into live and compare real results",
    backgroundUrl: "./src/assets/benefits/card-4.svg",
    iconUrl: benefitIcon4,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "4",
    title: "Token buybacks",
    text: "10% of all the revenue generated by Mikayla will be directly used for token buybacks creating a constant buying preassure and strong analysis benchmark for price-discovery",
    backgroundUrl: "./src/assets/benefits/card-5.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "5",
    title: "Compliance & safety",
    text: "AUtomatic content filtering and protection mechanisms for everyone involved, from models to chatters to customers and agencies implementing Mikayla",
    backgroundUrl: "./src/assets/benefits/card-6.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
  },
];

export const socials = [
  {
    id: "0",
    title: "Discord",
    iconUrl: discordBlack,
    url: "#",
  },
  {
    id: "1",
    title: "Twitter",
    iconUrl: twitter,
    url: "#",
  },
  {
    id: "2",
    title: "Instagram",
    iconUrl: instagram,
    url: "#",
  },
  {
    id: "3",
    title: "Telegram",
    iconUrl: telegram,
    url: "#",
  },
  {
    id: "4",
    title: "Facebook",
    iconUrl: facebook,
    url: "#",
  },
];
