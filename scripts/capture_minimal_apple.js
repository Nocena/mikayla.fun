import http from "node:http";
import fs from "node:fs";
import { spawn } from "node:child_process";

const ARTIFACT_DIR = "/Users/jakub/.gemini/antigravity/brain/c4086620-b73a-4e62-a367-9935a94eac5d";

async function run() {
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9224",
    "--disable-gpu",
    "--window-size=1440,1050",
    "http://localhost:5173",
  ]);

  let targets = null;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      targets = await new Promise((resolve, reject) => {
        http.get("http://127.0.0.1:9224/json", (res) => {
          let body = "";
          res.on("data", (c) => (body += c));
          res.on("end", () => resolve(JSON.parse(body)));
        }).on("error", reject);
      });
      if (targets && targets.length > 0) break;
    } catch (e) {}
  }

  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const msgId = id++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === msgId) {
          ws.removeEventListener("message", handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener("message", handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

  await new Promise((r) => (ws.onopen = r));
  await send("Page.enable");
  await send("Runtime.enable");
  await new Promise((r) => setTimeout(r, 2500));

  // 1. Capture Desktop Default View
  const s1 = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(`${ARTIFACT_DIR}/screenshot_apple_minimal_desktop.png`, Buffer.from(s1.data, "base64"));
  console.log("Captured screenshot_apple_minimal_desktop.png");

  // 2. Click AppleBurnBadge button to open popover
  await send("Runtime.evaluate", {
    expression: `
      const btn = document.querySelector('button[title*="burn ledger"]');
      if (btn) btn.click();
    `,
  });
  await new Promise((r) => setTimeout(r, 800));

  const s2 = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(`${ARTIFACT_DIR}/screenshot_apple_minimal_popover.png`, Buffer.from(s2.data, "base64"));
  console.log("Captured screenshot_apple_minimal_popover.png");

  // 3. Capture Mobile View
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  // Close popover on mobile
  await send("Runtime.evaluate", {
    expression: `
      const closeBtn = document.querySelector('button[aria-label="Close"]');
      if (closeBtn) closeBtn.click();
    `,
  });
  await new Promise((r) => setTimeout(r, 800));

  const s3 = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(`${ARTIFACT_DIR}/screenshot_apple_minimal_mobile.png`, Buffer.from(s3.data, "base64"));
  console.log("Captured screenshot_apple_minimal_mobile.png");

  chrome.kill();
  console.log("Done!");
}

run();
