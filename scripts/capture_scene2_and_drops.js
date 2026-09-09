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

    // 1. Scroll to Scene 2 (progress 0.48 - Top 0.1% OnlyFans drops)
    await send("Runtime.evaluate", {
      expression: `
        (() => {
          const hero = document.getElementById('hero');
          if (hero) {
            const totalDistance = hero.offsetHeight - window.innerHeight;
            const targetScroll = hero.offsetTop + 0.48 * totalDistance;
            window.scrollTo({ top: targetScroll, left: 0, behavior: 'instant' });
            window.dispatchEvent(new Event('scroll'));
            return true;
          }
          return false;
        })()
      `,
      returnByValue: true,
    });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const shot1 = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${ARTIFACT_DIR}/scene2_of_verified.png`, Buffer.from(shot1.data, "base64"));
    console.log("Captured scene2_of_verified.png");

    // 2. Scroll to Upcoming Drops section
    await send("Runtime.evaluate", {
      expression: `
        (() => {
          const drops = document.getElementById('upcoming-drops');
          if (drops) {
            drops.scrollIntoView({ behavior: 'instant', block: 'start' });
            window.dispatchEvent(new Event('scroll'));
            return true;
          }
          return false;
        })()
      `,
      returnByValue: true,
    });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const shot2 = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${ARTIFACT_DIR}/upcoming_drops_of_verified.png`, Buffer.from(shot2.data, "base64"));
    console.log("Captured upcoming_drops_of_verified.png");

    ws.close();
    chrome.kill();
    process.exit(0);
  });
}

main().catch(console.error);
