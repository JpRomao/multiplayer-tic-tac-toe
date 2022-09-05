/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en", "pt"],
    defaultLocale: "pt",
    // domains: [],
  },
};

module.exports = nextConfig;
