/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "media.kijiji.ca",
    //     port: "",
    //     pathname: "/api/v1/**/images/**/**",
    //   },
    // ],
    unoptimized: true,
  },
};

export default nextConfig;
