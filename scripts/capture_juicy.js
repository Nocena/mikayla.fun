import http from "node:http";
import fs from "node:fs";
import { spawn } from "node:child_process";

const ARTIFACT_DIR = "/Users/jakub/.gemini/antigravity/brain/d81ec045-393a-47c8-ac7b-2b99182481ad";

async function main() {
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9231",
    "--disable-gpu",
    "--window-size=1440,1050",
    "http://localhost:5173/juicy",
  ]);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const targets = await new Promise((resolve, reject) => {
    http.get("http://127.0.0.1:9231/json", (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve(JSON.parse(body)));
    }).on("error", reject);
  });

  const pageTarget = targets.find((t) => t.type === "page" && t.url.includes("5173"));
  if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
    console.error("No valid page target found");
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
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Disable smooth scroll
    await send("Runtime.evaluate", {
      expression: `
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.scrollBehavior = 'auto';
      `,
    });

    const sections = [
      { id: "overview", name: "juicy_hero.png" },
      { id: "smelter", name: "juicy_smelter.png" },
      { id: "milestones", name: "juicy_milestones.png" },
      { id: "vault", name: "juicy_vault.png" },
      { id: "cap-table", name: "juicy_captable.png" },
    ];

    for (const sec of sections) {
      await send("Runtime.evaluate", {
        expression: `
          (() => {
            const el = document.getElementById("${sec.id}");
            if (el) {
              const top = el.getBoundingClientRect().top + window.scrollY;
              window.scrollTo(0, Math.max(0, top - 64));
            }
          })()
        `,
      });
      await new Promise((resolve) => setTimeout(resolve, 800));
      const { data } = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(`${ARTIFACT_DIR}/${sec.name}`, Buffer.from(data, "base64"));
      console.log(`Captured ${sec.name}`);

      if (sec.id === "overview") {
        fs.writeFileSync(`${ARTIFACT_DIR}/juicy_hero_frame1.png`, Buffer.from(data, "base64"));
        // Wait for the rectangle to spring to the next word
        await new Promise((resolve) => setTimeout(resolve, 1600));
        const { data: frame2 } = await send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(`${ARTIFACT_DIR}/juicy_hero_frame2.png`, Buffer.from(frame2, "base64"));
        console.log("Captured juicy_hero_frame2.png");
      }

      if (sec.id === "smelter") {
        await send("Runtime.evaluate", {
          expression: `window.scrollBy(0, 1080);`,
        });
        await new Promise((resolve) => setTimeout(resolve, 600));
        const { data: sCards } = await send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(`${ARTIFACT_DIR}/juicy_smelter_dossiers.png`, Buffer.from(sCards, "base64"));
        console.log("Captured juicy_smelter_dossiers.png");
      }
    }

    // Capture Mobile (iPhone 14)
    await send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await send("Runtime.evaluate", { expression: "window.scrollTo(0, 0);" });
    await new Promise((resolve) => setTimeout(resolve, 600));
    const { data: mobData } = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${ARTIFACT_DIR}/juicy_mobile.png`, Buffer.from(mobData, "base64"));
    console.log("Captured juicy_mobile.png");

    await send("Runtime.evaluate", {
      expression: `
        (() => {
          const el = document.getElementById("smelter");
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo(0, Math.max(0, top - 64));
          }
        })()
      `,
    });
    await new Promise((resolve) => setTimeout(resolve, 600));
    const { data: mobSmelter } = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${ARTIFACT_DIR}/juicy_mobile_smelter.png`, Buffer.from(mobSmelter, "base64"));
    console.log("Captured juicy_mobile_smelter.png");

    await send("Runtime.evaluate", {
      expression: `
        (() => {
          const el = document.getElementById("milestones");
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo(0, Math.max(0, top - 64));
          }
        })()
      `,
    });
    await new Promise((resolve) => setTimeout(resolve, 600));
    const { data: mobMilestones } = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`${ARTIFACT_DIR}/juicy_mobile_milestones.png`, Buffer.from(mobMilestones, "base64"));
    console.log("Captured juicy_mobile_milestones.png");

    ws.close();
    chrome.kill();
    process.exit(0);
  });
}

main().catch(console.error);
