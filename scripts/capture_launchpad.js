import http from "node:http";
import fs from "node:fs";
import { spawn } from "node:child_process";

async function main() {
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9222",
    "--disable-gpu",
    "--window-size=1440,1050",
    "http://localhost:5173",
  ]);

  // Wait for Chrome to spin up
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Fetch debugging websocket targets
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
    // Scroll element into view
    await send("Runtime.evaluate", {
      expression: `
        const el = document.getElementById('upcoming-drops');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      `,
    });

    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Capture screenshot
    const { data } = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync("/tmp/launchpad_exact.png", Buffer.from(data, "base64"));
    console.log("Screenshot saved to /tmp/launchpad_exact.png");

    ws.close();
    chrome.kill();
    process.exit(0);
  });
}

main().catch(console.error);
