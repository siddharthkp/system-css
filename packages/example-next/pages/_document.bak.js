import React from 'react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { collect } from 'system-css';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <style id="system-css-server" dangerouslySetInnerHTML={{ __html: collect() }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
