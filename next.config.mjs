/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "media.kijiji.ca",
				port: "",
				pathname: "/api/v1/**/images/**/**",
			},
			{
				// TODO: store a local copy of this
				protocol: "https",
				hostname: "www.kijiji.ca",
				port: "",
				pathname: "/next-assets/images/not-found.jpg",
			},
		],
	},
};

export default nextConfig;
