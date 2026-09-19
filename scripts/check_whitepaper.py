"""在网站构建后验证公开稿、PDF 与网页一致性。依赖 pypdf。"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import unquote
import hashlib
import re
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.downloads = []
        self.in_article = False
        self.text = []
        self.h1 = 0
        self.h2 = 0

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'a':
            self.links.append(attrs.get('href', ''))
            if 'download' in attrs:
                self.downloads.append((attrs['download'], attrs['href']))
        if tag == 'article':
            self.in_article = True
        if tag == 'h1':
            self.h1 += 1
        if tag == 'h2' and self.in_article:
            self.h2 += 1

    def handle_endtag(self, tag):
        if tag == 'article':
            self.in_article = False

    def handle_data(self, text):
        if self.in_article:
            self.text.append(text)

def normalize(text):
    return re.sub(r'[\s•]+', '', text)

def public_block(block):
    block = re.sub(r'^(### |## |> |- )', '', block.strip(), flags=re.M)
    if block.startswith('```') and block.endswith('```'):
        block = '\n'.join(block.splitlines()[1:-1])
    return block

def content_blocks(source_text):
    blocks = []
    for block in source_text.split('## 01', 1)[1].split('\n\n'):
        if not block.strip():
            continue
        if block.startswith('- '):
            blocks.extend(public_block(line) for line in block.splitlines() if line.strip())
        else:
            blocks.append(public_block(block))
    return blocks

editions = {
    'Nexa公众白皮书_v0.1.pdf': (ROOT/'docs/whitepaper/Nexa公众白皮书_v0.1.md', ROOT/'output/pdf/Nexa公众白皮书_v0.1.pdf', 7, 15),
    'Nexa公众白皮书_v0.2.pdf': (ROOT/'docs/whitepaper/Nexa公众白皮书_v0.2.md', ROOT/'output/pdf/Nexa公众白皮书_v0.2.pdf', 9, 15),
}
edition_results = {}
for name, (source_path, pdf_path, min_pages, max_pages) in editions.items():
    source_text = source_path.read_text()
    reader = PdfReader(pdf_path)
    pdf_text = normalize(''.join(page.extract_text() for page in reader.pages))
    source_blocks = content_blocks(source_text)
    assert min_pages <= len(reader.pages) <= max_pages, f'{name} 页数不符'
    assert all(normalize(block) in pdf_text for block in source_blocks), f'{name} 缺少文稿内容'
    edition_results[name] = (source_text, pdf_path, len(reader.pages), len(source_blocks))

source, pdf, _, blocks_count = edition_results['Nexa公众白皮书_v0.2.pdf']
blocks = content_blocks(source)
page = Page()
page.feed((ROOT/'dist/whitepaper/index.html').read_text())
assert page.h1 == 1 and page.h2 == 7, '网页标题结构错误'
downloads = dict(page.downloads)
expected_downloads = {
    name: result[1] for name, result in edition_results.items()
}
assert set(downloads) == set(expected_downloads), '白皮书下载版本不完整'
for name, expected in expected_downloads.items():
    asset = ROOT/'dist'/unquote(downloads[name].lstrip('/'))
    assert asset.read_bytes() == expected.read_bytes(), f'{name} 下载文件不一致'
assert all(unquote(link[1:]) in page.ids for link in page.links if link.startswith('#')), '存在失效锚点'
assert all(normalize(block) in normalize(''.join(page.text)) for block in blocks), '网页缺少文稿内容'
private_patterns = r'/Users/fireparty|school_profile|parameter_version|simulationCount|sigmoidSteepness|rho_0|r_max|BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY|sk-[A-Za-z0-9]{24,}'
public_text = '\n'.join(result[0] for result in edition_results.values()) + '\n'.join(path.read_text() for path in (ROOT/'dist').rglob('*.html'))
assert not re.search(private_patterns, public_text), '公开输出出现敏感模式，需要人工检查'
assert all(p == ROOT/'dist/fonts/Inter-LICENSE.txt' for p in (ROOT/'dist').rglob('*.txt')), '构建含非预期文本资料'
summary = '；'.join(f'{name} {pages} 页/{block_count} 个正文块' for name, (_, _, pages, block_count) in edition_results.items())
print(f'通过：{summary}；v0.2 三端一致、七章目录、单一 H1、两版下载一致、基础敏感模式扫描。')
for name, (_, pdf_path, _, _) in edition_results.items():
    print(f'{name} 大小 {pdf_path.stat().st_size} 字节；SHA256 {hashlib.sha256(pdf_path.read_bytes()).hexdigest()}')
