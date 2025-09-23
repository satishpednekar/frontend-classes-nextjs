export type ContentType = "post" | "video" | "pdf" | "link";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type ContentItem = {
  id: string;
  title: string;
  type: ContentType;
  url?: string;
  slug?: string;
  tags: string[];
  difficulty?: Difficulty;
  description?: string;
  publishedAt?: string;
};

export type LearningPathItem = {
  id: string;
  order: number;
  content: ContentItem;
  status: "pending" | "in_progress" | "done";
};

export type LearningPath = {
  id: string;
  title: string;
  progressPercent: number;
  items: LearningPathItem[];
};

export type Bookmark = {
  id: string;
  content: ContentItem;
  createdAt: string;
};

export type Note = {
  id: string;
  contentId: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
};

export type AdminMetrics = {
  totalUsers: number;
  activeProUsers: number;
  mrrUsd: number;
  newSignupsThisWeek: number;
};


