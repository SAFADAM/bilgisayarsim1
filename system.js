/**
 * ==========================================================================
 * SimPC / CyberOS - Sistem Çekirdeği & Pencere Yöneticisi
 * ==========================================================================
 */

class SystemCore {
    constructor() {
        this.money = 150; // Başlangıç parası ($)
        this.simCoin = 0.000;
        this.coinPrice = 850.0;
        this.isMining = false;
        this.overclock = 0; // %0 - %100
        this.temperature = 38.0; // °C
        this.systemHealth = 100;

        // Varsayılan Donanım Parçaları
        this.hardware = {
            cpu: 'celeron',
            gpu: 'intel_hd',
            ram: 'ram_2gb',
            cooler: 'stock_fan',
            storage: 'hdd_120'
        };

        this.notesContent = "SimPC Not Defteri v1.0\n---------------------\nHedefler:\n1. Kripto madenciliğini başlat ve SimCoin kazan.\n2. Kazandığın parayla Mağazadan RTX 4090 ve Sıvı Soğutma al!\n3. Hacker Terminalinde 'matrix' ve 'hack' komutlarını dene.\n4. Aman dikkat: Overclock yaparken sıcaklık 100°C'yi aşarsa sistem çöker!";

        this.wallpaper = 'wp-cyberpunk';
        this.currentSystemId = 'minidows_11';
        this.currentSystem = null;
        this.windows = {};
        this.zIndexCounter = 100;
        this.activeWindowId = null;

        this.trackpadEnabled = false;
        this.virtualCursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        this.loadState();
    }

    init() {
        this.setupClock();
        this.setupBattery();
        this.setupStartMenu();
        this.setupVirtualTrackpad();
        this.setupFullscreen();
        this.applySystem(this.currentSystemId, false);

        // Sistem döngüsü (her 1 saniye)
        setInterval(() => this.tick(), 1000);

        // Otomatik kayıt (her 10 saniye)
        setInterval(() => this.saveState(), 10000);

        // İlk açılış bildirimi
        setTimeout(() => {
            const name = this.currentSystem ? this.currentSystem.name : 'Minidows OS';
            this.showToast(`${name} Hazır!`, 'Masaüstündeki 100+ Sistem simgesinden dilediğin sistemi seçebilirsin.', '🪟');
        }, 800);
    }

    // ==========================================================================
    // Sistem Döngüsü & Simülasyon Hesaplamaları
    // ==========================================================================
    tick() {
        const specs = this.getCurrentSpecs();

        // 1. Kripto Madencilik
        if (this.isMining) {
            const ocFactor = 1 + (this.overclock / 100);
            const totalHashrate = (specs.gpu.hashrate + specs.cpu.hashrate) * ocFactor;
            
            // SimCoin üretimi
            const mined = (totalHashrate * 0.000015);
            this.simCoin += mined;

            // Ses motoruna fan vızıltısı bildir
            const fanRpm = Math.min(100, Math.max(20, (this.temperature - 30) * 1.5));
            window.Sound.updateFan(fanRpm);

            if (Math.random() < 0.15) {
                window.Sound.playCoin();
            }
        } else {
            window.Sound.updateFan(0);
        }

        // 2. Sıcaklık Hesaplaması
        const baseLoad = this.isMining ? 0.85 : 0.15;
        const heatGen = (specs.gpu.heat + specs.cpu.heat) * (1 + (this.overclock / 100) * 1.6);
        const coolingPower = specs.cooler.coolingPower;

        // Hedef sıcaklık
        const targetTemp = 35 + (baseLoad * heatGen * 12) / coolingPower;

        // Isı geçişi
        if (this.temperature < targetTemp) {
            this.temperature += Math.min(1.8, (targetTemp - this.temperature) * 0.25);
        } else {
            this.temperature -= Math.min(1.2, (this.temperature - targetTemp) * 0.2);
        }
        this.temperature = Math.max(32, Math.min(115, this.temperature));

        // Sıcaklık uyarıları ve BSOD (Mavi Ekran) kontrolü
        if (this.temperature >= 95 && this.temperature < 105 && Math.random() < 0.2) {
            this.showToast('AŞIRI SICAKLIK UYARISI!', 'Sıcaklık ' + Math.round(this.temperature) + '°C! Soğutmayı yükselt veya Overclock\'u düşür!', '🔥');
            window.Sound.playError();
        } else if (this.temperature >= 105) {
            this.triggerBsod('CRITICAL_THERMAL_OVERHEAT: CPU/GPU_MELTDOWN');
            return;
        }

        // 3. SimCoin Fiyat Dalgalanması (Borsa simülasyonu)
        const priceChange = (Math.random() - 0.48) * 18;
        this.coinPrice = Math.max(200, Math.min(4500, this.coinPrice + priceChange));

        // Açık olan uygulamaların canlı istatistiklerini güncelle
        if (window.Apps) {
            window.Apps.updateLiveViews();
        }

        this.updateTrayStats();
    }

