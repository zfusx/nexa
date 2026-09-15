"""构建白名单式团队移交包；不包含凭据、原始竞品或内部技术资料。"""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT/'output/handoff'
OUT.mkdir(parents=True, exist_ok=True)
root_files = [
    'README.md', 'AGENTS.md', 'AI_DIRECTIVES.md', 'PROJECT_CONTEXT.md',
    'GOALS.md', 'CURRENT_TASKS.md', 'WORKLOG.md', 'DECISIONS.md', 'RESEARCH.md',
    'HANDOFF.md', 'API_CONTRACT.md', 'DEPLOYMENT.md', 'SECRETS_POLICY.md',
    'TOOLING_GUIDE.md', 'package.json', 'package-lock.json', 'astro.config.mjs',
    'tsconfig.json', '.gitignore', '.prettierignore', '.prettierrc.json',
    'output/pdf/Nexa公众白皮书_v0.1.pdf',
    'output/pdf/Nexa公众白皮书_v0.2.pdf',
]
paths = [ROOT/name for name in root_files]
brand_assets = {
    ROOT/'public/brand/nexa-mark.png',
    ROOT/'public/brand/nexa-start-hero.webp',
    ROOT/'public/brand/nexa-yearly-hero.webp',
}
for folder in ['src', 'public', 'tests', 'scripts', 'deploy', 'docs']:
    paths.extend(p for p in (ROOT/folder).rglob('*')
                 if p.is_file() and (p.suffix in {'.md','.astro','.tsx','.ts','.css','.svg','.mjs','.py','.caddy','.woff2'} or p == ROOT/'public/fonts/Inter-LICENSE.txt' or p in brand_assets)
                 and 'templates' not in p.parts and '__pycache__' not in p.parts)
paths = sorted(set(paths), key=lambda p:p.relative_to(ROOT).as_posix())
for path in paths:
    assert path.is_file() and not path.is_symlink(), f'交付文件无效：{path.name}'
    assert not {'white_paper','othersite','research_artifacts','node_modules','.git'}.intersection(path.relative_to(ROOT).parts)
manifest = {
    'version': 'v0.5',
    'date': '2026-09-14',
    'entry': 'docs/handoff/README.md',
    'scope': '设计与工程演示基线；真实账户、支付、核心计算尚未接入；白皮书 v0.2 专业版审阅稿',
    'files': [{'path':p.relative_to(ROOT).as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in paths],
}
manifest_bytes = (json.dumps(manifest,ensure_ascii=False,indent=2)+'\n').encode()
archive = OUT/'Nexa团队交付_v0.5.zip'
with ZipFile(archive, 'w', ZIP_DEFLATED) as bundle:
    for path in paths:
        bundle.write(path,path.relative_to(ROOT).as_posix())
    bundle.writestr('MANIFEST.json',manifest_bytes)
with ZipFile(archive) as bundle:
    assert bundle.testzip() is None, '压缩包校验失败'
    saved = json.loads(bundle.read('MANIFEST.json'))
    for record in saved['files']:
        assert hashlib.sha256(bundle.read(record['path'])).hexdigest()==record['sha256']
(OUT/'MANIFEST.json').write_bytes(manifest_bytes)
print(f'交付包通过：{len(paths)} 个文件 + 清单；{archive.stat().st_size} 字节；全部 SHA256 一致；内部目录未纳入。')
print(archive)
