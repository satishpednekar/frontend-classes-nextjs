import Container from "@/components/container";
import PostList from "@/components/postlist";
import { getPostsByCategory, getAllCategories } from "@/lib/sanity/client";

export async function generateStaticParams() {
  const entries = await getAllCategories();
  return entries.map(item => ({ slug: item.category }));
}

export const revalidate = 0;

export default async function CategoryPage({ params }) {
  const posts = await getPostsByCategory(params.slug);

  return (
    <Container>
      <h1 className="mt-2 mb-3 text-3xl font-semibold tracking-tight text-center lg:leading-snug text-brand-primary lg:text-4xl dark:text-white">
        Category: {params.slug}
      </h1>
      <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3 ">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map(post => (
            <PostList key={post._id} post={post} aspect="square" />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No posts found for this category.
          </p>
        )}
      </div>
    </Container>
  );
}


