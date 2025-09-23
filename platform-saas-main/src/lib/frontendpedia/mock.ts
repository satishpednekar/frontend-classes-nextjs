import type {
  AdminMetrics,
  Bookmark,
  ContentItem,
  LearningPath,
  LearningPathItem,
  Note,
} from "./types";

const now = () => new Date().toISOString();

export const mockContent: ContentItem[] = [
  {
    id: "c1",
    title: "Getting Started with React 19",
    type: "post",
    slug: "getting-started-react-19",
    tags: ["react", "beginner"],
    difficulty: "beginner",
    description: "A practical introduction to React 19 features.",
    publishedAt: now(),
  },
  {
    id: "c2",
    title: "TypeScript for JavaScript Developers",
    type: "pdf",
    url: "https://example.com/typescript.pdf",
    tags: ["typescript", "intermediate"],
    difficulty: "intermediate",
    description: "A concise TS guide for JS devs.",
    publishedAt: now(),
  },
  {
    id: "c3",
    title: "Building Accessible UI with Tailwind v4",
    type: "video",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tags: ["tailwind", "accessibility"],
    difficulty: "beginner",
    description: "Accessible UI patterns and Tailwind utilities.",
    publishedAt: now(),
  },
  {
    id: "c4",
    title: "Frontend Architecture Reading List",
    type: "link",
    url: "https://frontendpedia.com/archive",
    tags: ["architecture", "reading"],
    difficulty: "advanced",
    description: "Curated architecture references.",
    publishedAt: now(),
  },
];

export const mockLearningPath: LearningPath = {
  id: "lp1",
  title: "Modern Frontend Foundations",
  progressPercent: 40,
  items: (
    [
      { id: "lpi1", order: 1, content: mockContent[0], status: "done" },
      { id: "lpi2", order: 2, content: mockContent[1], status: "in_progress" },
      { id: "lpi3", order: 3, content: mockContent[2], status: "pending" },
      { id: "lpi4", order: 4, content: mockContent[3], status: "pending" },
    ] as LearningPathItem[]
  ),
};

export const mockBookmarks: Bookmark[] = [
  { id: "b1", content: mockContent[0], createdAt: now() },
  { id: "b2", content: mockContent[2], createdAt: now() },
];

export const mockNotes: Note[] = [
  {
    id: "n1",
    contentId: "c1",
    body: "Key takeaways about React Server Components.",
    createdAt: now(),
  },
];

export const mockAdminMetrics: AdminMetrics = {
  totalUsers: 1240,
  activeProUsers: 176,
  mrrUsd: 3320,
  newSignupsThisWeek: 48,
};


