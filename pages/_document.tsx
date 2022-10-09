import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.png" />
        <meta
          name="title"
          content="Crea tu álbum de figuritas del mundial personalizado."
        />
        <meta
          name="description"
          content="Ahora podes crear tu propio álbum de figuritas Qatar 2022 gratis! Elegí las fotos de tus amigos, armá tu equipo y descargá las figuritas para imprimir."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://figuritas.vercel.app/" />
        <meta
          property="og:title"
          content="Crea tu álbum de figuritas del mundial personalizado."
        />
        <meta
          property="og:description"
          content="Ahora podes crear tu propio álbum de figuritas Qatar 2022 gratis! Elegí las fotos de tus amigos, armá tu equipo y descargá las figuritas para imprimir."
        />
        <meta
          property="og:image"
          content="https://figuritas.vercel.app/cover.jpg"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://figuritas.vercel.app/" />
        <meta
          name="twitter:title"
          content="Crea tu álbum de figuritas del mundial personalizado."
        />
        <meta
          name="twitter:description"
          content="Ahora podes crear tu propio álbum de figuritas Qatar 2022 gratis! Elegí las fotos de tus amigos, armá tu equipo y descargá las figuritas para imprimir."
        />
        <meta
          name="twitter:image"
          content="https://figuritas.vercel.app/cover.jpg"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
