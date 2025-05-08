import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const GITHUB_API_URL = "https://api.github.com";

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

  app.all("/*", async (req: Request, res: Response) => {
    let burl: string = req.url;
    const qidx: number = burl.indexOf("?");
    if (qidx >= 0) {
      burl = burl.substring(0, qidx);
    }
    const ghUrl: string = GITHUB_API_URL + burl;
    console.log("--- request ---");
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("burl: " + burl);
    console.log("query: " + JSON.stringify(req.query));
    console.log("ghurl: " + ghUrl);

    try {
      const axiosConfig = {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Host: "api.github.com",
        },
        params: req.query,
      };
      let response;
      switch (req.method) {
        case "GET":
          response = await axios.get(ghUrl, axiosConfig);
          break;
        case "POST":
          response = await axios.post(ghUrl, req.body, axiosConfig);
          break;
        case "PUT":
          response = await axios.put(ghUrl, req.body, axiosConfig);
          break;
        case "PATCH":
          response = await axios.patch(ghUrl, req.body, axiosConfig);
          break;
        case "DELETE":
          response = await axios.delete(ghUrl, axiosConfig);
          break;
      }

      console.info("Success: " + response.status, response.statusText);
      res.json(response.data);
    } catch (error: any) {
      console.error("Error: ", error.status, error.message);
      res.status(error.status).json({ error: error.message });
    }
    console.log("");
  });

  app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
  });

}


