export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessonsCount: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  enrolledStudents: number;
  tags: string[];
  instructor: string;
}

export interface Bootcamp {
  id: string;
  title: string;
  description: string;
  duration: string;
  startDate: string;
  schedule: string;
  price: string;
  highlights: string[];
  techTags: string[];
  maxSeats: number;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  tags: string[];
}

export interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string; // Clean local mock URL or embed
  chapterIndex: number;
  summary: string;
  notes: string[];
  quiz: {
    question: string;
    options: string[];
    correctAnswerIndex: number;
  };
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  github: string;
  avatar?: string;
  createdAt?: string;
  lastLogin?: string;
}
