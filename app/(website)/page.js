import HomePage from "./home";
import { getAllPosts } from "@/lib/sanity/client";

export const dynamic = "force-dynamic";

export const runtime = "edge";

export default async function IndexPage() {
  const posts = await getAllPosts();
  return <HomePage posts={posts} />;
}

export const revalidate = 0;
