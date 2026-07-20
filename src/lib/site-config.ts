export const siteConfig = {
  name: "Yashwanth Sai T",
  role: "SOFTWARE ENGINEER · GENAI & AGENTIC SYSTEMS",
  headline: "I build clean code and memorable experiences.",
  headlineEmphasis: "experiences",
  heroDescription:
    "Software Engineer with 5+ years building LLM-powered applications, RAG pipelines, and multi-agent systems — productionized on AWS, GCP, and Azure.",
  githubUsername: "yashwanth123",
  resumePath: "/resume.pdf",
  email: "yashwanthsi2011@gmail.com",
  phone: "(213) 451-1130",
  social: {
    github: "https://github.com/yashwanth123",
    linkedin: "https://www.linkedin.com/in/yashwanthsai-t",
  },
  about: {
    title: "Engineering intelligent systems that ship to production.",
    paragraphs: [
      "I'm a Software Engineer with 5+ years of experience building and deploying LLM-powered applications, RAG pipelines, and agentic workflows at scale. I've shipped GenAI systems across healthcare, finance, and automotive — from 4M+ document retrieval pipelines at Blue Cross Blue Shield to fraud-detection agents processing 3M+ daily transactions at Capital One.",
      "My core stack spans LangChain, LangGraph, vector databases (Pinecone, pgvector), and LLM APIs from OpenAI, Anthropic, and Gemini. I care deeply about evaluation frameworks, cost optimization, guardrails, and MLOps — not just prototypes that demo well, but systems that hold up in production.",
      "MS in Computer Science from California State University Channel Islands. Open-source contributor to Judgeval (Stanford/Judgment Labs). Builder of Job Agent AI — a full-stack platform for AI-powered job search.",
    ],
    skills: [
      "LangChain & LangGraph",
      "RAG & Vector DBs",
      "Multi-Agent Systems",
      "OpenAI & Anthropic APIs",
      "Python & FastAPI",
      "MLOps & Vertex AI",
      "AWS · GCP · Azure",
      "PostgreSQL & pgvector",
      "React & TypeScript",
      "Prompt Engineering",
      "Fine-tuning (LoRA)",
      "Kubernetes & Docker",
    ],
  },
  blogPosts: [
    {
      title: "Building Effective Agents",
      source: "Anthropic Engineering",
      date: "2024-12-19",
      excerpt:
        "Anthropic's engineering guide to designing agentic systems — workflow patterns, tool use, and when to choose simple pipelines over full autonomy.",
      href: "https://www.anthropic.com/engineering/building-effective-agents",
    },
    {
      title: "Learning to Reason with LLMs",
      source: "OpenAI Research",
      date: "2024-09-12",
      excerpt:
        "How OpenAI approaches training models for complex reasoning — chain-of-thought, reinforcement learning, and scaling inference-time compute.",
      href: "https://openai.com/index/learning-to-reason-with-llms/",
    },
    {
      title: "The 2025 AI Index Report",
      source: "Stanford HAI",
      date: "2025-04-07",
      excerpt:
        "Stanford's annual benchmark of AI progress — model performance, investment trends, responsible AI developments, and global policy landscape.",
      href: "https://hai.stanford.edu/ai-index/2025-ai-index-report",
    },
    {
      title: "Claude's Character",
      source: "Anthropic Research",
      date: "2024-03-08",
      excerpt:
        "How Anthropic thinks about aligning Claude's values — constitutional AI, helpfulness vs. harmlessness, and designing models people actually want to use.",
      href: "https://www.anthropic.com/research/claude-character",
    },
  ],
} as const;
