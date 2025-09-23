import { mockLearningPath } from "@/lib/frontendpedia/mock";

export async function GET() {
  return Response.json(mockLearningPath);
}


