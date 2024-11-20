import { resolve } from "path";

const isCodeSandbox =
	"SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env;

export default {
	root: "src/",
	publicDir: "../static/",
	base: "./",
	server: {
		host: true,
		open: !isCodeSandbox,
	},
	build: {
		outDir: "../dist",
		emptyOutDir: true,
		sourcemap: true,
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			input: {
				main: resolve(__dirname, "src/index.html"),
				contact: resolve(__dirname, "src/contact.html"),
				projects: resolve(__dirname, "src/projects.html"),
			},
			output: {
				manualChunks: {
					vendor: ["three", "gsap"],
				},
			},
		},
	},
};
