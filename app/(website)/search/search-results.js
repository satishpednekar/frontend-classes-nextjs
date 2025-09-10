import PostList from "@/components/postlist";
import { searchPosts } from "@/lib/sanity/client";

export default async function SearchResults({ searchParams }) {
  const query = searchParams.q || '';
  const posts = query ? await searchPosts(query) : [];

  return (
    <>
      {query && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Search results for: <span className="font-semibold">"{query}"</span>
          </p>
        </div>
      )}
      
      {posts && posts?.length === 0 && query && (
        <div className="flex h-40 items-center justify-center">
          <span className="text-lg text-gray-500">
            No posts found for "{query}". Try different keywords.
          </span>
        </div>
      )}

      {!query && (
        <div className="flex h-40 items-center justify-center">
          <span className="text-lg text-gray-500">
            Enter a search term to find posts.
          </span>
        </div>
      )}

      {posts && posts.length > 0 && (
        <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3">
          {posts.map(post => (
            <PostList key={post._id} post={post} aspect="square" />
          ))}
        </div>
      )}
    </>
  );
}
