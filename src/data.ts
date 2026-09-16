import { Course, Bootcamp, Blog, VideoLesson } from "./types";

export const coursesData: Course[] = [
  {
    id: "nextjs-15-masterclass",
    title: "Next.js 15 Masterclass: Server Actions & App Router",
    description: "Master the latest Next.js 15 features including React Server Components (RSC), dynamic caching, Server Actions, middleware, routing structures, and full-stack optimizations.",
    duration: "18 Hours",
    lessonsCount: 24,
    difficulty: "Intermediate",
    rating: 4.9,
    enrolledStudents: 1240,
    tags: ["Next.js 15", "React 19", "App Router", "Server Actions", "TypeScript"],
    instructor: "Umair Riaz"
  },
  {
    id: "solidity-smart-contracts",
    title: "Solidity Core & Advanced Smart Contract Security",
    description: "Write production-grade smart contracts on EVM chains. Learn about gas optimization, reentrancy guards, upgradability patterns (UUPS), and hardhat/foundry workflows.",
    duration: "25 Hours",
    lessonsCount: 32,
    difficulty: "Advanced",
    rating: 4.8,
    enrolledStudents: 850,
    tags: ["Solidity", "EVM", "Ethereum", "Smart Contracts", "Security"],
    instructor: "Umair Riaz"
  },
  {
    id: "web3-frontend",
    title: "Web3 Frontend Engineering with Ethers.js & Wagmi",
    description: "Build robust Web3 user interfaces. Integrate browser wallets, handle real-time chain status, write customized hooks, and listen to blockchain contract events.",
    duration: "12 Hours",
    lessonsCount: 16,
    difficulty: "Beginner",
    rating: 4.7,
    enrolledStudents: 1560,
    tags: ["Wagmi", "Viem", "Ethers.js", "React Hooks", "Web3 Integration"],
    instructor: "Umair Riaz"
  },
  {
    id: "decentralized-daos",
    title: "Decentralized Systems, Tokenomics & DAO Governance",
    description: "Understand structural design for decentralized autonomous organizations. Build governors, multi-sig setups, voting strategies, and token economics simulators.",
    duration: "15 Hours",
    lessonsCount: 20,
    difficulty: "Advanced",
    rating: 4.9,
    enrolledStudents: 680,
    tags: ["DAO Governance", "Tokenomics", "Multi-Sig", "SecondaryDAO", "Smart Contracts"],
    instructor: "Umair Riaz"
  }
];

export const bootcampsData: Bootcamp[] = [
  {
    id: "web3-nextjs-accelerator",
    title: "12-Week Web3 & Next.js Career Accelerator",
    description: "An intensive, cohort-based immersive training program designed to take you from a standard web developer to a professional, industry-ready Web3 Full-Stack engineer.",
    duration: "12 Weeks",
    startDate: "October 1st, 2026",
    schedule: "Tue, Thu (6 PM - 8 PM UTC), Sat (10 AM - 1 PM UTC)",
    price: "$1,499",
    highlights: [
      "1-on-1 career coaching & mentoring from Umair Riaz",
      "Real-world capstone project working with SecondaryDAO sandbox",
      "Ethers.js / Wagmi masterclass with mock decentralized audit",
      "Exclusive recruitment access to global Web3 startups"
    ],
    techTags: ["Next.js 15", "Solidity", "TypeScript", "Wagmi", "Auditing"],
    maxSeats: 30
  },
  {
    id: "solidity-auditing-intensive",
    title: "6-Week Smart Contract Auditing & Security Bootcamp",
    description: "Deep dive into smart contract vulnerabilities, structural threats, and static analysis tools. Learn how to write secure code and perform audits.",
    duration: "6 Weeks",
    startDate: "November 15th, 2026",
    schedule: "Mon, Wed (7 PM - 9 PM UTC), Sat (2 PM - 5 PM UTC)",
    price: "$999",
    highlights: [
      "Foundry testing mastery & fuzzing strategies",
      "DeFi attack simulation & dynamic vulnerability exploitation",
      "Performing gas auditing & optimization reviews",
      "Co-authored certified security audits"
    ],
    techTags: ["Solidity", "Foundry", "Slither", "Mythril", "Defi Hacks"],
    maxSeats: 25
  }
];

