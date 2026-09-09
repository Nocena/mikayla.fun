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
    // Wait for hero element
    await send("Runtime.evaluate", {
      expression: `
        new Promise((resolve) => {
          const check = () => {
            const hero = document.getElementById('hero');
            if (hero && hero.offsetHeight > 0) return resolve(true);
            setTimeout(check, 100);
          };
          check();
        })
      `,
      awaitPromise: true,
    });

    // Scroll to scene 1 (targetProgress 0.28 of hero height)
    const res = await send("Runtime.evaluate", {
      expression: `
        (() => {
          const hero = document.getElementById('hero');
          if (hero) {
            const totalDistance = hero.offsetHeight - window.innerHeight;
            const targetScroll = hero.offsetTop + 0.28 * totalDistance;
            document.documentElement.scrollTop = targetScroll;
            document.body.scrollTop = targetScroll;
            window.scrollTo({ top: targetScroll, left: 0, behavior: 'instant' });
            window.dispatchEvent(new Event('scroll'));
            return { success: true, targetScroll, scrollY: window.scrollY, docScroll: document.documentElement.scrollTop };
          }
          return { success: false };
        })()
      `,
      returnByValue: true,
    });
    console.log("Evaluate result:", res.result?.value);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const { data } = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${ARTIFACT_DIR}/scene1_verified.png`, Buffer.from(data, "base64"));
    console.log("Captured scene1_verified.png");

    ws.close();
    chrome.kill();
    process.exit(0);
  });
}

main().catch(console.error);
