import PostList from "@/components/postlist";
import Pagination from "@/components/blog/pagination";
import Container from "@/components/container";
import Link from "next/link";
import { getPaginatedPosts, getTopCategories, getAllAuthors } from "@/lib/sanity/client";

export default async function Post({ searchParams }) {
  // Fetch the current page from the query parameters, defaulting to 1 if it doesn't exist
  const page = searchParams.page;
  const pageIndex = parseInt(page, 10) || 1;

  // Set the number of posts to be displayed per page
  const POSTS_PER_PAGE = 6;

  // Define the parameters for fetching posts based on the current page
  const params = {
    pageIndex: (pageIndex - 1) * POSTS_PER_PAGE,
    limit: pageIndex * POSTS_PER_PAGE
  };

  // Fetch all data in parallel
  const [posts, categories, authors] = await Promise.all([
    getPaginatedPosts(params),
    getTopCategories(),
    getAllAuthors()
  ]);

  // Check if the current page is the first or the last
  const isFirstPage = pageIndex < 2;
  const isLastPage = posts.length < POSTS_PER_PAGE;

  return (
    <Container>
      <h1 className="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
        Archive
      </h1>
      <div className="text-center">
        <p className="text-lg">
          Browse all posts, categories, and authors
        </p>
      </div>

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Categories</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/category/${category.slug?.current || category.title?.toLowerCase().replace(/\s+/g, '-')}`}
                className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {category.count} {category.count === 1 ? 'post' : 'posts'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Authors Section */}
      {authors && authors.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Authors</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {authors.map((author) => (
              <Link
                key={author._id}
                href={`/author/${author.slug?.current || author.name?.toLowerCase().replace(/\s+/g, '-')}`}
                className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {author.name}
                </h3>
                {author.bio && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {author.bio}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Posts Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Latest Posts</h2>
        {posts && posts?.length === 0 && (
          <div className="flex h-40 items-center justify-center">
            <span className="text-lg text-gray-500">
              No posts found!
            </span>
          </div>
        )}
        <div className="grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3">
          {posts.map(post => (
            <PostList key={post._id} post={post} aspect="square" />
          ))}
        </div>

        <Pagination
          pageIndex={pageIndex}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
        />
      </div>
    </Container>
  );
}
