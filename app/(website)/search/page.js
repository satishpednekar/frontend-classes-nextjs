import { Suspense } from "react";
import Container from "@/components/container";
import SearchResults from "./search-results";
import Loading from "@/components/loading";
import Search from "@/components/search";

export const dynamic = "force-dynamic";
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default async function SearchPage({ searchParams }) {
  return (
    <>
      <Container className="relative">
        <h1 className="text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
          Search
        </h1>
        <div className="text-center">
          <p className="mt-2 text-lg">
            Find posts by searching for keywords.
          </p>
        </div>
        
        <div className="mt-8 max-w-md mx-auto">
          <Search />
        </div>
        
        <Suspense
          key={searchParams.q || "empty"}
          fallback={<Loading />}>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}
