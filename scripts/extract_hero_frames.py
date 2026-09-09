import cv2
import numpy as np
import os
import shutil

def process_frames():
    input_video = '/Users/jakub/Desktop/MPEG-4 movie.mp4'
    output_dir = '/Users/jakub/Projects/mikayla.fun/public/hero-frames'
    public_dir = '/Users/jakub/Projects/mikayla.fun/public'
    
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(public_dir, exist_ok=True)
    
    # Also copy the mp4 as fallback
    fallback_video = os.path.join(public_dir, 'hero.mp4')
    shutil.copyfile(input_video, fallback_video)
    print(f"Copied fallback video to {fallback_video}")
    
    cap = cv2.VideoCapture(input_video)
    raw_frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        raw_frames.append(frame)
    cap.release()
    
    print(f"Read {len(raw_frames)} source frames.")
    
    # 2x frame interpolation using linear blending between consecutive frames
    interpolated = []
    for i in range(len(raw_frames) - 1):
        interpolated.append(raw_frames[i])
        mid = cv2.addWeighted(raw_frames[i], 0.5, raw_frames[i+1], 0.5, 0)
        interpolated.append(mid)
    interpolated.append(raw_frames[-1])
    
    target_width = 1296
    target_height = 744
    total_bytes = 0
    
    print(f"Exporting {len(interpolated)} frames to {output_dir}...")
    for idx, frame in enumerate(interpolated):
        scaled = cv2.resize(frame, (target_width, target_height), interpolation=cv2.INTER_LANCZOS4)
        filename = f"frame_{idx:03d}.webp"
        filepath = os.path.join(output_dir, filename)
        cv2.imwrite(filepath, scaled, [cv2.IMWRITE_WEBP_QUALITY, 82])
        total_bytes += os.path.getsize(filepath)
        
    print(f"Successfully exported {len(interpolated)} frames.")
    print(f"Total frame directory size: {total_bytes / (1024 * 1024):.2f} MB")

if __name__ == '__main__':
    process_frames()
