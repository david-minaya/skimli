import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel='shortcut icon' href='/favicon.png'/>
        <link rel='icon' type='image/x-icon' href='/favicon.png'/>
      </Head>
      <body>
        <Main/>
        <NextScript/>
      </body>
    </Html>
  );
}
