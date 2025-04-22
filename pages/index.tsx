/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import { useState } from 'react'

import type { NextPage } from 'next'

const Home: NextPage = () => {
  // Example NFD to showcase the API - using a well-known NFD
  const exampleNfd = 'nfdomains.algo'
  const [network, setNetwork] = useState<'mainnet' | 'testnet'>('mainnet')
  const ogImageUrl = `/api/og?name=${exampleNfd}&network=${network}`

  return (
    <div>
      <Head>
        <title>NFD OG Image Generator</title>
        <meta
          name="description"
          content="Generate Open Graph images for NFDomains"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:title" content="NFD OG Image Generator" />
        <meta
          property="og:description"
          content="Generate dynamic social card images for NFDomains"
        />
      </Head>

      <main>
        <h1>NFD OG Image Generator</h1>

        <div>
          <h2>API Usage</h2>
          <div>
            <code>GET /api/og?name=alice.algo&network=mainnet|testnet</code>
          </div>

          <div>
            <h3>Parameters:</h3>
            <div>
              <div>
                <code>name</code> - NFD name (required)
              </div>
              <div>
                <code>network</code> - Network to resolve from: mainnet
                (default) or testnet
              </div>
            </div>
          </div>

          <h3>Examples:</h3>
          <div>
            <div>MainNet (default):</div>
            <a
              href={`/api/og?name=${exampleNfd}`}
              target="_blank"
              rel="noreferrer"
            >
              {`/api/og?name=${exampleNfd}`}
            </a>
          </div>

          <div>
            <div>TestNet:</div>
            <a
              href={`/api/og?name=${exampleNfd}&network=testnet`}
              target="_blank"
              rel="noreferrer"
            >
              {`/api/og?name=${exampleNfd}&network=testnet`}
            </a>
          </div>

          <div>
            <div>Default image (when no name is provided):</div>
            <a href="/api/og" target="_blank" rel="noreferrer">
              /api/og
            </a>
          </div>
        </div>

        <div>
          <h2>Preview</h2>
          <div>
            <p>
              Example OG image for <code>{exampleNfd}</code> on{' '}
              <code>{network}</code>:
            </p>
            <div style={{ marginBottom: '8px' }}>
              <button
                onClick={() => setNetwork('mainnet')}
                style={{ marginRight: '4px' }}
              >
                MainNet
              </button>
              <button onClick={() => setNetwork('testnet')}>TestNet</button>
            </div>
          </div>
          <div>
            <img
              src={ogImageUrl}
              alt="Example OG Image"
              width="600"
              height="315"
            />
          </div>
        </div>

        <div>
          <h2>Features</h2>
          <ul>
            <li>Dynamic image generation based on NFD profile data</li>
            <li>Support for both MainNet and TestNet NFDs</li>
            <li>
              Fallback support for webp images (not supported, see{' '}
              <a
                href="https://github.com/vercel/satori/pull/622"
                target="_blank"
                rel="noreferrer"
              >
                vercel/satori#622
              </a>
              )
            </li>
            <li>Default image when no name parameter is provided</li>
            <li>Clean, modern design with NFD branding</li>
          </ul>
        </div>

        <div>
          <h2>Documentation</h2>
          <p>
            For full documentation and source code, visit the GitHub repository:
          </p>
          <a
            href="https://github.com/TxnLab/nfd-og"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repository
          </a>
        </div>
      </main>

      <footer>
        Powered by{' '}
        <a
          href="https://nfdomains.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          NFDomains
        </a>
      </footer>
    </div>
  )
}

export default Home
