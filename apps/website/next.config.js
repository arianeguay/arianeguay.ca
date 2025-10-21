const { composePlugins, withNx } = require("@nx/next");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  reactStrictMode: true,
  images: {
    domains: ["images.ctfassets.net"],
    formats: ["image/avif", "image/webp"],
  },
  styledComponents: {
    displayName: true,
    ssr: true,
    minify: true,
    fileName: false,
  },
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
  // Ensure all pages are static by default
  output: "export",
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
