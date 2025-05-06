import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const PORT = 4000;

let app: any | undefined = undefined;

export function startGitHubProxy() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    console.warn("------------------------------------------------------------");
    console.warn("GITHUB_TOKEN is missing - please create a GitHub Personal");
    console.warn("Access Token (legacy type) and then configure the");
    console.warn("GITHUB_TOKEN env var.");
    console.warn("------------------------------------------------------------");
    process.exit(1);
  }

  app = express();
  app.use(cors());

  app.get("/api/notifications", async (req: Request, res: Response) => {
    console.log("baseUrl: " + req.baseUrl);
    console.log("url: " + req.url);
    console.log("query: " + JSON.stringify(req.query));

    try {
      const response = await axios.get("https://api.github.com/notifications", {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`
        },
        params: req.query,
      });

      console.info("Success: " + response.status);
      res.json(response.data);
    } catch (error: any) {
      console.error("Error fetching GitHub notifications:", error.message);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
  });

}


