#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成两个可选资源（改完名字后想重新生成时再运行，平时用不到）：

  1. assets/img/og.png      —— 社交分享卡片（1200×630）
  2. assets/resume.pdf      —— 占位简历，请替换成你自己的 PDF

用法（在项目根目录）：
    python tools/make-assets.py

只依赖 Pillow（`pip install pillow`）。字体优先使用 Windows 自带字体，
找不到时自动回退到 Pillow 内置字体，仍然可以正常出图。
"""

from __future__ import annotations

import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "assets" / "img"
ASSETS = ROOT / "assets"

# ---- 想改内容就改这里 -------------------------------------------------------
NAME = "tyee33"
ROLE = "全栈开发 / AI 应用"
TAGLINE = "把复杂的产品想法，做成简洁、可靠、上线即用的东西。"
URL_TEXT = "tyee.is-a.dev"
# -----------------------------------------------------------------------------

FONT_CANDIDATES = {
    "sans_bold": [
        r"C:\Windows\Fonts\seguisb.ttf",
        r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arialbd.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ],
    "sans": [
        r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arial.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ],
    "mono": [
        r"C:\Windows\Fonts\consola.ttf",
        r"C:\Windows\Fonts\arial.ttf",
        "/System/Library/Fonts/Menlo.ttc",
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    ],
    "cjk": [
        r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\msyhbd.ttc",
        "/System/Library/Fonts/PingFang.ttc",
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    ],
}


def load_fonts():
    from PIL import ImageFont

    resolved = {}
    for role, candidates in FONT_CANDIDATES.items():
        font_path = next((p for p in candidates if pathlib.Path(p).exists()), None)
        resolved[role] = font_path
    fallback = ImageFont.load_default

    def font(role, size):
        path = resolved.get(role) or resolved.get("sans")
        if path:
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
        return fallback()

    return font


def make_og_image():
    """1200×630 的分享卡片：纯黑底 + 网格 + 光晕 + 玻璃描边卡片。"""
    from PIL import Image, ImageDraw, ImageFilter

    W, H = 1200, 630
    font = load_fonts()

    img = Image.new("RGB", (W, H), "#050506")
    draw = ImageDraw.Draw(img, "RGBA")

    # 网格
    for x in range(0, W + 1, 64):
        draw.line([(x, 0), (x, H)], fill=(255, 255, 255, 14), width=1)
    for y in range(0, H + 1, 64):
        draw.line([(0, y), (W, y)], fill=(255, 255, 255, 14), width=1)

    # 左上角光晕（径向渐变叠上去）
    glow = Image.new("L", (W, H), 0)
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([-260, -420, 760, 460], fill=70)
    glow = glow.filter(ImageFilter.GaussianBlur(150))
    tint = Image.new("RGB", (W, H), (150, 175, 255))
    img = Image.composite(Image.blend(img, tint, 0.16), img, glow)
    draw = ImageDraw.Draw(img, "RGBA")

    # 玻璃卡片
    card = [72, 96, W - 72, H - 96]
    r = 34
    draw.rounded_rectangle(card, radius=r, fill=(255, 255, 255, 12),
                           outline=(255, 255, 255, 40), width=1)
    draw.rounded_rectangle([card[0], card[1], card[2], card[1] + 1], radius=0,
                           fill=(255, 255, 255, 46))

    pad_x = card[0] + 56
    draw.text((pad_x, card[1] + 52), "// PORTFOLIO", font=font("mono", 24),
              fill=(255, 255, 255, 130))
    draw.text((card[2] - 56 - draw.textlength(URL_TEXT, font=font("mono", 26)),
               card[1] + 50), URL_TEXT, font=font("mono", 26), fill=(255, 255, 255, 120))

    draw.text((pad_x, card[1] + 104), NAME, font=font("sans_bold", 108), fill=(245, 245, 248))
    draw.text((pad_x, card[1] + 236), ROLE, font=font("cjk", 40), fill=(255, 255, 255, 210))

    # 细线分隔
    draw.line([(pad_x, card[3] - 132), (card[2] - 56, card[3] - 132)],
              fill=(255, 255, 255, 34), width=1)

    # 一句话介绍（按宽度自动折行，中英文混排按字符切分）
    body_font = font("cjk", 28)
    max_w = card[2] - 56 - pad_x
    line, lines = "", []
    for ch in TAGLINE:
        probe = line + ch
        if draw.textlength(probe, font=body_font) > max_w and line:
            lines.append(line)
            line = ch
        else:
            line = probe
    if line:
        lines.append(line)

    y = card[3] - 106
    for text in lines[:2]:
        draw.text((pad_x, y), text, font=body_font, fill=(255, 255, 255, 165))
        y += 40

    IMG_DIR.mkdir(parents=True, exist_ok=True)
    out = IMG_DIR / "og.png"
    img.save(out, "PNG", optimize=True)
    print("wrote", out.relative_to(ROOT), f"({out.stat().st_size // 1024} KB)")


def make_placeholder_resume():
    """生成一份合法的单页 PDF 占位简历（纯 ASCII，标准字体，无需外挂字体）。"""
    lines = [
        ("F1", 26, 760, "PLACEHOLDER RESUME"),
        ("F2", 12, 730, "Replace this file with your own PDF: assets/resume.pdf"),
        ("F2", 12, 700, "Name:      " + NAME),
        ("F2", 12, 682, "Role:      Full-stack Developer / AI Applications"),
        ("F2", 12, 664, "Site:      https://" + URL_TEXT + "/"),
        ("F2", 12, 646, "Email:     tyee33@example.com"),
        ("F2", 11, 590, "How to replace:"),
        ("F2", 11, 572, "1. Export your resume as PDF."),
        ("F2", 11, 554, "2. Save it as assets/resume.pdf, overwriting this file."),
        ("F2", 11, 536, "3. Commit and push -- the download button keeps working, no code change needed."),
        ("F2", 11, 480, "This placeholder exists only so the download link never 404s."),
    ]

    def esc(text):
        return text.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")

    stream = []
    for fname, size, y, text in lines:
        stream.append("BT /%s %d Tf 72 %d Td (%s) Tj ET" % (fname, size, y, esc(text)))
    content = "\n".join(stream).encode("latin-1")

    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] "
        b"/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
        b"<< /Length " + str(len(content)).encode() + b" >>\nstream\n" + content + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]

    out = bytearray(b"%PDF-1.4\n")
    offsets = []
    for i, body in enumerate(objects, start=1):
        offsets.append(len(out))
        out += str(i).encode() + b" 0 obj\n" + body + b"\nendobj\n"

    xref_at = len(out)
    out += b"xref\n0 " + str(len(objects) + 1).encode() + b"\n"
    out += b"0000000000 65535 f \n"
    for off in offsets:
        out += ("%010d 00000 n \n" % off).encode()
    out += (b"trailer\n<< /Size " + str(len(objects) + 1).encode() + b" /Root 1 0 R >>\n"
            b"startxref\n" + str(xref_at).encode() + b"\n%%EOF\n")

    ASSETS.mkdir(parents=True, exist_ok=True)
    path = ASSETS / "resume.pdf"
    path.write_bytes(bytes(out))
    print("wrote", path.relative_to(ROOT), f"({path.stat().st_size} bytes)")


def main():
    try:
        import PIL  # noqa: F401
    except ImportError:
        print("需要 Pillow：pip install pillow", file=sys.stderr)
        return 1
    make_og_image()
    make_placeholder_resume()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