    getCurrentSpecs() {
        return {
            cpu: window.HardwareDB.cpu[this.hardware.cpu] || window.HardwareDB.cpu.celeron,
            gpu: window.HardwareDB.gpu[this.hardware.gpu] || window.HardwareDB.gpu.intel_hd,
            ram: window.HardwareDB.ram[this.hardware.ram] || window.HardwareDB.ram.ram_2gb,
            cooler: window.HardwareDB.cooler[this.hardware.cooler] || window.HardwareDB.cooler.stock_fan,
            storage: window.HardwareDB.storage[this.hardware.storage] || window.HardwareDB.storage.hdd_120
        };
    }

    // ==========================================================================
    // Pencere Yönetimi (Dokunmatik & Fare Uyumlu)
    // ==========================================================================
    openWindow(appId, title, icon, bodyHtml, options = {}) {
        window.Sound.playClick();

        // Pencere zaten açıksa öne getir ve minimize durumdaysa göster
        if (this.windows[appId]) {
            const winEl = document.getElementById('win-' + appId);
            if (winEl) {
                winEl.classList.remove('minimized');
                this.focusWindow(appId);
                return;
            }
        }

        const isMobile = window.innerWidth <= 680;
        const width = options.width || (isMobile ? Math.min(window.innerWidth - 20, 360) : 480);
        const height = options.height || (isMobile ? Math.min(window.innerHeight - 100, 480) : 420);

        // Ekran ortasında konumlandır
        const left = Math.max(10, (window.innerWidth - width) / 2 + (Object.keys(this.windows).length * 15) % 40);
        const top = Math.max(10, (window.innerHeight - height - 60) / 2 + (Object.keys(this.windows).length * 15) % 40);

        const winEl = document.createElement('div');
        winEl.id = 'win-' + appId;
        winEl.className = 'window active-window';
        winEl.style.width = width + 'px';
        winEl.style.height = height + 'px';
        winEl.style.left = left + 'px';
        winEl.style.top = top + 'px';
        winEl.style.zIndex = ++this.zIndexCounter;

        winEl.innerHTML = `
            <div class="window-header" id="header-${appId}">
                <div class="window-title">
                    <span class="title-icon">${icon}</span>
                    <span>${title}</span>
                </div>
                <div class="window-controls">
                    <button class="win-btn btn-min" title="Küçült">─</button>
                    <button class="win-btn btn-max" title="Büyüt">□</button>
                    <button class="win-btn btn-close" title="Kapat">✕</button>
                </div>
            </div>
            <div class="window-body" id="body-${appId}">
                ${bodyHtml}
            </div>
        `;

        document.getElementById('desktop').appendChild(winEl);

        this.windows[appId] = {
            element: winEl,
            title: title,
            icon: icon,
            isMax: false,
            onClose: options.onClose
        };

        this.focusWindow(appId);
        this.addTouchWindowDragger(winEl, appId);
        this.updateTaskbar();

        // Buton olayları
        winEl.querySelector('.btn-close').addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeWindow(appId);
        });

        winEl.querySelector('.btn-min').addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeWindow(appId);
        });

        winEl.querySelector('.btn-max').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMaximize(appId);
        });

        winEl.addEventListener('pointerdown', () => {
            this.focusWindow(appId);
        });

        // Uygulamanın özel init kodu varsa çağır
        if (options.onInit) {
            options.onInit(winEl);
        }
    }

    closeWindow(appId) {
        window.Sound.playClick();
        const win = this.windows[appId];
        if (win) {
            if (win.onClose) {
                try { win.onClose(); } catch (e) { console.warn(e); }
            }
            if (win.element) {
                win.element.remove();
            }
            delete this.windows[appId];
            this.updateTaskbar();
        }
    }

    minimizeWindow(appId) {
        window.Sound.playClick();
        const win = this.windows[appId];
        if (win && win.element) {
            win.element.classList.add('minimized');
            this.updateTaskbar();
        }
    }

    toggleMaximize(appId) {
        window.Sound.playClick();
        const win = this.windows[appId];
        if (win && win.element) {
            win.isMax = !win.isMax;
            if (win.isMax) {
                win.element.classList.add('maximized');
            } else {
                win.element.classList.remove('maximized');
            }
        }
    }

    focusWindow(appId) {
        Object.keys(this.windows).forEach(id => {
            const w = this.windows[id];
            if (w && w.element) {
                w.element.classList.remove('active-window');
            }
        });

        const win = this.windows[appId];
        if (win && win.element) {
            win.element.classList.remove('minimized');
            win.element.classList.add('active-window');
            win.element.style.zIndex = ++this.zIndexCounter;
            this.activeWindowId = appId;
            this.updateTaskbar();
        }
    }

    // Mobil Dokunmatik & Masaüstü Sürükleme Motoru
    addTouchWindowDragger(winEl, appId) {
        const header = winEl.querySelector('.window-header');
        let isDragging = false;
        let startX = 0, startY = 0;
        let initialLeft = 0, initialTop = 0;

        const onStart = (e) => {
            if (e.target.closest('.window-controls')) return;
            if (winEl.classList.contains('maximized')) return;

            this.focusWindow(appId);
            isDragging = true;

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            startX = clientX;
            startY = clientY;
            initialLeft = winEl.offsetLeft;
            initialTop = winEl.offsetTop;

            e.preventDefault();
        };

        const onMove = (e) => {
            if (!isDragging) return;

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const deltaX = clientX - startX;
            const deltaY = clientY - startY;

            let newLeft = initialLeft + deltaX;
            let newTop = initialTop + deltaY;

            // Ekran sınırlarında tut
            newLeft = Math.max(-50, Math.min(window.innerWidth - 60, newLeft));
            newTop = Math.max(0, Math.min(window.innerHeight - 80, newTop));

            winEl.style.left = newLeft + 'px';
            winEl.style.top = newTop + 'px';
        };

        const onEnd = () => {
            isDragging = false;
        };

        // Dokunmatik olaylar (Telefon)
        header.addEventListener('touchstart', onStart, { passive: false });
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onEnd);

        // Fare olayları (Masaüstü)
        header.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);
    }

    // ==========================================================================
    // Görev Çubuğu (Taskbar) Güncelleme
    // ==========================================================================
    updateTaskbar() {
        const center = document.getElementById('taskbar-center');
        if (!center) return;

        center.innerHTML = '';
        Object.keys(this.windows).forEach(appId => {
            const win = this.windows[appId];
            const isMin = win.element.classList.contains('minimized');
            const isActive = win.element.classList.contains('active-window') && !isMin;

            const item = document.createElement('div');
            item.className = `taskbar-item ${isActive ? 'active' : ''}`;
            item.innerHTML = `
                <span>${win.icon}</span>
                <span class="taskbar-text">${win.title}</span>
            `;

            item.addEventListener('click', () => {
                if (isActive) {
                    this.minimizeWindow(appId);
                } else {
                    this.focusWindow(appId);
                }
            });

            center.appendChild(item);
        });
    }

    // ==========================================================================
    // Başlat Menüsü & Alt Çubuk Sistemleri
    // ==========================================================================
    setupStartMenu() {
        const startBtn = document.getElementById('start-btn');
        const startMenu = document.getElementById('start-menu');

        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.Sound.playClick();
            const isOpen = startMenu.style.display === 'flex';
            startMenu.style.display = isOpen ? 'none' : 'flex';
        });

        // Masaüstüne tıklandığında menüyü kapat
        document.addEventListener('click', (e) => {
            if (!startMenu.contains(e.target) && e.target !== startBtn) {
                startMenu.style.display = 'none';
            }
        });
    }

    setupClock() {
        const updateTime = () => {
            const now = new Date();
            const hrs = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');
            const dateStr = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;

            const timeEl = document.getElementById('tray-time');
            const dateEl = document.getElementById('tray-date');
            if (timeEl) timeEl.textContent = `${hrs}:${mins}`;
            if (dateEl) dateEl.textContent = dateStr;
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    setupBattery() {
        const batEl = document.getElementById('tray-battery');
        if (navigator.getBattery) {
            navigator.getBattery().then(bat => {
                const updateBat = () => {
                    const level = Math.round(bat.level * 100);
                    if (batEl) batEl.innerHTML = `${bat.charging ? '⚡' : '🔋'} ${level}%`;
                };
                updateBat();
                bat.addEventListener('levelchange', updateBat);
                bat.addEventListener('chargingchange', updateBat);
            });
        } else {
            if (batEl) batEl.innerHTML = '⚡ 100%';
        }
    }

    updateTrayStats() {
        const balanceEl = document.getElementById('user-balance-val');
        if (balanceEl) {
            balanceEl.textContent = `$${this.money.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    }

    setupFullscreen() {
        const fsBtn = document.getElementById('tray-fs');
        if (!fsBtn) return;

        fsBtn.addEventListener('click', () => {
            window.Sound.playClick();
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
                fsBtn.textContent = '⛶';
            } else {
                document.exitFullscreen().catch(() => {});
                fsBtn.textContent = '⛶';
            }
        });
    }

    // ==========================================================================
    // Sanal Dokunmatik Trackpad (Telefonlar için Fare Kontrolü)
    // ==========================================================================
    setupVirtualTrackpad() {
        const toggleBtn = document.getElementById('tray-trackpad');
        const pad = document.getElementById('virtual-trackpad');
        const cursor = document.getElementById('virtual-cursor');
        const padArea = document.getElementById('tp-pad-area');
        const leftBtn = document.getElementById('tp-left-btn');
        const rightBtn = document.getElementById('tp-right-btn');

        if (!toggleBtn || !pad) return;

        toggleBtn.addEventListener('click', () => {
            window.Sound.playClick();
            this.trackpadEnabled = !this.trackpadEnabled;
            pad.style.display = this.trackpadEnabled ? 'flex' : 'none';
            cursor.style.display = this.trackpadEnabled ? 'block' : 'none';
            toggleBtn.style.color = this.trackpadEnabled ? '#58a6ff' : '#c9d1d9';
            
            if (this.trackpadEnabled) {
                this.showToast('Sanal Fare Açıldı', 'Telefonda fare imleci ile oynamak için kutuyu kullan!', '🖱️');
            }
        });

        // Trackpad parmak hareketi
        let lastTouchX = 0, lastTouchY = 0;
        padArea.addEventListener('touchstart', (e) => {
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
            e.preventDefault();
        }, { passive: false });

        padArea.addEventListener('touchmove', (e) => {
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const dx = (touchX - lastTouchX) * 1.8;
            const dy = (touchY - lastTouchY) * 1.8;

            this.virtualCursor.x = Math.max(0, Math.min(window.innerWidth - 10, this.virtualCursor.x + dx));
            this.virtualCursor.y = Math.max(0, Math.min(window.innerHeight - 10, this.virtualCursor.y + dy));

            cursor.style.left = this.virtualCursor.x + 'px';
            cursor.style.top = this.virtualCursor.y + 'px';

            lastTouchX = touchX;
            lastTouchY = touchY;
            e.preventDefault();
        }, { passive: false });

        // Sol tıklama simülasyonu
        leftBtn.addEventListener('click', () => {
            window.Sound.playClick();
            const el = document.elementFromPoint(this.virtualCursor.x, this.virtualCursor.y);
            if (el) {
                el.click();
            }
        });
    }

    // ==========================================================================
    // Bildirim Toast Sistemi
    // ==========================================================================
    showToast(title, desc, icon = 'ℹ️') {
        window.Sound.playNotification();
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-desc">${desc}</div>
            </div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'opacity 0.3s, transform 0.3s';
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // ==========================================================================
    // Mavi Ekran (BSOD) Çökme Motoru
    // ==========================================================================
    triggerBsod(errorCode = 'CRITICAL_PROCESS_DIED') {
        window.Sound.playBsod();
        const bsod = document.getElementById('bsod-screen');
        const codeEl = document.getElementById('bsod-error-code');
        const progEl = document.getElementById('bsod-prog-val');

        if (!bsod) return;

        this.isMining = false;
        codeEl.textContent = errorCode;
        bsod.style.display = 'flex';

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 20) + 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    // Yeniden başlatma
                    bsod.style.display = 'none';
                    this.temperature = 42; // Soğudu
                    window.Sound.playStartup();
                    this.showToast('Sistem Yeniden Başlatıldı', 'Aşırı yük veya hata sonrası güvenli modda açıldı.', '🔄');
                }, 1200);
            }
            progEl.textContent = `${progress}% tamamlandı`;
        }, 400);
    }

    applyWallpaper(wpClass) {
        const desktop = document.getElementById('desktop');
        if (!desktop) return;
        desktop.className = wpClass;
        this.wallpaper = wpClass;
    }

    // ==========================================================================
    // Kayıt Sistemi (LocalStorage)
    // ==========================================================================
    // ==========================================================================
    // Minidows 100+ Sistem Yönetimi & Tema Geçişi
    // ==========================================================================
    applySystem(sysId, notify = false) {
        if (!window.MinidowsCatalog || window.MinidowsCatalog.length === 0) return;
        const sys = window.MinidowsCatalog.find(s => s.id === sysId) || window.MinidowsCatalog[0];
        this.currentSystemId = sys.id;
        this.currentSystem = sys;

        // Başlat butonu güncelleme
        const sBtn = document.getElementById('start-btn');
        if (sBtn) {
            const iconEl = sBtn.querySelector('.start-icon');
            const textEl = sBtn.querySelector('.start-text');
            if (iconEl) iconEl.textContent = sys.startBtnIcon;
            if (textEl) textEl.textContent = sys.startBtnText;
        }

        // Başlat menüsü başlığı & altlığı
        const osName = document.getElementById('start-os-name');
        if (osName) osName.textContent = sys.name;

        const osVer = document.getElementById('start-os-ver');
        if (osVer) osVer.textContent = `${sys.name} (${sys.year})`;

        // Duvar kağıdı ve tema
        this.applyWallpaper(sys.themeClass);

        if (notify) {
            window.Sound.playStartup();
            this.showToast('Sistem Değiştirildi!', `${sys.name} (${sys.year}) başarıyla yüklendi!`, sys.icon);
        }

        this.saveState();
    }

    saveState() {
        try {
            const data = {
                money: this.money,
                simCoin: this.simCoin,
                hardware: this.hardware,
                wallpaper: this.wallpaper,
                notes: this.notesContent,
                systemId: this.currentSystemId
            };
            localStorage.setItem('minidows_save_v1', JSON.stringify(data));
        } catch (e) {
            console.warn('LocalStorage save error', e);
        }
    }

    loadState() {
        try {
            const saved = localStorage.getItem('minidows_save_v1') || localStorage.getItem('simpc_save_v1');
            if (saved) {
                const data = JSON.parse(saved);
                this.money = data.money !== undefined ? data.money : 150;
                this.simCoin = data.simCoin !== undefined ? data.simCoin : 0;
                if (data.hardware) this.hardware = data.hardware;
                if (data.wallpaper) this.wallpaper = data.wallpaper;
                if (data.notes) this.notesContent = data.notes;
                if (data.systemId) this.currentSystemId = data.systemId;
            }
        } catch (e) {
            console.warn('LocalStorage load error', e);
        }
    }

    // ==========================================================================
    // Kapatma & Yeniden Başlatma (Gerçek Kapanma / Uygulamadan Çıkış)
    // ==========================================================================
    shutdown() {
        window.Sound.playShutdown();
        this.saveState();
        this.isMining = false;

        const powerOffScreen = document.getElementById('power-off-screen');
        if (powerOffScreen) {
            powerOffScreen.style.display = 'flex';
        }

        // APK / Mobil ortamda uygulamadan çıkış yapmayı dene
        setTimeout(() => {
            try {
                if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
                    window.Capacitor.Plugins.App.exitApp();
                }
                if (navigator.app && navigator.app.exitApp) {
                    navigator.app.exitApp();
                }
                window.close();
            } catch (e) {
                console.log('App close error', e);
            }
        }, 1200);
    }

    restart() {
        window.Sound.playShutdown();
        this.saveState();
        this.isMining = false;

        const biosScreen = document.getElementById('bios-screen');
        const biosLog = document.getElementById('bios-log');
        if (biosScreen && biosLog) {
            biosScreen.style.display = 'flex';
            const specs = this.getCurrentSpecs();
            const sysName = this.currentSystem ? this.currentSystem.name : 'Minidows 11';
            biosLog.innerHTML = `Minidows BIOS v4.02 (C) 2026 Minidows Corp.<br>İşlemci: ${specs.cpu.name}... [OK]<br>Bellek Testi: ${specs.ram.name}... [OK]<br>Ekran Kartı: ${specs.gpu.name}... [OK]<br>Depolama Sürücüsü: ${specs.storage.name}... [OK]<br>${sysName} Başlatılıyor...`;

            setTimeout(() => {
                biosScreen.style.display = 'none';
                this.temperature = 38;
                window.Sound.playStartup();
                this.showToast(`${sysName} Yeniden Başlatıldı`, 'Sistem hazır.', '🔄');
            }, 2500);
        } else {
            window.location.reload();
        }
    }

    bootUp() {
        const powerOffScreen = document.getElementById('power-off-screen');
        if (powerOffScreen) {
            powerOffScreen.style.display = 'none';
        }
        window.Sound.playStartup();
        this.showToast('SimPC Açıldı', 'Hoş geldiniz!', '⚡');
    }

    resetState() {
        localStorage.removeItem('simpc_save_v1');
        window.location.reload();
    }
}

window.System = new SystemCore();
