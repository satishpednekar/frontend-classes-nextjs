import PostList from "@/components/postlist";
import { searchPosts } from "@/lib/sanity/client";

export default async function SearchResults({ searchParams }) {
  const query = searchParams.q || "";
  const posts = query ? await searchPosts(query) : [];

  return (
    <>
      {query && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {posts.length > 0 ? (
              <>
                Found <span className="font-semibold text-blue-600 dark:text-blue-400">{posts.length}</span> result{posts.length === 1 ? "" : "s"} for: <span className="font-semibold">&quot;{query}&quot;</span>
              </>
            ) : (
              <>
                Search results for: <span className="font-semibold">&quot;{query}&quot;</span>
              </>
            )}
          </p>
        </div>
      )}
      
      {posts && posts?.length === 0 && query && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No posts found for &quot;<span className="font-semibold">{query}</span>&quot;. Try different keywords.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Try searching for:</p>
              <ul className="mt-2 space-y-1">
                <li>• Different keywords</li>
                <li>• Broader terms</li>
                <li>• Check spelling</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {!query && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Start Searching
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a search term to find posts about frontend development.
            </p>
          </div>
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
