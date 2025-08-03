import { defineConfig } from "vite";
import {resolve} from "path";

export default defineConfig({
	appType: "mpa",
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				tropical: resolve(__dirname, "tropical.html"),
				config: resolve(__dirname, "config.html"),
			}
		}
	}
});
