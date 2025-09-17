import Container from "@/components/container";
import PostList from "@/components/postlist";
import Script from "next/script";
import { getPostsByCategory, getAllCategories } from "@/lib/sanity/client";

export async function generateStaticParams() {
  const entries = await getAllCategories();
  return entries.map(item => ({ slug: item.category }));
}

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const baseUrl = process.env.SITE_URL || "https://www.frontendpedia.com";
  const slug = params.slug;
  const title = `Category: ${slug}`;
  const description = `Articles filed under ${slug} on Frontendpedia.`;
  const url = `${baseUrl}/category/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description },
    twitter: { card: 'summary_large_image', title, description }
  };
}

export default async function CategoryPage({ params }) {
  const posts = await getPostsByCategory(params.slug);
  const baseUrl = process.env.SITE_URL || "https://www.frontendpedia.com";
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: `${baseUrl}/archive` },
      { '@type': 'ListItem', position: 3, name: params.slug, item: `${baseUrl}/category/${params.slug}` }
    ]
  };

  return (
    <>
      <Script id="ldjson-breadcrumb-cat" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(breadcrumb)}
      </Script>
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
    </>
  );
}


