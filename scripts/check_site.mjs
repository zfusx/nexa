import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, extname, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = resolve(root, "dist");
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(dir, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}
const routes = [
  "/",
  "/how-it-works",
  "/story",
  "/quiz",
  "/whitepaper",
  "/privacy",
  "/terms",
  "/design-system",
];
function routeFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  return resolve(
    dist,
    `.${decoded}`,
    ...(extname(decoded) ? [] : ["index.html"]),
  );
}
const pages = new Map(
  routes.map((route) => {
    const path = routeFile(route);
    assert.ok(existsSync(path), `缺少路由 ${route}`);
    return [path, readFileSync(path, "utf8")];
  }),
);
let checkedLinks = 0;
for (const [file, html] of pages) {
  assert.equal(
    (html.match(/<h1[\s>]/g) ?? []).length,
    1,
    `${file} 必须只有一个 h1`,
  );
  assert.match(html, /lang="zh-CN"/);
  assert.match(html, /name="description"/);
  const base = new URL(relative(dist, file), "https://main.zfis.net/");
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const link = new URL(match[1].replaceAll("&amp;", "&"), base);
    if (link.origin !== base.origin) continue;
    const target = routeFile(link.pathname);
    assert.ok(target.startsWith(dist + "/"), "链接越过构建根目录");
    assert.ok(existsSync(target), `失效链接 ${match[1]}`);
    if (link.hash && extname(target) === ".html") {
      const targetHtml = readFileSync(target, "utf8");
      assert.ok(
        targetHtml.includes(`id="${decodeURIComponent(link.hash.slice(1))}"`),
        `失效锚点 ${match[1]}`,
      );
    }
    checkedLinks++;
  }
}
for (const file of files(dist)) {
  const relativePath = relative(dist, file);
  const brandAssets = new Set([
    "brand/nexa-mark.png",
    "brand/nexa-active-star.svg",
    "brand/nexa-star.svg",
    "brand/nexa-start-hero.webp",
    "brand/nexa-yearly-hero.webp",
  ]);
  assert.ok(
    [".html", ".js", ".css", ".pdf", ".svg", ".woff2"].includes(
      extname(file),
    ) ||
      relativePath === "fonts/Inter-LICENSE.txt" ||
      brandAssets.has(relativePath),
    `非预期发布文件 ${file}`,
  );
  if ([".html", ".js", ".css"].includes(extname(file))) {
    const text = readFileSync(file, "utf8");
    assert.doesNotMatch(
      text,
      /dev\.asknexa\.me|\/Users\/fireparty|BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY|sk-[A-Za-z0-9]{24,}/,
    );
  }
}
const home = pages.get(routeFile("/"));
assert.match(home, /<noscript>/);
assert.match(pages.get(routeFile("/design-system")), /noindex,follow/);
let docLinks = 0;
for (const file of files(resolve(root, "docs"))) {
  if (extname(file) !== ".md") continue;
  for (const match of readFileSync(file, "utf8").matchAll(
    /\[[^\]]*\]\(([^)]+)\)/g,
  )) {
    const target = match[1].split("#")[0];
    if (!target || /^[a-z]+:/i.test(target) || target.startsWith("/")) continue;
    assert.ok(
      existsSync(resolve(dirname(file), decodeURIComponent(target))),
      `失效文档链接 ${file}: ${target}`,
    );
    docLinks++;
  }
}
console.log(
  `通过：${routes.length} 个页面、${checkedLinks} 个站内链接/资源、${docLinks} 个文档链接、基础发布边界检查。`,
);
