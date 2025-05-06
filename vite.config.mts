import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react-swc";
import {startGitHubProxy} from "./src/proxy";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
const PORT: number = parseInt(process.env.SERVER_PORT || "4040");

export default defineConfig({
    base: "./",
    plugins: [
        react(),
        tsconfigPaths(),
        {
            name: 'local-github-proxy',
            configureServer(server) {
                startGitHubProxy();
            }
        }
    ],
    server: {
        port: PORT
    },
    // define: {
    //     "process.platform": {}
    // }
});
