import { mockContent } from "@/lib/frontendpedia/mock";

export async function GET() {
  // Basic sort by publishedAt desc
  const data = [...mockContent].sort((a, b) =>
    (b.publishedAt || "").localeCompare(a.publishedAt || "")
  );
  return Response.json({ items: data });
}


