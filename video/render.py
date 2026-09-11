"""SwitchClaude explainer renderer — Pillow frames + ffmpeg. 1280x720@30, VO-synced."""
import os, subprocess, math
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1280, 720, 30
BG = (10, 10, 20)
NAVY = (6, 27, 49)
PANEL = (42, 46, 69)
PURPLE = (83, 58, 253)
GREEN = (21, 190, 83)
RED = (229, 72, 77)
WHITE = (255, 255, 255)
DIM = (138, 143, 163)

def font(sz, bold=False):
    for p in ["/System/Library/Fonts/Menlo.ttc",
              "/System/Library/Fonts/Supplemental/Menlo-Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Menlo-Regular.ttf"]:
        try:
            return ImageFont.truetype(p, sz)
        except Exception:
            continue
    return ImageFont.load_default()

def ease(t):
    t = max(0.0, min(1.0, t))
    return 1 - pow(1 - t, 3)

def fade_in(n, start, dur):
    return ease((n - start) / dur) if n >= start else 0.0

def slide_x(n, start, dur, dist=60):
    return dist * (1 - ease((n - start) / dur)) if n >= start else dist

def draw_text_center(d, cx, y, s, fnt, fill, alpha=255):
    f = fnt
    bb = d.textbbox((0, 0), s, font=f)
    w = bb[2] - bb[0]
    col = fill + (int(alpha),) if len(fill) == 3 else fill
    d.text((cx - w / 2, y), s, font=f, fill=col)

def rrect(d, xy, r, fill, alpha=255):
    c = fill + (int(alpha),) if len(fill) == 3 else fill
    d.rounded_rectangle(xy, radius=r, fill=c)

def typewriter(full, n, start, cps=24):
    k = int((n - start) * cps / FPS)
    return full[:max(0, k)] if n >= start else ""

# ---------------- scenes (each returns list of frames = base Image) ----------------
def scene1(frames):
    F1, F2, F3 = font(64, True), font(34), font(30)
    for n in range(frames):
        im = Image.new("RGB", (W, H), BG)
        d = ImageDraw.Draw(im, "RGBA")
        a = fade_in(n, 0, 15)
        draw_text_center(d, W/2, 150, typewriter("2 Claude accounts. 1 app.", n, 0), F1, WHITE, 255*a)
        lines = ["log out …", "log in …", "lose your flow …"]
        for i, s in enumerate(lines):
            st = 30 + i*14
            a2 = fade_in(n, st, 12)
            xoff = slide_x(n, st, 12)
            draw_text_center(d, W/2 + xoff, 300 + i*60, s, F2, RED, 255*a2)
        a3 = fade_in(n, 80, 15)
        draw_text_center(d, W/2, 520, "Sound familiar?", F3, DIM, 255*a3)
        yield im

def mock_window(d, cx, cy, alpha=255, highlight=False):
    x0, y0, x1, y1 = cx-260, cy-150, cx+260, cy+150
    rrect(d, [x0, y0, x1, y1], 18, PANEL, alpha)
    d.text((x0+30, y0+18), "Claude Switcher", font=font(24), fill=WHITE+(alpha,))
    rrect(d, [x1-130, y0+16, x1-24, y0+52], 10, GREEN, int(alpha*0.25))
    d.text((x1-112, y0+22), "Active", font=font(16), fill=GREEN+(alpha,))
    # row 1 (active, navy)
    rrect(d, [x0+30, y0+80, x1-30, y0+140], 10, NAVY, alpha)
    d.text((x0+48, y0+98), "● you@company.com", font=font(20), fill=WHITE+(alpha,))
    # row 2
    rrect(d, [x0+30, y0+155, x1-30, y0+215], 10, (30, 33, 52), alpha)
    d.text((x0+48, y0+173), "personal@gmail.com", font=font(20), fill=WHITE+(alpha,))
    bx0, by0, bx1, by1 = x1-160, y0+163, x1-44, y0+207
    rrect(d, [bx0, by0, bx1, by1], 8, PURPLE if not highlight else GREEN, alpha)
    d.text((bx0+14, by0+10), "Switch →", font=font(17), fill=WHITE+(alpha,))
    return (bx0+bx1)/2, (by0+by1)/2

def scene2(frames):
    F1, F2 = font(30, True), font(40, True)
    for n in range(frames):
        im = Image.new("RGB", (W, H), BG)
        d = ImageDraw.Draw(im, "RGBA")
        a = fade_in(n, 0, 12)
        rrect(d, [W/2-110, 40, W/2+110, 92], 14, PANEL, 255*a)
        draw_text_center(d, W/2, 52, "Claude ⇄", font(28), WHITE, 255*a)
        a2 = fade_in(n, 18, 15)
        if a2 > 0:
            # scale-in effect via alpha + slight y
            yo = int(20*(1-ease(n/33 if n < 33 else 1)))
            bx, by = mock_window(d, W/2, 360+yo, int(255*a2), highlight=n > 90)
            # cursor
            if n > 55:
                t = min(1.0, (n-55)/25)
                cx = W/2 - 200 + (bx - (W/2-200))*ease(t)
                cy = 500 - (500-by)*ease(t)
                d.ellipse([cx-9, cy-9, cx+9, cy+9], fill=PURPLE+(255,))
            if n > 90:
                a3 = fade_in(n, 90, 10)
                d.ellipse([bx-26, by-26, bx+26, by+26], outline=GREEN+(int(200*a3),), width=4)
        a4 = fade_in(n, 105, 15)
        draw_text_center(d, W/2, 600, "…2 seconds…", F2, GREEN, 255*a4)
        yield im

