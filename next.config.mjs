/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverActions: {
    bodySizeLimit: "5mb",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zapi.zdigital.fr",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
