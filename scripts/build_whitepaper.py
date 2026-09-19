"""从公开 Markdown 生成两版审阅 PDF；绝不读取 white_paper/ 内部资料。

依赖 reportlab；可用 NEXA_BODY_FONT / NEXA_TITLE_FONT 指定中文 TTF/TTC。
运行：python3 scripts/build_whitepaper.py
"""
from pathlib import Path
from xml.sax.saxutils import escape
import hashlib
import os
import re
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak

ROOT = Path(__file__).resolve().parents[1]
EDITIONS = (
    (ROOT / 'docs/whitepaper/Nexa公众白皮书_v0.1.md', ROOT / 'output/pdf/Nexa公众白皮书_v0.1.pdf', 7, 15),
    (ROOT / 'docs/whitepaper/Nexa公众白皮书_v0.2.md', ROOT / 'output/pdf/Nexa公众白皮书_v0.2.pdf', 9, 15),
)
BODY_FONT = os.environ.get('NEXA_BODY_FONT', '/System/Library/Fonts/STHeiti Light.ttc')
TITLE_FONT = os.environ.get('NEXA_TITLE_FONT', '/System/Library/Fonts/Supplemental/Songti.ttc')
INK = colors.HexColor('#171326')
SOFT = colors.HexColor('#605b6c')
VIOLET = colors.HexColor('#725dff')
PAPER = colors.HexColor('#f7f4ed')
NIGHT = colors.HexColor('#0d0822')
WIDTH, HEIGHT = A4

pdfmetrics.registerFont(TTFont('NexaBody', BODY_FONT, subfontIndex=0))
pdfmetrics.registerFont(TTFont('NexaTitle', TITLE_FONT, subfontIndex=0))

base = dict(fontName='NexaBody', fontSize=11, leading=20, wordWrap='CJK', textColor=INK, spaceAfter=12)
styles = {
    'body': ParagraphStyle('Body', **base),
    'heading': ParagraphStyle('Heading', fontName='NexaTitle', fontSize=25, leading=35, wordWrap='CJK', textColor=INK, spaceBefore=12, spaceAfter=24, keepWithNext=True),
    'sub': ParagraphStyle('Sub', fontName='NexaBody', fontSize=12.5, leading=20, wordWrap='CJK', textColor=VIOLET, spaceBefore=10, spaceAfter=7, keepWithNext=True),
    'quote': ParagraphStyle('Quote', **{**base, 'fontName':'NexaTitle', 'fontSize':12, 'leading':21, 'backColor':colors.HexColor('#eee9fa'), 'borderPadding':12, 'spaceBefore':13, 'spaceAfter':8}),
    'bullet': ParagraphStyle('Bullet', **{**base, 'leftIndent':12, 'firstLineIndent':-12, 'spaceAfter':7}),
    'math': ParagraphStyle('Math', fontName='Courier', fontSize=8.6, leading=15, textColor=colors.HexColor('#f3efff'), backColor=colors.HexColor('#20163c'), borderPadding=12, spaceBefore=9, spaceAfter=13),
}

def draw_paragraph(canvas, text, x, top, width, style):
    p = Paragraph(escape(text), style)
    _, height = p.wrap(width, HEIGHT)
    p.drawOn(canvas, x, top-height)
    return top-height

