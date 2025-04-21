# NFD OG Image Generator

This service generates dynamic Open Graph images for NFDomains. It provides an API endpoint that returns customized OG images for NFD profiles to be displayed when NFD profile links are shared on social media platforms.

## Features

- Dynamic image generation based on NFD profile data
- Displays NFD avatar and banner images
- Fallback support for webp images (not supported by @vercel/og)
- Supports both MainNet and TestNet NFDs
- Default image when no name parameter is provided
- Clean, modern design with NFD branding

## API Usage

### Endpoint

```
GET /api/og?name={nfd_name}&network={network}
```

### Parameters

- `name` (required): The NFD name, including TLD (e.g., `alice.algo`)
- `network` (optional): Network to resolve the NFD from - `mainnet` (default) or `testnet`

### Examples

```
# MainNet NFD (default)
https://og.nfd.domains/api/og?name=alice.algo

# TestNet NFD
https://og.nfd.domains/api/og?name=alice.algo&network=testnet

# Default image (when no name is provided)
https://og.nfd.domains/api/og
```

## How It Works

1. The service resolves the NFD using the provided name and network
2. It fetches the avatar and banner from the NFD properties (verified or user-defined)
3. For webp images (unsupported by @vercel/og), it uses fallback JPEG images
4. When no name is provided, it returns a default image

## Development

This project is built with:

- Next.js (with Edge runtime)
- @vercel/og for image generation
- @txnlab/nfd-sdk for resolving NFD data
- Satori for rendering React components to SVG

### Running Locally

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000/api/og?name=alice.algo](http://localhost:3000/api/og?name=alice.algo) to see the generated image.

### Deployment

This project is designed to be deployed on Vercel. It uses Edge Functions for optimal performance and global distribution.

```bash
# Deploy to Vercel
vercel
```

## License

MIT
