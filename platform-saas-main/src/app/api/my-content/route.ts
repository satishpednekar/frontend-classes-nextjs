import { mockBookmarks, mockNotes } from "@/lib/frontendpedia/mock";

export async function GET() {
  return Response.json({ bookmarks: mockBookmarks, notes: mockNotes });
}


