/**
 * Service Worker for VM Website
 * 提供离线缓存、后台同步、推送通知等功能
 */

const CACHE_NAME = 'vm-cache-v2.0';
const DYNAMIC_CACHE = 'vm-dynamic-v2.0';

// 需要缓存的核心资源
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/think-tank.html',
    '/css/style.css',
    '/css/think-tank.css',
    '/js/performance.js',
    '/js/resource-bundler.js',
    '/js/auth.js',
    '/js/reports-manager.js',
    '/js/think-tank.js',
    '/js/main.js',
    '/wxcode.jpg',
    // 外部CDN资源
    'https://cdn.tailwindcss.com/tailwindcss.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// 需要缓存的字体资源
const FONT_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap'
];

// 报告文件缓存策略
const REPORT_PATTERNS = [
    /\/industry-reports\/.*\.html$/,
    /\/行业投研报告\/.*\.html$/
];

// 安装事件 - 预缓存核心资源
self.addEventListener('install', event => {
    console.log('SW: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('SW: Caching core assets');
                return cache.addAll(CORE_ASSETS);
            })
            .then(() => {
                console.log('SW: Core assets cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('SW: Failed to cache core assets:', error);
            })
    );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
    console.log('SW: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
                            console.log('SW: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('SW: Old caches cleaned up');
                return self.clients.claim();
            })
    );
});

// 获取事件 - 缓存策略
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    // 只处理GET请求
    if (request.method !== 'GET') {
        return;
    }

    // 跳过Chrome扩展和其他协议
    if (!request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        handleRequest(request, url)
    );
});

/**
 * 处理请求的主要逻辑
 */
async function handleRequest(request, url) {
    try {
        // 策略1: 核心资源 - 缓存优先
        if (isCoreAsset(request.url)) {
            return await cacheFirst(request);
        }

        // 策略2: 字体资源 - 缓存优先，长期缓存
        if (isFontAsset(request.url)) {
            return await cacheFirst(request, 86400000); // 24小时
        }

        // 策略3: 报告文件 - 网络优先，降级到缓存
        if (isReportFile(request.url)) {
            return await networkFirstWithCache(request);
        }

        // 策略4: API请求 - 网络优先
        if (isApiRequest(request.url)) {
            return await networkFirst(request);
        }

        // 策略5: 图片资源 - 缓存优先
        if (isImageRequest(request)) {
            return await cacheFirstForImages(request);
        }

        // 策略6: 其他资源 - 网络优先，降级到缓存
        return await networkFirstWithCache(request);

    } catch (error) {
        console.error('SW: Error handling request:', error);
        return await handleOfflineFallback(request);
    }
}

/**
 * 缓存优先策略
 */
async function cacheFirst(request, maxAge = 3600000) { // 默认1小时
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        // 检查缓存是否过期
        const cachedDate = new Date(cachedResponse.headers.get('date'));
        const now = new Date();
        
        if (now.getTime() - cachedDate.getTime() < maxAge) {
            return cachedResponse;
        }
    }

    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

/**
 * 网络优先策略（带缓存降级）
 */
async function networkFirstWithCache(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

/**
 * 网络优先策略（不缓存）
 */
async function networkFirst(request) {
    try {
        return await fetch(request);
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Network unavailable' }),
            {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

/**
 * 图片缓存优先策略
 */
async function cacheFirstForImages(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // 返回占位图片
        return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="#f0f0f0"/><text x="150" y="100" text-anchor="middle" dy=".3em" fill="#999">图片加载失败</text></svg>',
            {
                headers: { 'Content-Type': 'image/svg+xml' }
            }
        );
    }
}

/**
 * 离线降级处理
 */
async function handleOfflineFallback(request) {
    const url = new URL(request.url);
    
    // 如果是HTML页面，返回离线页面
    if (request.destination === 'document') {
        const cache = await caches.open(CACHE_NAME);
        const offlinePage = await cache.match('/index.html');
        return offlinePage || new Response('页面离线不可用', {
            status: 503,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    }
    
    // 其他资源返回简单错误响应
    return new Response('资源不可用', {
        status: 503,
        statusText: 'Service Unavailable'
    });
}

// 判断是否为核心资源
function isCoreAsset(url) {
    return CORE_ASSETS.some(asset => {
        if (asset.startsWith('http')) {
            return url === asset;
        }
        return url.endsWith(asset) || url.includes(asset);
    });
}

// 判断是否为字体资源
function isFontAsset(url) {
    return FONT_ASSETS.some(asset => url.includes(asset)) ||
           url.includes('fonts.googleapis.com') ||
           url.includes('fonts.gstatic.com');
}

// 判断是否为报告文件
function isReportFile(url) {
    return REPORT_PATTERNS.some(pattern => pattern.test(url));
}

// 判断是否为API请求
function isApiRequest(url) {
    return url.includes('/api/') || 
           url.includes('analytics') ||
           url.includes('gtag');
}

// 判断是否为图片请求
function isImageRequest(request) {
    return request.destination === 'image' ||
           /\.(jpg|jpeg|png|gif|svg|webp|ico)$/i.test(request.url);
}

// 后台同步事件
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

/**
 * 后台同步逻辑
 */
async function doBackgroundSync() {
    try {
        // 这里可以实现数据同步逻辑
        console.log('SW: Background sync triggered');
        
        // 例如：同步离线时收集的数据
        // await syncOfflineData();
        
    } catch (error) {
        console.error('SW: Background sync failed:', error);
    }
}

// 推送事件
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body || '您有新的行业报告可查看',
            icon: '/wxcode.jpg',
            badge: '/wxcode.jpg',
            data: data.url || '/',
            actions: [
                {
                    action: 'view',
                    title: '查看'
                },
                {
                    action: 'dismiss',
                    title: '忽略'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(
                data.title || 'VM · 虚空有物',
                options
            )
        );
    }
});

// 通知点击事件
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow(event.notification.data || '/')
        );
    }
});

// 错误处理
self.addEventListener('error', event => {
    console.error('SW: Error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('SW: Unhandled rejection:', event.reason);
});