def build_edition(source, output, min_pages, max_pages):
    raw = source.read_text()
    _, metadata, markdown = raw.split('---', 2)
    meta = dict(re.findall(r'^(\w+):\s*"([^"]*)"', metadata, re.M))
    cover, *chapters = re.split(r'^## ', markdown.strip(), flags=re.M)
    assert len(chapters) == 7, '白皮书必须包含七章'
    all_chars = set(markdown + ''.join(meta.values()))
    missing = sorted(c for c in all_chars if ord(c) > 127 and ord(c) not in pdfmetrics.getFont('NexaBody').face.charWidths)
    assert not missing, f'正文字体缺字：{missing}'
    strapline = next((line.strip() for line in cover.splitlines() if ' · ' in line), '传统知识 · 现代数学 · AI 解释')
    cover_note = cover.strip().split('\n\n')[-1]

    def cover_page(canvas, doc):
        canvas.saveState()
        canvas.setFillColor(NIGHT)
        canvas.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
        canvas.setStrokeColor(colors.HexColor('#36285e'))
        canvas.setLineWidth(0.7)
        for radius in (94, 153, 215, 281):
            canvas.circle(WIDTH-43, 178, radius, fill=0, stroke=1)
        canvas.setFillColor(colors.HexColor('#ff8a4c'))
        canvas.circle(WIDTH-43-153, 178, 5, fill=1, stroke=0)
        canvas.setFont('NexaBody', 26)
        canvas.setFillColor(PAPER)
        canvas.drawString(54, HEIGHT-82, 'Nexa')
        canvas.setFont('NexaBody', 10)
        canvas.setFillColor(colors.HexColor('#b9aceb'))
        canvas.drawString(54, HEIGHT-111, '公众方法白皮书 / 2026')
        big = ParagraphStyle('CoverTitle', fontName='NexaTitle', fontSize=35, leading=49, wordWrap='CJK', textColor=PAPER)
        title_parts = meta['title'].split('，', 1)
        draw_paragraph(canvas, title_parts[0]+'，', 54, HEIGHT-195, 480, big)
        draw_paragraph(canvas, title_parts[1]+'。', 54, HEIGHT-249, 480, big)
        canvas.setFont('NexaBody', 12)
        canvas.setFillColor(colors.HexColor('#b9aceb'))
        canvas.drawString(56, HEIGHT-340, strapline)
        canvas.setStrokeColor(VIOLET)
        canvas.line(56, 423, 111, 423)
        lead = ParagraphStyle('CoverLead', fontName='NexaTitle', fontSize=17, leading=29, wordWrap='CJK', textColor=PAPER)
        draw_paragraph(canvas, '公开数学对象与验证逻辑，保护参数与核心规则；让方法可以被理解，也让证据边界保持清楚。', 56, 392, 400, lead)
        note = ParagraphStyle('CoverNote', fontName='NexaBody', fontSize=9.5, leading=17, wordWrap='CJK', textColor=colors.HexColor('#c9c2d9'))
        draw_paragraph(canvas, cover_note, 56, 232, 455, note)
        canvas.setFont('NexaBody', 9)
        canvas.drawString(56, 69, f'{meta["version"]} · {meta["status"]} · {meta["date"]}')
        canvas.restoreState()

    def body_page(canvas, doc):
        canvas.saveState()
        canvas.setFillColor(PAPER)
        canvas.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
        canvas.setFont('NexaBody', 9)
        canvas.setFillColor(SOFT)
        canvas.drawString(54, HEIGHT-44, 'Nexa / 公众方法白皮书')
        canvas.drawRightString(WIDTH-54, HEIGHT-44, f'{meta["version"]} · {meta["status"]}')
        canvas.setStrokeColor(colors.HexColor('#dcd6e3'))
        canvas.line(54, HEIGHT-58, WIDTH-54, HEIGHT-58)
        canvas.line(54, 54, WIDTH-54, 54)
        canvas.setFont('NexaBody', 8)
        canvas.drawString(54, 36, strapline)
        canvas.drawRightString(WIDTH-54, 36, f'{doc.page:02d}')
        canvas.restoreState()

    story = [Spacer(1, 1), PageBreak()]
    for index, chapter in enumerate(chapters):
        title, text = chapter.split('\n', 1)
        story.append(Paragraph(escape(title.strip()), styles['heading']))
        for block in text.strip().split('\n\n'):
            block = block.strip()
            if block.startswith('### '):
                story.append(Paragraph(escape(block[4:]), styles['sub']))
            elif block.startswith('> '):
                story.append(Paragraph(escape(block[2:]), styles['quote']))
            elif block.startswith('- '):
                for line in block.splitlines():
                    story.append(Paragraph('• '+escape(line[2:]), styles['bullet']))
            elif block.startswith('```') and block.endswith('```'):
                lines = block.splitlines()[1:-1]
                story.append(Paragraph('<br/>'.join(escape(line) for line in lines), styles['math']))
            else:
                story.append(Paragraph(escape(block), styles['body']))
        if index < len(chapters)-1:
            story.append(Spacer(1, 24))

    output.parent.mkdir(parents=True, exist_ok=True)
    pdf_title = re.search(r'^# (.+)$', cover, re.M).group(1)
    doc = SimpleDocTemplate(str(output), pagesize=A4, leftMargin=54, rightMargin=54, topMargin=84, bottomMargin=76, title=f'{pdf_title} {meta["version"]}', author='Nexa', subject=f'{strapline} · {meta["status"]}')
    doc.build(story, onFirstPage=cover_page, onLaterPages=body_page)
    assert min_pages <= doc.page <= max_pages, f'{meta["version"]} 排版页数异常，预期 {min_pages}-{max_pages} 页，实际 {doc.page} 页'
    print(f'已生成 {output}；{doc.page} 页；正文 SHA256 {hashlib.sha256(raw.encode()).hexdigest()}')


for edition in EDITIONS:
    build_edition(*edition)
