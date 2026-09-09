import http from "node:http";
import fs from "node:fs";
import { spawn } from "node:child_process";

const ARTIFACT_DIR = "/Users/jakub/.gemini/antigravity/brain/0ac948c9-53db-485f-828d-77fd5280274f";

async function main() {
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9222",
    "--disable-gpu",
    "--window-size=1440,1050",
    "http://localhost:5173",
  ]);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  const targets = await new Promise((resolve, reject) => {
    http.get("http://127.0.0.1:9222/json", (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve(JSON.parse(body)));
    }).on("error", reject);
  });

  const pageTarget = targets.find((t) => t.type === "page");
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let id = 1;
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const msgId = id++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === msgId) {
          ws.removeEventListener("message", handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener("message", handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

  ws.addEventListener("open", async () => {
    const sections = [
      { id: "benefits", file: "thesis_verified.png" },
      { id: "vault", file: "vault_verified.png" },
      { id: "roadmap", file: "roadmap_verified.png" },
      { id: "pricing", file: "pricing_verified.png" },
    ];

    for (const sec of sections) {
      const res = await send("Runtime.evaluate", {
        expression: `
          (() => {
            const el = document.getElementById('${sec.id}');
            if (el) {
              const y = el.getBoundingClientRect().top + window.pageYOffset;
              window.scrollTo(0, y);
              return { success: true, y };
            }
            return { success: false };
          })()
        `,
        returnByValue: true,
      });
      console.log(`Scroll to ${sec.id}:`, res.result?.value);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const { data } = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(`${ARTIFACT_DIR}/${sec.file}`, Buffer.from(data, "base64"));
      console.log(`Captured ${sec.file}`);
    }

    ws.close();
    chrome.kill();
    process.exit(0);
  });
}

main().catch(console.error);
