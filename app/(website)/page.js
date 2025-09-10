import HomePage from "./home";
import { getAllPosts } from "@/lib/sanity/client";

export default async function IndexPage() {
  // Force fresh data fetch
  const posts = await getAllPosts();
  
  return <HomePage posts={posts} />;
}

// Force dynamic rendering and no caching
export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
