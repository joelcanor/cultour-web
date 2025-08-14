import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Manifest PWA */}
        <link rel="manifest" href="/manifest.json" />

        {/* Color del navegador */}
        <meta name="theme-color" content="#317EFB" />

        {/* Íconos principales */}
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-512x512.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