export const blogsData: Blog[] = [
  {
    id: "nextjs-15-caching-deep-dive",
    title: "Next.js 15 Caching Revolution: What Every Developer Needs to Know",
    excerpt: "Explore the new cache-by-default adjustments in Next.js 15. Learn how Dynamic APIs, fetch requests, and route handlers operate without unexpected side effects.",
    content: "Next.js 15 has shifted caching philosophies significantly from previous versions. In the past, fetch requests and dynamic routes were cached aggressively by default, which often surprised developers during updates. In Next.js 15, fetch requests are now dynamic and uncached by default, giving developers explicit control over caching behavior using the `force-cache` configuration. Additionally, Server Components can utilize dynamic rendering precisely when headers or search params are read, making deployment behavior stable, secure, and predictable.",
    publishedAt: "June 20, 2026",
    readTime: "6 Min Read",
    author: {
      name: "Umair Riaz",
      role: "Founder & Lead Instructor"
    },
    tags: ["Next.js", "Web Performance", "React Server Components"]
  },
  {
    id: "securing-solidity-reentrancy-guards",
    title: "Defending Against Reentrancy: Modern Solidity Attack Mitigations",
    excerpt: "A comprehensive tutorial on identifying reentrancy vulnerabilities in Solidity smart contracts, implementing reentrancy guards, and the checks-effects-interactions pattern.",
    content: "Reentrancy is one of the oldest yet most recurring security exploits in smart contracts. It occurs when an external smart contract calls a victim contract before the victim has updated its state, allowing the attacker to re-enter the withdrawal loop repeatedly. To prevent this, developers should always follow the checks-effects-interactions pattern, which ensures all internal state changes are performed before external asset transfers. Furthermore, using OpenZeppelin's standard nonReentrant modifier serves as an exceptional structural safeguard against concurrent state execution threats.",
    publishedAt: "May 15, 2026",
    readTime: "8 Min Read",
    author: {
      name: "Umair Riaz",
      role: "Founder & Lead Instructor"
    },
    tags: ["Solidity", "Security", "Smart Contracts"]
  }
];

export const videoLessonsData: VideoLesson[] = [
  {
    id: "nextjs-chapter-1",
    title: "Lesson 1: Next.js 15 App Router Architecture & Server Components",
    duration: "10:15",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Premium placeholder video
    chapterIndex: 1,
    summary: "Welcome to Decentralized University! In this lesson, we establish the foundations of Next.js 15, focusing on client vs server boundaries, folder-based routing structure, and caching pipelines.",
    notes: [
      "React Server Components (RSC) execute exclusively on the server, significantly reducing browser JavaScript delivery bundles.",
      "Vite uses local file watching in development, whereas Next.js utilizes Webpack or Turbopack compilation.",
      "Always export server-executable code using 'use server' inside modern Next.js 15 route pipelines."
    ],
    quiz: {
      question: "Which components in Next.js 15 execute on the server by default?",
      options: [
        "Client Components",
        "React Server Components (RSC)",
        "Stateful Hooks Components",
        "Context Provider Components"
      ],
      correctAnswerIndex: 1
    }
  },
  {
    id: "solidity-chapter-2",
    title: "Lesson 2: Solidity State Management & Reentrancy Guards",
    duration: "12:45",
    videoUrl: "https://www.w3schools.com/html/movie.mp4", // Second premium placeholder video
    chapterIndex: 2,
    summary: "An active learning session focused on Solidity contract state variables, public/private access modifiers, and structural defense against concurrent reentrant transaction calls.",
    notes: [
      "State variables in Solidity are permanently stored in contract storage, which consumes significant gas.",
      "The 'checks-effects-interactions' pattern prevents reentrancy by writing internal state updates before external transfers occur.",
      "Gas optimization strategy: prefer using memory over storage variables inside active execution loops."
    ],
    quiz: {
      question: "What is the primary design pattern used to secure transfers against reentrancy in Solidity?",
      options: [
        "Public-Private Modifier Pattern",
        "Storage Mapping Allocation Pattern",
        "Checks-Effects-Interactions Pattern",
        "Constant State Gas Optimization"
      ],
      correctAnswerIndex: 2
    }
  }
];

export const instructorDetails = {
  name: "Umair Riaz",
  title: "Blockchain Council Member",
  bio: "Umair Riaz is an industry-renowned Blockchain Developer and educator. He has spent the last decade building high-throughput decentralized systems, tokenomics layouts, and Smart Contract Audtitor. He is the technical founder of Decentralized University and owner of Dot-Blockers (Auditor Company). Umair's goal is to empower the next generation of full-stack engineers to write elegant, robust, and responsive decentralized applications.",
  expertStacks: [
    "Solidity & EVM Smart Contracts",
    "Ethereum Frontend (web3.js, Ethers.js, Wagmi, Viem)",
    "Foundry & Hardhat Security Testing",
    "Smart Contract Auditing",
    "Tokenomics & DAO Architecture"
  ],
  experienceTimeline: [
    { year: "2025 - Present", role: "Core Tech Designer", company: "SecondaryDAO" },
    { year: "2023 - Present", role: "Founder & Lead Instructor", company: "Decentralized University" },
    { year: "2021 - 2023", role: "Principal Smart Contract Auditor", company: "Central City Security" },
    { year: "2018 - 2021", role: "Senior Full-Stack Web3 Developer", company: "EVM Solutions" }
  ]
};




