import Container from "@/components/container";
import { urlForImage } from "@/lib/sanity/image";
import Image from "next/image";
import Link from "next/link";

export default function About({ authors, settings }) {
  return (
    <Container>
      <h1 className="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
        About
      </h1>
      <div className="text-center">
        <p className="text-lg">Your premier destination for mastering the art of frontend web development</p>
      </div>

      {/* <div className="mb-16 mt-6 grid grid-cols-3 gap-5 md:mb-32 md:mt-16 md:gap-16">
        {authors.slice(0, 3).map(author => {
          const imageProps = urlForImage(author?.image) || null;
          return (
            <div
              key={author._id}
              className="relative aspect-square overflow-hidden rounded-md bg-slate-50 odd:translate-y-10 odd:md:translate-y-16">
              <Link href={`/author/${author?.slug}`}>
                {imageProps && (
                  <Image
                    src={imageProps?.src}
                    alt={author?.name || " "}
                    fill
                    sizes="(max-width: 320px) 100vw, 320px"
                    className="object-cover"
                  />
                )}
              </Link>
            </div>
          );
        })}
      </div> */}

      <div className="prose mx-auto mt-14 text-center dark:prose-invert">
      {"FrontendPedia - Our curated collection of cutting-edge resources empowers developers of all levels to stay ahead in the rapidly evolving world of web technologies. Dive into comprehensive tutorials, expert insights, and practical guides covering HTML5, CSS3, JavaScript, and beyond. Discover the latest frameworks and libraries, from React and Vue to Angular and Svelte, and learn how to leverage them effectively in your projects. Explore responsive design techniques, accessibility best practices, and performance optimization strategies to create seamless user experiences across devices. Stay informed about emerging trends like Progressive Web Apps, WebAssembly, and JAMstack architecture. Sharpen your skills with hands-on coding challenges and real-world project examples. Whether you\'re a beginner taking your first steps or a seasoned pro looking to refine your craft, FrontendPedia offers the tools and knowledge you need to excel. Join our vibrant community of passionate developers, share your experiences, and collaborate on innovative solutions. Elevate your frontend development skills, boost your career prospects, and shape the future of the web with FrontendPedia – where learning never stops and creativity knows no bounds."}
      </div>
    </Container>
  );
}