def scene3(frames):
    F1, F2 = font(32), font(30, True)
    steps = ["+  Add Account", "Log in once", "Saved forever — isolated profile"]
    for n in range(frames):
        im = Image.new("RGB", (W, H), BG)
        d = ImageDraw.Draw(im, "RGBA")
        for i, s in enumerate(steps):
            st = 8 + i*22
            a = fade_in(n, st, 12)
            xoff = slide_x(n, st, 12, 80)
            y = 200 + i*80
            rrect(d, [300+xoff, y-8, 344+xoff, y+36], 22, GREEN, 255*a)
            d.text((312+xoff, y), "✓", font=font(28, True), fill=(BG+(255,)))
            d.text((370+xoff, y), s, font=F1, fill=WHITE+(int(255*a),))
        a2 = fade_in(n, 85, 15)
        draw_text_center(d, W/2, 500, "Chats can never mix — or get lost.", F2, GREEN, 255*a2)
        yield im

def scene4(frames):
    F1, F2, F3 = font(30), font(38, True), font(26)
    for n in range(frames):
        im = Image.new("RGB", (W, H), BG)
        d = ImageDraw.Draw(im, "RGBA")
        a = fade_in(n, 0, 15)
        key = "CLAUDE-SWITCHER-XXXX-XXXX"
        bb = d.textbbox((0, 0), key, font=F1)
        kw = bb[2]-bb[0]
        rrect(d, [W/2-kw/2-30, 190, W/2+kw/2+30, 260], 14, PANEL, 255*a)
        draw_text_center(d, W/2, 205, key, F1, WHITE, 255*a)
        a2 = fade_in(n, 30, 15)
        draw_text_center(d, W/2, 320, "$9.99  once — no subscription", F2, GREEN, 255*a2)
        a3 = fade_in(n, 60, 15)
        draw_text_center(d, W/2, 420, "Mac  •  Windows  •  Linux", F3, WHITE, 255*a3)
        a4 = fade_in(n, 72, 15)
        draw_text_center(d, W/2, 470, "offline ✓     yours forever ✓", F3, DIM, 255*a4)
        yield im

def scene5(frames):
    F1, F2, F3 = font(34), font(64, True), font(38, True)
    for n in range(frames):
        im = Image.new("RGB", (W, H), BG)
        d = ImageDraw.Draw(im, "RGBA")
        a = fade_in(n, 0, 15)
        draw_text_center(d, W/2, 170, "Stop logging in and out.", F1, DIM, 255*a)
        a2 = fade_in(n, 25, 15)
        draw_text_center(d, W/2, 260, "SwitchClaude", F2, WHITE, 255*a2)
        a3 = fade_in(n, 50, 15)
        url = "switchclaude.com"
        bb = d.textbbox((0, 0), url, font=F3)
        kw = bb[2]-bb[0]
        if a3 > 0:
            d.rounded_rectangle([W/2-kw/2-28, 400, W/2+kw/2+28, 472], radius=14, outline=PURPLE+(int(255*a3),), width=3)
        draw_text_center(d, W/2, 415, url, F3, PURPLE, 255*a3)
        yield im

SCENES = [("s1", scene1), ("s2", scene2), ("s3", scene3), ("s4", scene4), ("s5", scene5)]

def dur(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "default=noprint_wrappers=1:nokey=1", path],
                       capture_output=True, text=True)
    return float(r.stdout.strip())

if __name__ == "__main__":
    os.makedirs("parts", exist_ok=True)
    files = []
    for i, (name, fn) in enumerate(SCENES, 1):
        vo = f"vo{i}.mp3"
        target = dur(vo) + 0.9  # breath after narration
        nframes = int(target * FPS)
        vpath = f"parts/{name}.mp4"
        apath = f"parts/{name}a.mp4"
        print(f"{name}: {nframes} frames ({target:.1f}s)", flush=True)
        # pipe raw frames to ffmpeg
        cmd = ["ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
               "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-pix_fmt", "yuv420p",
               "-crf", "20", "-preset", "medium", vpath]
        p = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for im in fn(nframes):
            p.stdin.write(im.tobytes())
        p.stdin.close()
        p.wait()
        # mux narration
        subprocess.run(["ffmpeg", "-y", "-i", vpath, "-i", vo, "-c:v", "copy", "-c:a", "aac",
                        "-shortest", apath], capture_output=True)
        files.append(apath)
    with open("parts/concat.txt", "w") as f:
        for fp in files:
            f.write(f"file '{os.path.abspath(fp)}'\n")
    subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", "parts/concat.txt",
                    "-c", "copy", "switchclaude-explainer.mp4"], capture_output=True)
    print("DONE switchclaude-explainer.mp4")
