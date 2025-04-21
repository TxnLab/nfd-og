/* eslint-disable @next/next/no-img-element */
import { NfdClient } from '@txnlab/nfd-sdk'
import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

const font = fetch(
  new URL('../../assets/SF-UI-Display-Heavy.otf', import.meta.url),
).then((res) => res.arrayBuffer())

// Fallback avatar
const fallbackAvatar = fetch(
  new URL('../../assets/avatar.jpg', import.meta.url),
).then((res) => res.arrayBuffer())

// Fallback banner
const fallbackBanner = fetch(
  new URL('../../assets/banner.jpg', import.meta.url),
).then((res) => res.arrayBuffer())

// Default fallback image for when no name is provided
const defaultImage = fetch(
  new URL('../../assets/default.jpg', import.meta.url),
).then((res) => res.arrayBuffer())

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')
  const network =
    searchParams.get('network')?.toLowerCase() === 'testnet'
      ? 'testnet'
      : 'mainnet'

  const fontData = await font
  const fallbackAvatarData = await fallbackAvatar
  const fallbackAvatarBase64 = `data:image/jpeg;base64,${Buffer.from(fallbackAvatarData).toString('base64')}`
  const fallbackBannerData = await fallbackBanner
  const fallbackBannerBase64 = `data:image/jpeg;base64,${Buffer.from(fallbackBannerData).toString('base64')}`
  const defaultImageData = await defaultImage
  const defaultImageBase64 = `data:image/jpeg;base64,${Buffer.from(defaultImageData).toString('base64')}`

  if (!name) {
    return new ImageResponse(
      (
        <div tw="flex flex-col w-full h-full">
          <img
            src={defaultImageBase64}
            alt="NFD Default"
            width={1200}
            height={630}
            tw="w-full h-full"
            style={{ objectFit: 'cover' }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  }

  try {
    // Initialize NFD client based on network parameter
    const nfdClient =
      network === 'testnet' ? NfdClient.testNet() : NfdClient.mainNet()

    // Default values if NFD data cannot be fetched
    let avatarUrl = null
    let bannerUrl = null
    let isAvatarWebp = false
    let isBannerWebp = false

    try {
      // Resolve NFD data
      const nfdData = await nfdClient.resolve(name, { view: 'full' })

      if (nfdData) {
        // Extract properties
        const userDefined = nfdData.properties?.userDefined
        const verified = nfdData.properties?.verified

        // Process avatar URL
        const rawAvatarUrl = verified?.avatar || userDefined?.avatar || null
        const avatarResult = await processIpfsUrl(rawAvatarUrl)
        avatarUrl = avatarResult?.url
        isAvatarWebp = avatarResult?.isWebp || false

        // Process banner URL
        const rawBannerUrl = verified?.banner || userDefined?.banner || null
        const bannerResult = await processIpfsUrl(rawBannerUrl)
        bannerUrl = bannerResult?.url
        isBannerWebp = bannerResult?.isWebp || false
      }
    } catch (error) {
      console.error('Error fetching NFD data:', error)
    }

    return new ImageResponse(
      (
        <div
          style={{ fontFamily: 'SF-UI-Display-Heavy', fontSize: 48 }}
          tw="flex flex-col w-full h-full bg-white relative"
        >
          {/* Banner section */}
          <div tw="flex w-full relative" style={{ height: '400px' }}>
            {/* Banner image */}
            <div tw="flex w-full h-full absolute top-0 left-0 overflow-hidden bg-gray-100">
              {bannerUrl && !isBannerWebp ? (
                <img
                  src={bannerUrl}
                  alt="Banner"
                  width={1200}
                  height={400}
                  tw="w-full h-full"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={fallbackBannerBase64}
                  alt="Banner"
                  width={1200}
                  height={400}
                  tw="w-full h-full"
                  style={{ objectFit: 'cover' }}
                />
              )}
            </div>
          </div>

          {/* Avatar */}
          <div tw="flex absolute" style={{ top: '300px', left: '60px' }}>
            <div tw="flex items-center justify-center w-[200px] h-[200px] rounded-full overflow-hidden border-[4px] border-white bg-gray-100">
              {avatarUrl && !isAvatarWebp ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  width={200}
                  height={200}
                  tw="w-full h-full"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={fallbackAvatarBase64}
                  alt="Avatar"
                  width={200}
                  height={200}
                  tw="w-full h-full"
                  style={{ objectFit: 'cover' }}
                />
              )}
            </div>

            {/* Name */}
            <div tw="flex absolute -bottom-[125px] w-[880px]">
              <p
                tw="flex w-full text-[48px] text-black leading-normal tracking-tight"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '880px',
                }}
              >
                {name}
              </p>
            </div>
          </div>

          {/* NFD logo (bottom right) */}
          <div tw="flex absolute bottom-[56px] right-[64px]">
            <div tw="flex items-center justify-center bg-[#FF5C35] rounded-full w-28 h-28">
              <svg
                width="112"
                height="112"
                viewBox="0 0 4000 4000"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon
                  fill="white"
                  points="2020.2,1539.2 2020.2,1539.2 1539.2,1539.2 1539.2,1539.2 1539.2,1699.5 1539.2,1859.9 1539.2,2020.2 1539.2,2180.5 1539.2,2501.2 2020.2,2501.2 2020.2,2180.5 2260.7,2180.5 2260.7,2020.2 2260.7,1859.9 2501.2,1859.9 2501.2,1699.5 2501.2,1539.2"
                />
                <polygon
                  fill="white"
                  points="986.1,1539.2 986.1,2020.2 505.1,1539.2 505.1,2501.2 986.1,2501.2 1467.1,2501.2 1467.1,2020.2 1467.1,1539.2"
                />
                <path
                  fill="white"
                  d="M3054.4,1539.2h-481 v481v481h481c265.6,0,481-215.4,481-481C3535.4,1754.6,3320,1539.2,3054.4,1539.2z"
                />
              </svg>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'SF-UI-Display-Heavy',
            data: fontData,
            weight: 700,
            style: 'normal',
          },
        ],
      },
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new ImageResponse(
      (
        <div tw="flex flex-col text-[40px] text-white bg-[#1a1a1a] w-full h-full justify-center items-center p-10">
          <p>Error generating image</p>
          <p tw="text-[24px] text-[#999999]">Please try again later</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  }
}

