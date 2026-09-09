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
  if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
    console.error("No page target found");
    chrome.kill();
    return;
  }

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
    // 1. Hero
    await send("Runtime.evaluate", {
      expression: "window.scrollTo(0, 0);",
    });
    await new Promise((resolve) => setTimeout(resolve, 1200));
    let { data } = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${ARTIFACT_DIR}/hero_verified.png`, Buffer.from(data, "base64"));
    console.log("Captured hero_verified.png");

    // 2. Upcoming Drops
    await send("Runtime.evaluate", {
      expression: `
        const el = document.getElementById('upcoming-drops');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      `,
    });
    await new Promise((resolve) => setTimeout(resolve, 1200));
    ({ data } = await send("Page.captureScreenshot", { format: "png" }));
    fs.writeFileSync(`${ARTIFACT_DIR}/drops_verified.png`, Buffer.from(data, "base64"));
    console.log("Captured drops_verified.png");

    // 3. SCM Thesis / Benefits
    await send("Runtime.evaluate", {
      expression: `
        const el = document.getElementById('benefits');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      `,
    });
    await new Promise((resolve) => setTimeout(resolve, 1200));
    ({ data } = await send("Page.captureScreenshot", { format: "png" }));
    fs.writeFileSync(`${ARTIFACT_DIR}/thesis_verified.png`, Buffer.from(data, "base64"));
    console.log("Captured thesis_verified.png");

    // 4. Roadmap
    await send("Runtime.evaluate", {
      expression: `
        const el = document.getElementById('roadmap');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      `,
    });
    await new Promise((resolve) => setTimeout(resolve, 1200));
    ({ data } = await send("Page.captureScreenshot", { format: "png" }));
    fs.writeFileSync(`${ARTIFACT_DIR}/roadmap_verified.png`, Buffer.from(data, "base64"));
    console.log("Captured roadmap_verified.png");

    ws.close();
    chrome.kill();
    process.exit(0);
  });
}

main().catch(console.error);
