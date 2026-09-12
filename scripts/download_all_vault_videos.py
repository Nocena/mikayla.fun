import json, os, urllib.request, urllib.parse, re, time
from concurrent.futures import ThreadPoolExecutor, as_completed

os.makedirs("public/vault/videos", exist_ok=True)

with open("scripts/vault_video_ids.json") as f:
    videos = json.load(f)

print(f"Starting download of {len(videos)} video files...")

def download_one(v):
    file_id = v["id"]
    name = v["name"]
    out_path = f"public/vault/videos/{file_id}.mp4"

    if os.path.exists(out_path) and os.path.getsize(out_path) > 10000:
        print(f"[SKIP] {name} already exists ({os.path.getsize(out_path)} bytes)")
        return True, file_id, name, os.path.getsize(out_path)

    url = f"https://drive.google.com/uc?export=download&id={file_id}"
    cookie_processor = urllib.request.HTTPCookieProcessor()
    opener = urllib.request.build_opener(cookie_processor)
    opener.addheaders = [("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36")]

    try:
        req = opener.open(url, timeout=30)
        content_type = req.headers.get_content_type()
        if "video" in content_type or "octet-stream" in content_type:
            with open(out_path, "wb") as f:
                while True:
                    c = req.read(256 * 1024)
                    if not c: break
                    f.write(c)
            size = os.path.getsize(out_path)
            print(f"[DONE] {name} ({size} bytes)")
            return True, file_id, name, size

        html = req.read().decode("utf-8", errors="ignore")
        action_match = re.search(r"<form[^>]*action=[\"\x27]([^\x27\"]+)[\"\x27]", html)
        inputs = dict(re.findall(r"<input[^>]*name=[\"\x27]([^\x27\"]+)[\"\x27][^>]*value=[\"\x27]([^\x27\"]*)[\"\x27]", html))

        if action_match and "uuid" in inputs:
            query = urllib.parse.urlencode(inputs)
            download_url = f"{action_match.group(1)}?{query}"
        else:
            download_url = f"https://drive.usercontent.google.com/download?id={file_id}&export=download&confirm=t"

        req2 = opener.open(download_url, timeout=120)
        with open(out_path, "wb") as f:
            while True:
                c = req2.read(256 * 1024)
                if not c: break
                f.write(c)
        size = os.path.getsize(out_path)
        print(f"[CONFIRMED DONE] {name} ({size} bytes)")
        return True, file_id, name, size
    except Exception as e:
        print(f"[ERROR] {name} ({file_id}): {e}")
        if os.path.exists(out_path) and os.path.getsize(out_path) < 10000:
            try: os.remove(out_path)
            except: pass
        return False, file_id, name, 0

# Run with 4 threads
completed = 0
with ThreadPoolExecutor(max_workers=4) as executor:
    futures = [executor.submit(download_one, v) for v in videos]
    for future in as_completed(futures):
        success, fid, name, size = future.result()
        if success:
            completed += 1
            print(f"Progress: {completed}/{len(videos)}")

print("All downloads finished!")
