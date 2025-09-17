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
        <p className="text-lg">
          Your premier destination for mastering the art of frontend web development
        </p>
      </div>

      <div className="prose mx-auto mt-14 text-center dark:prose-invert">
        {`At FrontendPedia, we go beyond tutorials and code snippets—we’re building a hub where developers evolve into creators of exceptional digital experiences. Our platform curates the most forward-thinking resources, blending expert insights with practical guidance to help you master every layer of modern frontend engineering.

      From the fundamentals of HTML5, CSS3, and JavaScript to advanced ecosystems like React, Angular, Vue, and Svelte, we show you not just how these tools work, but why they matter. You’ll uncover the secrets of responsive design, accessibility, performance optimization, and cutting-edge practices that power the fastest, most inclusive websites on the internet.
      
      We don’t just follow trends—we anticipate them. Progressive Web Apps, WebAssembly, JAMstack, and the future of browser technologies are all explored with clarity and creativity, so you can stay ahead of the curve. With hands-on coding challenges, real-world project blueprints, and a thriving community of peers, FrontendPedia is where learning transforms into mastery.
      
      Whether you’re just starting your journey or shaping large-scale web architectures, FrontendPedia equips you to innovate, inspire, and impact the digital world. Here, growth never stops, and creativity fuels every step.`}
      </div>
    </Container>
  );
}