// Helper function to process IPFS URLs
async function processIpfsUrl(
  url: string | null,
): Promise<{ url: string | null; isWebp: boolean }> {
  if (!url) return { url: null, isWebp: false }

  // Convert IPFS URLs to HTTP URLs
  if (url.startsWith('ipfs://')) {
    const cid = url.replace('ipfs://', '')
    const nfdUrl = `https://images.nf.domains/ipfs/${cid}`

    try {
      const response = await fetch(nfdUrl, { method: 'HEAD' })
      if (response.ok) {
        // Check if the image is webp
        const contentType = response.headers.get('content-type')
        const isWebp = contentType?.includes('image/webp') || false

        return { url: nfdUrl, isWebp }
      }
    } catch {
      console.info(
        `CID ${cid} is not cached on images.nf.domains, trying IPFS gateway...`,
      )
    }

    // Fallback to IPFS gateway
    try {
      const gatewayUrl = `https://ipfs.algonode.dev/ipfs/${cid}`
      const response = await fetch(gatewayUrl, { method: 'HEAD' })
      if (response.ok) {
        // Check if the image is webp
        const contentType = response.headers.get('content-type')
        const isWebp = contentType?.includes('image/webp') || false

        return { url: gatewayUrl, isWebp }
      }
    } catch {
      console.error(`Failed to fetch image from IPFS gateway for CID ${cid}`)
    }

    // Return the URL even if we couldn't check the content type
    return { url: `https://ipfs.algonode.dev/ipfs/${cid}`, isWebp: false }
  }

  // For non-IPFS URLs, try to check if it's webp
  try {
    const response = await fetch(url, { method: 'HEAD' })
    if (response.ok) {
      const contentType = response.headers.get('content-type')
      const isWebp = contentType?.includes('image/webp') || false
      return { url, isWebp }
    }
  } catch {
    console.error(`Failed to check content type for URL ${url}`)
  }

  // Return the URL without being able to check if it's webp
  return { url, isWebp: false }
}
