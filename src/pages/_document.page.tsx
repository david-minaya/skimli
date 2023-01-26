import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel='shortcut icon' href='/favicon.png'/>
        <link rel='icon' type='image/x-icon' href='/favicon.png'/>
        <link rel='preconnect' href='https://fonts.googleapis.com'/>
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin=''/>
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
