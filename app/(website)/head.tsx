export default function Head() {
  return (
    <>
      {/* Preconnected origins for faster third-party fetches */}
      <link rel="preconnect" href="https://cdn.sanity.io" />
      <link rel="dns-prefetch" href="https://cdn.sanity.io" />

      <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
      <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="" />
    </>
  );
}


