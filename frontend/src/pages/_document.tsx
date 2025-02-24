import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="プログラミングのエラー内容や解決方法を記録できるバグノートアプリ。"
        />
        <meta
          name="keywords"
          content="プログラミング, バグ, デバッグ, エラー解決"
        />
        <meta name="author" content="Bug Note Team" />

        <meta property="og:title" content="Bug Note - エラー解決の記録" />
        <meta
          property="og:description"
          content="プログラミングのエラー内容や解決方法を記録し、検索できるアプリ。"
        />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bugnote.example.com" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bug Note - エラー解決の記録" />
        <meta
          name="twitter:description"
          content="プログラミングのエラー内容や解決方法を記録し、検索できるアプリ。"
        />
        <meta name="twitter:image" content="/twitter-image.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
