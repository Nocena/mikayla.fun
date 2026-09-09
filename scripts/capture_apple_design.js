import http from "node:http";
import fs from "node:fs";
import { spawn } from "node:child_process";

const ARTIFACT_DIR = "/Users/jakub/.gemini/antigravity/brain/0ac948c9-53db-485f-828d-77fd5280274f";

async function main() {
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9223",
    "--disable-gpu",
    "--user-data-dir=/tmp/chrome_test_profile_" + Date.now(),
    "--window-size=1440,1050",
    "http://localhost:5173",
  ]);

  // Wait for Chrome with retries
  let targets = null;
  for (let i = 0; i < 20; i++) {
    try {
      targets = await new Promise((resolve, reject) => {
        const req = http.get("http://127.0.0.1:9223/json", (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            try {
              resolve(JSON.parse(body));
            } catch (err) {
              reject(err);
            }
          });
        });
        req.on("error", reject);
      });
      if (targets && targets.length > 0) break;
    } catch (e) {
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  if (!targets) {
    chrome.kill();
    throw new Error("Could not connect to Chrome debugging port");
  }

  const pageTarget = targets.find((t) => t.type === "page") || targets[0];
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
    // 1. Top of page / Hero Scene 0
    await send("Runtime.evaluate", {
      expression: `
        (() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          window.dispatchEvent(new Event('scroll'));
          return true;
        })()
      `,
      returnByValue: true,
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const shot0 = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${ARTIFACT_DIR}/apple_design_hero.png`, Buffer.from(shot0.data, "base64"));
    console.log("Captured apple_design_hero.png");

    // 2. Upcoming Drops
    await send("Runtime.evaluate", {
      expression: `
        (() => {
          const el = document.getElementById('upcoming-drops');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
          window.dispatchEvent(new Event('scroll'));
          return true;
        })()
      `,
      returnByValue: true,
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const shot1 = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${ARTIFACT_DIR}/apple_design_drops.png`, Buffer.from(shot1.data, "base64"));
    console.log("Captured apple_design_drops.png");

    // 3. Content Vault
    await send("Runtime.evaluate", {
      expression: `
        (() => {
          const el = document.getElementById('content-vault');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
          window.dispatchEvent(new Event('scroll'));
          return true;
        })()
      `,
      returnByValue: true,
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const shot2 = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${ARTIFACT_DIR}/apple_design_vault.png`, Buffer.from(shot2.data, "base64"));
    console.log("Captured apple_design_vault.png");

    ws.close();
    chrome.kill();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
