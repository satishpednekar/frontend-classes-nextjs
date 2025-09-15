import Image from "next/image";
import Link from "next/link";
import { PortableText as PortableTextComponent } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/image";
import Iframe from "react-iframe";
import getVideoId from "get-video-id";
import { cx } from "@/utils/all";

import Refractor from "react-refractor";
import js from "refractor/lang/javascript";
import jsx from "refractor/lang/jsx";
import html from "refractor/lang/markup";
import css from "refractor/lang/css";
import bash from "refractor/lang/bash";
import typescript from "refractor/lang/typescript";
import tsx from "refractor/lang/tsx";
import json from "refractor/lang/json";
import yaml from "refractor/lang/yaml";
import python from "refractor/lang/python";
import go from "refractor/lang/go";
import java from "refractor/lang/java";
import c from "refractor/lang/c";
import cpp from "refractor/lang/cpp";
import ruby from "refractor/lang/ruby";
import php from "refractor/lang/php";
import sql from "refractor/lang/sql";
import docker from "refractor/lang/docker";
import graphql from "refractor/lang/graphql";
import markdown from "refractor/lang/markdown";
import diff from "refractor/lang/diff";
import rust from "refractor/lang/rust";
import kotlin from "refractor/lang/kotlin";
import swift from "refractor/lang/swift";
import powershell from "refractor/lang/powershell";
import batch from "refractor/lang/batch";
import csharp from "refractor/lang/csharp";
import sass from "refractor/lang/sass";
import scss from "refractor/lang/scss";

Refractor.registerLanguage(js);
Refractor.registerLanguage(jsx);
Refractor.registerLanguage(html);
Refractor.registerLanguage(css);
Refractor.registerLanguage(bash);
Refractor.registerLanguage(typescript);
Refractor.registerLanguage(tsx);
Refractor.registerLanguage(json);
Refractor.registerLanguage(yaml);
Refractor.registerLanguage(python);
Refractor.registerLanguage(go);
Refractor.registerLanguage(java);
Refractor.registerLanguage(c);
Refractor.registerLanguage(cpp);
Refractor.registerLanguage(ruby);
Refractor.registerLanguage(php);
Refractor.registerLanguage(sql);
Refractor.registerLanguage(docker);
Refractor.registerLanguage(graphql);
Refractor.registerLanguage(markdown);
Refractor.registerLanguage(diff);
Refractor.registerLanguage(rust);
Refractor.registerLanguage(kotlin);
Refractor.registerLanguage(swift);
Refractor.registerLanguage(powershell);
Refractor.registerLanguage(batch);
Refractor.registerLanguage(csharp);
Refractor.registerLanguage(sass);
Refractor.registerLanguage(scss);

const registeredLanguages = new Set([
  "javascript",
  "jsx",
  "markup",
  "css",
  "bash",
  "typescript",
  "json",
  "yaml",
  "python",
  "go",
  "java",
  "c",
  "cpp",
  "ruby",
  "php",
  "sql",
  "docker",
  "graphql",
  "markdown",
  "diff",
  "rust",
  "kotlin",
  "swift",
  "powershell",
  "batch",
  "csharp",
  "sass",
  "scss"
]);

// Barebones lazy-loaded image component
const ImageComponent = ({ value }) => {
  const imageUrl = urlForImage(value);
  const imageWidth = value.asset?.metadata?.dimensions?.width || 800;
  const imageHeight = value.asset?.metadata?.dimensions?.height || 600;
  const aspectRatio = (imageHeight / imageWidth) * 100;

  return (
    <div className="my-6 overflow-hidden rounded-lg">
      <div className="relative" style={{ paddingBottom: `${aspectRatio}%` }}>
        <Image
          src={imageUrl}
          alt={value.alt || "Image"}
          className="object-contain"
          sizes="(max-width: 800px) 100vw, 800px"
          fill
          priority={false}
          loading="lazy"
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </div>
      {value.caption && (
        <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
          {value.caption}
        </p>
      )}
    </div>
  );
};

const PortableTextTable = ({ value }) => {
  const [head, ...rows] = value.table.rows;

  return (
    <table>
      {head.cells.filter(Boolean).length > 0 && (
        <thead>
          <tr>
            {head.cells.map(cell => (
              <th key={cell}>{cell}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {row.cells.map((cell, index) => {
              return <td key={cell}>{cell}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Code = ({ value }) => {
  if (!value?.code) {
    return <pre className="bg-gray-800 p-4 text-gray-200">No code content available</pre>;
  }

  // Normalize common aliases from editors and fallback to 'javascript'
  const rawLanguage = (value.language || "javascript").toLowerCase();
  const aliasMap = {
    html: "markup",
    shell: "bash",
    sh: "bash",
    batchfile: "batch",
    md: "markdown",
    yml: "yaml",
    ts: "typescript",
    js: "javascript",
    tsx: "typescript",
    "c#": "csharp",
    "c++": "cpp",
    objc: "objectivec",
    ps: "powershell"
  };
  const editorMap = {
    golang: "go",
    mysql: "sql",
    xml: "markup",
    text: "text",
    groq: "text"
  };
  // Force-map TSX to TypeScript, regardless of registry
  if (rawLanguage === "tsx" || rawLanguage.includes("tsx")) {
    return (
      <Refractor
        language={"typescript"}
        value={value.code}
        markers={value.highlightedLines}
      />
    );
  }

  let language = editorMap[rawLanguage] || aliasMap[rawLanguage] || rawLanguage;
  if (language === "text") {
    return (
      <pre className="bg-gray-800 p-4 text-gray-200 overflow-x-auto"><code>{value.code}</code></pre>
    );
  }
  if (!registeredLanguages.has(language)) {
    return (
      <pre className="bg-gray-800 p-4 text-gray-200 overflow-x-auto"><code>{value.code}</code></pre>
    );
  }

  try {
    return (
      <Refractor
        language={language}
        value={value.code}
        markers={value.highlightedLines}
      />
    );
  } catch (error) {
    return (
      <pre className="bg-gray-800 p-4 text-gray-200 overflow-x-auto"><code>{value.code}</code></pre>
    );
  }
};

const IframePreview = ({ value }) => {
  const { url, height } = value;
  if (!url) {
    return <p>Missing Embed URL</p>;
  }
  const { id, service } = getVideoId(url);

  const isYoutubeVideo = id && service === "youtube";

  const finalURL = isYoutubeVideo
    ? `https://www.youtube-nocookie.com/embed/${id}`
    : url;

  return (
    <Iframe
      url={finalURL}
      width="100%"
      height={height || "350"}
      className={cx(!height && "aspect-video", "rounded-md")}
      display="block"
      position="relative"
      frameBorder="0"
      allowfullscreen
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
    />
  );
};

const components = {
  types: {
    image: ImageComponent,
    code: Code,
    embed: IframePreview,
    tables: PortableTextTable
  },
  marks: {
    center: props => (
      <div className="text-center">{props.children}</div>
    ),
    highlight: props => (
      <span className="font-bold text-blue-500">
        {props.children}
      </span>
    ),
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/")
        ? "noopener"
        : undefined;
      const target = !value.href.startsWith("/")
        ? "_blank"
        : undefined;
      return (
        <a href={value.href} rel={rel} target={target}>
          {children}
        </a>
      );
    },
    internalLink: ({ children, value }) => {
      return (
        <Link href={`/post/${value?.slug?.current}`}>{children}</Link>
      );
    }
  }
};
// Set up Portable Text serialization
export const PortableText = props => (
  <PortableTextComponent components={components} {...props} />
);
