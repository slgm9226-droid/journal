// 수어센터 업무일지 오프라인 지원: 앱 화면을 휴대폰에 보관해 인터넷 없이도 열리게 합니다.
// 기록은 구글 시트로 직접 보내며 여기에서 보관하지 않습니다.
const CACHE = "ksl-journal-v3-4";
const SHELL = ["./", "./config.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
const scopeUrl = path => new URL(path, self.registration.scope).href;
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL.map(scopeUrl))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin || !url.href.startsWith(self.registration.scope)) return;
  const isPage = req.mode === "navigate" || url.href === scopeUrl("./") || url.href === scopeUrl("./index.html");
  const key = isPage ? scopeUrl("./") : url.origin + url.pathname;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(key);
    // 인터넷이 되면 새 화면을 받아 보관하고, 3초 안에 응답이 없으면 보관한 화면을 엽니다.
    const network = fetch(req, {cache: "no-store"}).then(res => { if (res.ok) cache.put(key, res.clone()); return res; });
    if (!cached) return network;
    const timeout = new Promise(resolve => setTimeout(() => resolve(cached), 3000));
    return Promise.race([network.catch(() => cached), timeout]);
  })());
});
