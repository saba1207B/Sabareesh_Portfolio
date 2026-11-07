export interface Project {
  title: string;
  category: "Web Apps" | "Android" | "UI/UX" | "AI & Computer Vision" | "Software";
  year: string;
  description: string;
  tags: string[];
  image: string;
  repoUrl: string;
  liveDemo?: string;
  color: "yellow" | "mint" | "lilac" | "coral" | "sky";
  art?: string;
}

export const allProjects: Project[] = [
  // 1. Antigravity-Luxury-Design
  {
    title: "Antigravity — Luxury Design System",
    category: "UI/UX",
    year: "2026",
    description: "Acoustic levitation design system and luxury digital flagship built with vanilla web standards, modular CSS tokens, and 60fps canvas physics.",
    tags: ["HTML5", "CSS3", "JavaScript", "Acoustic Physics"],
    image: "./manus-storage/project-antigravity.jpg",
    repoUrl: "https://github.com/saba1207B/Antigravity-Luxury-Design",
    color: "yellow",
    art: "antigravity",
  },
  // 2. smart-pos-portfolio-demo
  {
    title: "Smart POS & Billing System",
    category: "Web Apps",
    year: "2025",
    description: "React & Vite point-of-sale platform featuring dual bill-counter and customer displays, barcode scanning, itemized billing, receipt printing, and QR payments.",
    tags: ["React", "Vite", "JavaScript", "POS"],
    image: "./manus-storage/project-web_1cebb402.png",
    repoUrl: "https://github.com/saba1207B/smart-pos-portfolio-demo",
    liveDemo: "https://saba1207b.github.io/smart-pos-portfolio-demo/",
    color: "yellow",
    art: "pos",
  },
  // 3. StudyFlow_HighFidelity
  {
    title: "StudyFlow — High-Fidelity App",
    category: "Android",
    year: "2024",
    description: "High-fidelity student study and productivity mobile app built with Kotlin, Jetpack Compose, Material 3, and focus-session dashboards.",
    tags: ["Kotlin", "Jetpack Compose", "Material 3", "Android"],
    image: "./manus-storage/project-studyflow-hi.jpg",
    repoUrl: "https://github.com/saba1207B/StudyFlow_HighFidelity",
    color: "mint",
    art: "studyflow",
  },
  // 4. ecommerce_website
  {
    title: "Modern E-Commerce Storefront",
    category: "Web Apps",
    year: "2024",
    description: "Interactive online shopping storefront featuring responsive product catalog grids, interactive cart drawer, and category filtering.",
    tags: ["HTML5", "CSS3", "JavaScript", "E-Commerce"],
    image: "./manus-storage/project-ecommerce.jpg",
    repoUrl: "https://github.com/saba1207B/ecommerce_website",
    liveDemo: "https://saba1207b.github.io/ecommerce_website/",
    color: "coral",
    art: "ecommerce",
  },
  // 5. ad_watch_explorer_v1.0
  {
    title: "Aurelion The Sovereign — 3D Watch v1.0",
    category: "UI/UX",
    year: "2024",
    description: "Interactive 3D exploded-view luxury watch showcase with canvas scroll animation, precision caliber inspection, and gold horology craftsmanship.",
    tags: ["JavaScript", "Canvas 3D", "Horology", "UI/UX"],
    image: "./manus-storage/project-watch-v1.jpg",
    repoUrl: "https://github.com/saba1207B/ad_watch_explorer_v1.0",
    color: "yellow",
    art: "watch",
  },
  // 6. Hotel_Grand_Monarch_ManagementSystem
  {
    title: "Grand Monarch — Hotel & Dining System",
    category: "Software",
    year: "2024",
    description: "Luxury in-room dining, kitchen order ticketing (KDS), and POS billing platform crafted for seamless hotel and restaurant operations.",
    tags: ["JavaScript", "HTML5", "CSS3", "Hospitality"],
    image: "./manus-storage/project-hotel.jpg",
    repoUrl: "https://github.com/saba1207B/Hotel_Grand_Monarch_ManagementSystem",
    color: "sky",
    art: "hotel",
  },
  // 7. -d_headphone_ad
  {
    title: "Next-Gen 3D Headphone Showcase",
    category: "UI/UX",
    year: "2024",
    description: "Apple-inspired 3D scroll-driven animation showcase featuring smooth canvas frame sequence rendering, spatial audio cues, and glassmorphic UI.",
    tags: ["Canvas 3D", "CSS3", "Glassmorphism", "Motion"],
    image: "./manus-storage/project-headphones.jpg",
    repoUrl: "https://github.com/saba1207B/-d_headphone_ad",
    liveDemo: "https://saba1207b.github.io/-d_headphone_ad/",
    color: "lilac",
    art: "headphones",
  },
  // 8. ad_watch_explorer_v2.0
  {
    title: "Aurelion Rose Sovereign — 3D Watch v2.0",
    category: "UI/UX",
    year: "2024",
    description: "Second-generation exploded-view watch explorer featuring rose-gold horology mechanics, tourbillon caliber inspection, and WebP frame sequencing.",
    tags: ["Canvas Animation", "Rose Gold 3D", "Horology", "WebP"],
    image: "./manus-storage/project-watch-v2.jpg",
    repoUrl: "https://github.com/saba1207B/ad_watch_explorer_v2.0",
    color: "coral",
    art: "watch-v2",
  },
  // 9. VoxDefend
  {
    title: "VoxDefend — Voice Deepfake Detection",
    category: "AI & Computer Vision",
    year: "2026",
    description: "Smart India Hackathon 2026 real-time audio deepfake and AI voice cloning detection system powered by spectral forensics and neural classifiers.",
    tags: ["TypeScript", "Python", "Deepfake AI", "Audio Forensics"],
    image: "./manus-storage/project-voxdefend.jpg",
    repoUrl: "https://github.com/saba1207B/VoxDefend",
    color: "lilac",
    art: "voxdefend",
  },
  // 10. sih26063-polar-repo
  {
    title: "Polar Resilient Platform (SIH 2026)",
    category: "Software",
    year: "2026",
    description: "Full-stack cloud-native enterprise application built for Smart India Hackathon 2026 with Next.js, containerized microservices, and robust workflows.",
    tags: ["Next.js", "TypeScript", "Docker", "SIH 2026"],
    image: "./manus-storage/project-polar.jpg",
    repoUrl: "https://github.com/saba1207B/sih26063-polar-repo",
    color: "sky",
    art: "polar",
  },
  // 11. RPL-AI
  {
    title: "VOID TRACE — RPL AI Assistant",
    category: "AI & Computer Vision",
    year: "2026",
    description: "AI-assisted skill assessment tool for Recognition of Prior Learning (RPL), built for Smart India Hackathon under Ministry of Skill Development.",
    tags: ["AI Assistant", "EdTech", "Skill Assessment", "SIH 2026"],
    image: "./manus-storage/project-rpl-ai.jpg",
    repoUrl: "https://github.com/saba1207B/RPL-AI",
    liveDemo: "https://rpl-ai.vercel.app",
    color: "yellow",
    art: "rpl",
  },
  // 12. NEROSENTINEL
  {
    title: "NeroSentinel — Water Intelligence Platform",
    category: "Software",
    year: "2026",
    description: "Offline-first FastAPI decision-support backend and Next.js portal with physical hydrology units, ET0 calculation, and drought-resilience intervention search.",
    tags: ["FastAPI", "Next.js", "Python", "Decision Support"],
    image: "./manus-storage/project-nerov2.jpg",
    repoUrl: "https://github.com/saba1207B/NEROSENTINEL",
    color: "mint",
    art: "water",
  },
  // 13. the_daily_brew
  {
    title: "The Daily Brew — Café Experience",
    category: "Web Apps",
    year: "2024",
    description: "Motion-driven artisanal coffee destination website featuring fluid typography, GPU canvas interactions, and mobile-optimized ordering flows.",
    tags: ["TypeScript", "Responsive UI", "Motion Design", "Canvas"],
    image: "./manus-storage/project-dailybrew.jpg",
    repoUrl: "https://github.com/saba1207B/the_daily_brew",
    color: "yellow",
    art: "coffee",
  },
  // 14. C_Language_Assigments
  {
    title: "C Systems & Algorithms Repository",
    category: "Software",
    year: "2024",
    description: "Suite of low-level algorithms, data structures, terminal calculators, and console utilities written during foundational computer science coursework.",
    tags: ["C", "Algorithms", "Data Structures", "CLI"],
    image: "./manus-storage/project-c-assignments.jpg",
    repoUrl: "https://github.com/saba1207B/C_Language_Assigments",
    color: "sky",
    art: "c-code",
  },
  // 15. SocialGrove
  {
    title: "Social Grove — Community Platform",
    category: "Web Apps",
    year: "2025",
    description: "Modern social network web app for sharing creative work, community conversations, threaded discussions, and dynamic user feeds.",
    tags: ["React 19", "TypeScript", "Social Network", "Tailwind"],
    image: "./manus-storage/project-socialgrove.jpg",
    repoUrl: "https://github.com/saba1207B/SocialGrove",
    liveDemo: "https://saba1207b.github.io/SocialGrove/",
    color: "mint",
    art: "social",
  },
  // 16. Orbitmarket_ecommerce
  {
    title: "Orbit Market — Full-Stack E-Commerce",
    category: "Web Apps",
    year: "2025",
    description: "Full-stack marketplace storefront with real-time product catalogs, cart state persistence, checkout pipelines, and mobile-first design.",
    tags: ["TypeScript", "Python", "E-Commerce", "Full Stack"],
    image: "./manus-storage/project-orbitmarket.jpg",
    repoUrl: "https://github.com/saba1207B/Orbitmarket_ecommerce",
    liveDemo: "https://saba1207b.github.io/Orbitmarket_ecommerce/",
    color: "coral",
    art: "orbitmarket",
  },
  // 17. ConnectSphere
  {
    title: "ConnectSphere — Collaboration Platform",
    category: "Web Apps",
    year: "2025",
    description: "Real-time communication and digital collaboration platform with video conferencing rooms, interactive slide sharing, and instant messaging.",
    tags: ["TypeScript", "Real-Time Web", "Video Conferencing", "UI"],
    image: "./manus-storage/project-connectsphere.jpg",
    repoUrl: "https://github.com/saba1207B/ConnectSphere",
    liveDemo: "https://saba1207b.github.io/ConnectSphere/",
    color: "sky",
    art: "connectsphere",
  },
  // 18. FitTrack-Fitness-Tracking-App
  {
    title: "FitTrack Fitness Tracking App",
    category: "Android",
    year: "2024",
    description: "Modern native Android fitness tracking app for recording workouts, monitoring daily steps, tracking calories burned, and viewing progress stats offline.",
    tags: ["Kotlin", "Android", "Jetpack Compose", "SQLite"],
    image: "./manus-storage/project-mobile_71b8612a.png",
    repoUrl: "https://github.com/saba1207B/FitTrack-Fitness-Tracking-App",
    color: "mint",
    art: "mobile",
  },
  // 19. RandomQuoteGenerator
  {
    title: "InspireQuote — Random Quote Generator",
    category: "Android",
    year: "2024",
    description: "Native Android application built with Kotlin and Jetpack Compose featuring smooth card transitions, quote bookmarking, and instant sharing.",
    tags: ["Kotlin", "Jetpack Compose", "Material 3", "Quotes"],
    image: "./manus-storage/project-quotes.jpg",
    repoUrl: "https://github.com/saba1207B/RandomQuoteGenerator",
    color: "yellow",
    art: "quotes",
  },
  // 20. FlashCardQuizApp
  {
    title: "QuizMaster — Flashcard Quiz App",
    category: "Android",
    year: "2024",
    description: "Interactive Android flashcard study tool with card-flip animations, custom deck authoring, score analytics, and Room SQLite database persistence.",
    tags: ["Kotlin", "Room Database", "Flashcards", "Android"],
    image: "./manus-storage/project-flashcard.jpg",
    repoUrl: "https://github.com/saba1207B/FlashCardQuizApp",
    color: "coral",
    art: "quiz",
  },
  // 21. StudyFlow_LowFidelity
  {
    title: "StudyFlow — Low-Fidelity Wireframes",
    category: "UI/UX",
    year: "2024",
    description: "Low-fidelity architectural prototype and user flow wireframe implementation exploring spatial study hierarchies, timers, and task decks.",
    tags: ["UI/UX Design", "Wireframing", "Kotlin", "Jetpack Compose"],
    image: "./manus-storage/project-studyflow-lo.jpg",
    repoUrl: "https://github.com/saba1207B/StudyFlow_LowFidelity",
    color: "sky",
    art: "wireframe",
  },
  // 22. LanguageTranslationTool
  {
    title: "Neural Language Translation Tool",
    category: "AI & Computer Vision",
    year: "2024",
    description: "Multi-language translation engine with support for 15+ global and Indian languages, REST API integration, and on-demand language pack downloads.",
    tags: ["Python", "Flask", "NLP", "Translation API"],
    image: "./manus-storage/project-translator.jpg",
    repoUrl: "https://github.com/saba1207B/LanguageTranslationTool",
    color: "lilac",
    art: "translator",
  },
  // 23. ObjectDetectionTracking
  {
    title: "Real-Time Object Detection & Tracking",
    category: "AI & Computer Vision",
    year: "2024",
    description: "Wireless Android CameraX to Python computer vision system using YOLO and ByteTrack for multi-object detection, bounding boxes, and ID tracking.",
    tags: ["Python", "YOLO", "OpenCV", "ByteTrack"],
    image: "./manus-storage/project-3d_a3051503.png",
    repoUrl: "https://github.com/saba1207B/ObjectDetectionTracking",
    color: "lilac",
    art: "vision",
  },
  // 24. FAQChatbot
  {
    title: "NLP Conversational FAQ Assistant",
    category: "AI & Computer Vision",
    year: "2024",
    description: "Intelligent conversational chatbot using Natural Language Processing, TF-IDF vectorization, and cosine similarity matching for automated FAQ responses.",
    tags: ["Python", "NLP", "TF-IDF", "Flask"],
    image: "./manus-storage/project-ai_151909a3.png",
    repoUrl: "https://github.com/saba1207B/FAQChatbot",
    color: "coral",
    art: "chatbot",
  },
  // 25. WIFI-panel
  {
    title: "WiFi Panel Launcher Utility",
    category: "Android",
    year: "2024",
    description: "Ultra-lightweight Android system tool providing instant one-tap access to deep native Wi-Fi settings panels and connectivity diagnostics.",
    tags: ["Kotlin", "Android Utilities", "System Settings", "Network"],
    image: "./manus-storage/project-wifi.jpg",
    repoUrl: "https://github.com/saba1207B/WIFI-panel",
    color: "mint",
    art: "wifi",
  },
];

