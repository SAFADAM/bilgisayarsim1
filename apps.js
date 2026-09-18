/**
 * ==========================================================================
 * SimPC / CyberOS - Uygulamalar & Oyunlar Modülü
 * ==========================================================================
 */

// Donanım Veritabanı
window.HardwareDB = {
    cpu: {
        celeron: { name: "Intel Celeron 1.8GHz", price: 0, hashrate: 2, heat: 15, desc: "Eski tek çekirdekli ofis işlemcisi", score: 250 },
        core2: { name: "Intel Core 2 Quad Q6600", price: 45, hashrate: 8, heat: 25, desc: "4 çekirdekli emektar efsane", score: 850 },
        i5: { name: "Intel Core i5-10400F", price: 160, hashrate: 22, heat: 35, desc: "6 çekirdek 4.3GHz dengeli güç", score: 2800 },
        ryzen7: { name: "AMD Ryzen 7 7800X3D", price: 420, hashrate: 48, heat: 45, desc: "3D V-Cache destekli oyun canavarı", score: 6500 },
        ryzen9: { name: "AMD Ryzen 9 9950X", price: 750, hashrate: 85, heat: 65, desc: "16 Çekirdek 32 İzlek极限 güç", score: 11200 }
    },
    gpu: {
        intel_hd: { name: "Intel HD Dahili Grafik", price: 0, hashrate: 4, heat: 12, desc: "Görüntü vermeye yarayan dahili çip", score: 180 },
        gt710: { name: "GeForce GT 710 2GB", price: 35, hashrate: 12, heat: 20, desc: "Giriş seviyesi sessiz kart", score: 520 },
        gtx1060: { name: "GeForce GTX 1060 6GB", price: 140, hashrate: 35, heat: 40, desc: "Orta segment 1080p efsanesi", score: 2600 },
        rtx3070: { name: "GeForce RTX 3070 8GB", price: 380, hashrate: 90, heat: 60, desc: "Işın izleme ve DLSS destekli canavar", score: 6800 },
        rtx4080: { name: "GeForce RTX 4080 Super 16GB", price: 980, hashrate: 190, heat: 75, desc: "4K ultra yüksek kare hızları", score: 14500 },
        rtx5090: { name: "GeForce RTX 5090 CyberTitan 32GB", price: 2400, hashrate: 420, heat: 95, desc: "Geleceğin yapay zeka & madencilik devi", score: 28000 }
    },
    ram: {
        ram_2gb: { name: "2GB DDR2 667MHz", price: 0, desc: "Sistemi zar zor açar", score: 100 },
        ram_8gb: { name: "8GB DDR3 1600MHz", price: 30, desc: "Günlük işler için ideal", score: 450 },
        ram_16gb: { name: "16GB DDR4 3200MHz", price: 75, desc: "Oyunlar için önerilen standart", score: 1200 },
        ram_32gb: { name: "32GB DDR5 6000MHz RGB", price: 180, desc: "Yüksek hızlı çift kanal bellek", score: 2800 },
        ram_64gb: { name: "64GB DDR5 7200MHz HyperX", price: 360, desc: "Profesyonel iş istasyonu kapasitesi", score: 5400 }
    },
    cooler: {
        stock_fan: { name: "Kutu İçi Alüminyum Stok Fan", price: 0, coolingPower: 35, desc: "Gürültülü ve yetersiz", score: 100 },
        air_tower: { name: "Bakır Borulu Kule Tipi Soğutucu", price: 45, coolingPower: 65, desc: "Çift fanlı etkili hava soğutma", score: 400 },
        aio_240: { name: "240mm RGB AIO Sıvı Soğutma", price: 140, coolingPower: 110, desc: "Sessiz pompa ve çift radyatör", score: 1200 },
        custom_loop: { name: "360mm Özel Borulu Sıvı Soğutma", price: 380, coolingPower: 180, desc: "Maksimum overclock için soğutma canavarı", score: 3000 }
    },
    storage: {
        hdd_120: { name: "120GB Eski Mekanik Disk (5400 RPM)", price: 0, desc: "Gürültülü kafa sesi ve yavaş açılış", score: 80 },
        ssd_500: { name: "500GB SATA 3 SSD", price: 40, desc: "500 MB/s okuma hızı", score: 500 },
        nvme_1tb: { name: "1TB NVMe M.2 SSD", price: 90, desc: "3500 MB/s yıldırım gibi yükleme", score: 1400 },
        nvme_4tb: { name: "4TB PCIe Gen5 Ultra SSD", price: 290, desc: "14.000 MB/s uçuş modu", score: 3800 }
    }
};

class AppManager {
    constructor() {
        this.currentShopCategory = 'gpu';
        this.activeGame = 'flappy';
        this.flappyLoop = null;
        this.snakeLoop = null;
        this.benchLoop = null;
        this.pacmanLoop = null;
        this.firewaterLoop = null;
    }

    // ==========================================================================
    // 1. UYGULAMA: ParçaBurada (PC Parça Mağazası & Donanım Geliştirme)
    // ==========================================================================
    openShop() {
        window.System.openWindow('shop', 'ParçaBurada - Donanım Mağazası', '🛒', this.renderShopHtml(), {
            width: 480,
            height: 480,
            onInit: (winEl) => {
                this.bindShopEvents(winEl);
            }
        });
    }

    renderShopHtml() {
        const specs = window.System.getCurrentSpecs();
        const totalScore = specs.cpu.score + specs.gpu.score + specs.ram.score + specs.cooler.score + specs.storage.score;

        return `
            <div class="shop-container">
                <div class="pc-status-banner">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 700; font-size: 14px;">🖥️ Sistem Skoru: <span style="color: #58a6ff;">${totalScore.toLocaleString()} Puan</span></span>
                        <span style="font-size: 14px; font-weight: 700; color: #3fb950;">Bakiye: $${window.System.money.toFixed(2)}</span>
                    </div>
                    <div class="pc-specs-row">
                        <div class="spec-badge">
                            <span class="spec-title">İşlemci (CPU)</span>
                            <span class="spec-val">${specs.cpu.name.split(' ')[1] || specs.cpu.name}</span>
                        </div>
                        <div class="spec-badge">
                            <span class="spec-title">Ekran Kartı (GPU)</span>
                            <span class="spec-val">${specs.gpu.name.split(' ')[1] || specs.gpu.name}</span>
                        </div>
                        <div class="spec-badge">
                            <span class="spec-title">Sıcaklık</span>
                            <span class="spec-val" style="color: ${window.System.temperature > 85 ? '#f85149' : '#3fb950'};">${Math.round(window.System.temperature)}°C</span>
                        </div>
                    </div>
                </div>

                <div class="shop-categories">
                    <button class="cat-btn ${this.currentShopCategory === 'gpu' ? 'active' : ''}" data-cat="gpu">🎮 Ekran Kartı</button>
                    <button class="cat-btn ${this.currentShopCategory === 'cpu' ? 'active' : ''}" data-cat="cpu">⚡ İşlemci</button>
                    <button class="cat-btn ${this.currentShopCategory === 'cooler' ? 'active' : ''}" data-cat="cooler">❄️ Soğutucu</button>
                    <button class="cat-btn ${this.currentShopCategory === 'ram' ? 'active' : ''}" data-cat="ram">🧠 RAM Bellek</button>
                    <button class="cat-btn ${this.currentShopCategory === 'storage' ? 'active' : ''}" data-cat="storage">💾 Depolama</button>
                </div>

                <div class="parts-list" id="shop-parts-list">
                    ${this.renderShopItems(this.currentShopCategory)}
                </div>
            </div>
        `;
    }

    renderShopItems(cat) {
        const items = window.HardwareDB[cat];
        const currentEquipped = window.System.hardware[cat];

        return Object.keys(items).map(key => {
            const item = items[key];
            const isEquipped = currentEquipped === key;
            const canAfford = window.System.money >= item.price;

            let bonusText = '';
            if (item.hashrate) bonusText += `⛏️ +${item.hashrate} MH/s `;
            if (item.coolingPower) bonusText += `❄️ Soğutma: ${item.coolingPower}W `;
            if (item.score) bonusText += `🏆 +${item.score} Puan`;

            return `
                <div class="part-card ${isEquipped ? 'equipped' : ''}">
                    <div class="part-info">
                        <span class="part-name">${item.name}</span>
                        <span class="part-desc">${item.desc}</span>
                        <span class="part-bonus">${bonusText}</span>
                    </div>
                    <div class="part-action">
                        <span class="part-price">${item.price === 0 ? 'Dahili' : '$' + item.price}</span>
                        ${isEquipped ? `
                            <button class="buy-btn btn-equipped">Takılı ✓</button>
                        ` : `
                            <button class="buy-btn btn-purchase" data-cat="${cat}" data-key="${key}" ${!canAfford ? 'disabled' : ''}>
                                ${canAfford ? 'Satın Al' : 'Yetersiz Para'}
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    }

    bindShopEvents(winEl) {
        winEl.querySelectorAll('.cat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                window.Sound.playClick();
                winEl.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentShopCategory = btn.getAttribute('data-cat');
                const listEl = winEl.querySelector('#shop-parts-list');
                if (listEl) {
                    listEl.innerHTML = this.renderShopItems(this.currentShopCategory);
                    this.bindPurchaseButtons(winEl);
                }
            });
        });

        this.bindPurchaseButtons(winEl);
    }

    bindPurchaseButtons(winEl) {
        winEl.querySelectorAll('.btn-purchase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cat = btn.getAttribute('data-cat');
                const key = btn.getAttribute('data-key');
                const item = window.HardwareDB[cat][key];

                if (window.System.money >= item.price) {
                    window.System.money -= item.price;
                    window.System.hardware[cat] = key;
                    window.Sound.playStartup();
                    window.System.showToast('Yeni Parça Takıldı!', `${item.name} sisteme monte edildi.`, '🛠️');
                    window.System.updateTrayStats();
                    window.System.saveState();

                    const body = winEl.querySelector('.window-body');
                    if (body) {
                        body.innerHTML = this.renderShopHtml();
                        this.bindShopEvents(winEl);
                    }
                }
            });
        });
    }

    // ==========================================================================
    // 2. UYGULAMA: Kripto Madenci (SimMiner Pro)
    // ==========================================================================
    openMiner() {
        const specs = window.System.getCurrentSpecs();
        const ocFactor = 1 + (window.System.overclock / 100);
        const hashrate = (specs.gpu.hashrate + specs.cpu.hashrate) * ocFactor;

        const html = `
            <div class="miner-container">
                <div class="miner-stats-card">
                    <div class="m-stat">
                        <span class="m-stat-label">Toplam Kazım Hızı</span>
                        <span class="m-stat-value" id="miner-hashrate">${hashrate.toFixed(1)} MH/s</span>
                    </div>
                    <div class="m-stat">
                        <span class="m-stat-label">Bakiye (SimCoin)</span>
                        <span class="m-stat-value coin" id="miner-coin-bal">${window.System.simCoin.toFixed(4)} SC</span>
                    </div>
                    <div class="m-stat">
                        <span class="m-stat-label">SimCoin Borsa Fiyatı</span>
                        <span class="m-stat-value" id="miner-coin-price">$${window.System.coinPrice.toFixed(2)}</span>
                    </div>
                    <div class="m-stat">
                        <span class="m-stat-label">Toplam Değer</span>
                        <span class="m-stat-value" id="miner-total-val" style="color: #3fb950;">
                            $${(window.System.simCoin * window.System.coinPrice).toFixed(2)}
                        </span>
                    </div>
                </div>

                <div class="temp-gauge-container">
                    <div class="gauge-header">
                        <span>🔥 Sistem Sıcaklığı: <b id="miner-temp-val">${Math.round(window.System.temperature)}°C</b></span>
                        <span id="miner-fan-val">Fan: %${Math.round(Math.min(100, Math.max(20, (window.System.temperature - 30) * 1.5)))}</span>
                    </div>
                    <div class="gauge-bar-bg">
                        <div class="gauge-bar-fill" id="miner-temp-fill" style="width: ${Math.min(100, (window.System.temperature / 110) * 100)}%;"></div>
                    </div>
                </div>

                <div class="overclock-box">
                    <div style="display: flex; justify-content: space-between; font-size: 12px;">
                        <span>⚡ Overclock (Hız Aşırtma)</span>
                        <span id="oc-val-display" style="font-weight: 700; color: #f85149;">+${window.System.overclock}%</span>
                    </div>
                    <input type="range" class="oc-slider" id="miner-oc-slider" min="0" max="100" value="${window.System.overclock}">
                    <span style="font-size: 10px; color: var(--text-muted);">Uyarı: Yüksek overclock daha çok kazandırır ancak aşırı sıcaklıkta mavi ekran verir!</span>
                </div>

                <div class="miner-controls">
                    <button class="mine-btn ${window.System.isMining ? 'active' : ''}" id="toggle-mine-btn">
                        ${window.System.isMining ? '⏹️ Madenciliği Durdur' : '▶️ Madenciliği Başlat'}
                    </button>
                    <button class="sell-btn" id="sell-coins-btn">💰 Hepsini Sat</button>
                </div>
            </div>
        `;

        window.System.openWindow('miner', 'SimMiner Pro - Kripto Kazıcı', '⚡', html, {
            width: 440,
            height: 420,
            onInit: (winEl) => {
                const mineBtn = winEl.querySelector('#toggle-mine-btn');
                const sellBtn = winEl.querySelector('#sell-coins-btn');
                const ocSlider = winEl.querySelector('#miner-oc-slider');
                const ocDisplay = winEl.querySelector('#oc-val-display');

                mineBtn.addEventListener('click', () => {
                    window.Sound.playClick();
                    window.System.isMining = !window.System.isMining;
                    mineBtn.className = `mine-btn ${window.System.isMining ? 'active' : ''}`;
                    mineBtn.innerHTML = window.System.isMining ? '⏹️ Madenciliği Durdur' : '▶️ Madenciliği Başlat';
                    
                    if (window.System.isMining) {
                        window.System.showToast('Madencilik Başladı', 'Ekran kartı ve işlemci tam yükte çalışıyor!', '⛏️');
                    }
                });

                sellBtn.addEventListener('click', () => {
                    if (window.System.simCoin <= 0.0001) {
                        window.Sound.playError();
                        window.System.showToast('Satılacak Coin Yok', 'Önce biraz madencilik yaparak SimCoin kazan.', '⚠️');
                        return;
                    }
                    const totalUsd = window.System.simCoin * window.System.coinPrice;
                    window.System.money += totalUsd;
                    window.Sound.playCoin();
                    window.System.showToast('Satış Başarılı!', `+ $${totalUsd.toFixed(2)} hesabına aktarıldı.`, '💵');
                    window.System.simCoin = 0;
                });

                ocSlider.addEventListener('input', (e) => {
                    window.System.overclock = parseInt(e.target.value, 10);
                    ocDisplay.textContent = `+${window.System.overclock}%`;
                });
            }
        });
    }

    // ==========================================================================
    // 3. UYGULAMA: Hacker Terminali (CMD & Konsol)
    // ==========================================================================
    openTerminal() {
        const html = `
            <div class="terminal-container">
                <canvas id="matrix-canvas"></canvas>
                <div class="terminal-history" id="term-history">
                    <div class="term-line-output" style="color: #00ff66;">
SimPC Terminal v3.4 [Root Access]
Tüm sistem kontrolü emrinizde. Komutları görmek için 'help' yazın.
                    </div>
                </div>

                <div class="term-quick-chips">
                    <button class="chip-btn" data-cmd="hack">🔓 Sunucu Hackle</button>
                    <button class="chip-btn" data-cmd="scan">📡 Ağ Tara</button>
                    <button class="chip-btn" data-cmd="matrix">🌧️ Matrix</button>
                    <button class="chip-btn" data-cmd="sysinfo">💻 Sistem Bilgisi</button>
                    <button class="chip-btn" data-cmd="clear">🧹 Temizle</button>
                </div>

                <div class="terminal-input-row">
                    <span class="term-prompt">root@simpc:~$</span>
                    <input type="text" class="term-input" id="term-cmd-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="komut yaz...">
                </div>
            </div>
        `;

        window.System.openWindow('terminal', 'Hacker Terminali (CMD)', '💻', html, {
            width: 480,
            height: 420,
            onInit: (winEl) => {
                const input = winEl.querySelector('#term-cmd-input');
                const history = winEl.querySelector('#term-history');
                const chips = winEl.querySelectorAll('.chip-btn');
                const canvas = winEl.querySelector('#matrix-canvas');

                this.setupMatrixRain(canvas);

                const executeCmd = (cmdText) => {
                    const cleanCmd = cmdText.trim();
                    if (!cleanCmd) return;

                    window.Sound.playKeyClick();
                    this.printTerminalLine(history, `root@simpc:~$ ${cleanCmd}`, 'term-line-cmd');

                    const parts = cleanCmd.toLowerCase().split(' ');
                    const main = parts[0];

                    switch (main) {
                        case 'help':
                            this.printTerminalLine(history, `Kullanılabilir Komutlar:
  • hack          : Rastgele bir banka/şirket sunucusuna sızarak para çal
  • scan          : Çevredeki savunmasız IP adreslerini listele
  • matrix        : Arka plan Matrix yağmurunu aç/kapat
  • sysinfo       : Donanım detaylarını ve hız aşırtmayı göster
  • balance       : Mevcut nakit ve kripto bakiyesini yazdır
  • clear / cls   : Terminal ekranını temizle
  • format c:     : SİSTEMİ ÇÖKERT (Mavi Ekran uyarısı!)
  • easteregg     : Gizli geliştirici hediyesi`);
                            break;

                        case 'hack':
                            this.runHackingSequence(history);
                            break;

                        case 'scan':
                            this.printTerminalLine(history, `Yerel ağ taranıyor...
[+] 192.168.1.1   - Ağ Geçidi (Port 80/443 Açık)
[+] 10.0.42.15    - Sanal Kripto Borsası (Port 8080 KORUMASIZ)
[+] 172.16.0.99   - Şirket Veritabanı (Zafiyet Tespit Edildi!)
Hedefi ele geçirmek için 'hack' komutunu kullan.`);
                            break;

                        case 'matrix':
                            canvas.style.display = canvas.style.display === 'none' ? 'block' : 'none';
                            this.printTerminalLine(history, 'Matrix görsel modu değiştirildi.', 'term-line-success');
                            break;

                        case 'sysinfo':
                            const s = window.System.getCurrentSpecs();
                            this.printTerminalLine(history, `--- DONANIM BİLGİLERİ ---
CPU: ${s.cpu.name}
GPU: ${s.gpu.name}
RAM: ${s.ram.name}
Soğutma: ${s.cooler.name}
Sıcaklık: ${Math.round(window.System.temperature)}°C | Overclock: +%${window.System.overclock}`);
                            break;

                        case 'balance':
                            this.printTerminalLine(history, `Nakit: $${window.System.money.toFixed(2)} | SimCoin: ${window.System.simCoin.toFixed(4)} SC`);
                            break;

                        case 'clear':
                        case 'cls':
                            history.innerHTML = '';
                            break;

                        case 'format':
                            if (parts[1] === 'c:' || parts[1] === 'c') {
                                this.printTerminalLine(history, 'C: SÜRÜCÜSÜ SİLİNİYOR... SİSTEM ÇÖKÜYOR!', 'term-line-error');
                                setTimeout(() => {
                                    window.System.triggerBsod('NTFS_FILE_SYSTEM_DESTRUCTION');
                                }, 800);
                            } else {
                                this.printTerminalLine(history, "Kullanım: format c:", 'term-line-error');
                            }
                            break;

                        case 'easteregg':
                            window.System.money += 500;
                            window.Sound.playCoin();
                            this.printTerminalLine(history, 'Tebrikler! Gizli geliştirici bonusu: +$500 hesabınıza eklendi!', 'term-line-success');
                            break;

                        default:
                            this.printTerminalLine(history, `'${main}' komutu bulunamadı. Yardım için 'help' yazın.`, 'term-line-error');
                            break;
                    }

                    input.value = '';
                    history.scrollTop = history.scrollHeight;
                };

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        executeCmd(input.value);
                    }
                });

                chips.forEach(chip => {
                    chip.addEventListener('click', () => {
                        const cmd = chip.getAttribute('data-cmd');
                        executeCmd(cmd);
                    });
                });
            },
            onClose: () => {
                if (this.matrixInterval) clearInterval(this.matrixInterval);
            }
        });
    }

    printTerminalLine(container, text, className = 'term-line-output') {
        const line = document.createElement('div');
        line.className = className;
        line.textContent = text;
        container.appendChild(line);
        container.scrollTop = container.scrollHeight;
    }

    runHackingSequence(history) {
        const ips = ['10.0.42.15', '172.16.8.44', '194.67.210.3'];
        const target = ips[Math.floor(Math.random() * ips.length)];
        
        this.printTerminalLine(history, `[>] ${target} adresine sızma başlatılıyor...`);

        let step = 0;
        const interval = setInterval(() => {
            step++;
            if (step === 1) {
                this.printTerminalLine(history, `[+] Güvenlik duvarı baypas edildi (Port 8080)...`);
                window.Sound.playKeyClick();
            } else if (step === 2) {
                this.printTerminalLine(history, `[+] RSA-4096 anahtarı çözülüyor: 0x8F9B2...`);
                window.Sound.playKeyClick();
            } else if (step === 3) {
                clearInterval(interval);
                const bounty = Math.floor(Math.random() * 250) + 75;
                window.System.money += bounty;
                window.Sound.playCoin();
                this.printTerminalLine(history, `[✓] BAŞARILI! Şirket fonları transfer edildi: +$${bounty}`, 'term-line-success');
                window.System.showToast('Hack Başarılı!', `Sunucu fonları ele geçirildi: +$${bounty}`, '💰');
            }
        }, 600);
    }

    setupMatrixRain(canvas) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.clientWidth || 300;
        canvas.height = canvas.parentElement.clientHeight || 250;

        const chars = '0123456789ABCDEF@#$%&*';
        const fontSize = 12;
        const cols = Math.floor(canvas.width / fontSize);
        const drops = Array(cols).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff66';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        if (this.matrixInterval) clearInterval(this.matrixInterval);
        this.matrixInterval = setInterval(draw, 45);
    }

    // ==========================================================================
    // 4. UYGULAMA: Oyun Merkezi (Mini Oyunlar & Benchmark)
    // ==========================================================================
    openGames() {
        const html = `
            <div class="game-hub-container">
                <div class="game-select-tabs">
                    <button class="g-tab-btn active" data-game="flappy">💾 Flappy</button>
                    <button class="g-tab-btn" data-game="snake">🐍 Yılan</button>
                    <button class="g-tab-btn" data-game="pacman">🟡 Pac-Man</button>
                    <button class="g-tab-btn" data-game="firewater">🔥💧 Ateş ve Su</button>
                    <button class="g-tab-btn" data-game="bench">🚀 3D Test</button>
                </div>

                <div class="game-arena" id="game-arena-box">
                    <canvas id="game-canvas"></canvas>
                </div>

                <div class="mobile-game-controls" id="game-controls-area">
                    <button class="action-game-btn" id="flappy-jump-btn">👆 ZIPLA / BAŞLA</button>
                </div>
            </div>
        `;

        window.System.openWindow('games', 'Oyun Merkezi & Benchmark', '🎮', html, {
            width: 440,
            height: 490,
            onInit: (winEl) => {
                const tabs = winEl.querySelectorAll('.g-tab-btn');
                tabs.forEach(tab => {
                    tab.addEventListener('click', () => {
                        window.Sound.playClick();
                        tabs.forEach(t => t.classList.remove('active'));
                        tab.classList.add('active');
                        this.activeGame = tab.getAttribute('data-game');
                        this.loadGame(this.activeGame, winEl);
                    });
                });

                this.loadGame('flappy', winEl);
            },
            onClose: () => {
                if (this.flappyLoop) cancelAnimationFrame(this.flappyLoop);
                if (this.snakeLoop) clearInterval(this.snakeLoop);
                if (this.benchLoop) cancelAnimationFrame(this.benchLoop);
                if (this.pacmanLoop) cancelAnimationFrame(this.pacmanLoop);
                if (this.firewaterLoop) cancelAnimationFrame(this.firewaterLoop);
            }
        });
    }

    loadGame(gameName, winEl) {
        // Eski döngüleri durdur
        if (this.flappyLoop) cancelAnimationFrame(this.flappyLoop);
        if (this.snakeLoop) clearInterval(this.snakeLoop);
        if (this.benchLoop) cancelAnimationFrame(this.benchLoop);
        if (this.pacmanLoop) cancelAnimationFrame(this.pacmanLoop);
        if (this.firewaterLoop) cancelAnimationFrame(this.firewaterLoop);

        const canvas = winEl.querySelector('#game-canvas');
        const controls = winEl.querySelector('#game-controls-area');
        if (!canvas) return;

        canvas.width = 380;
        canvas.height = 240;

        if (gameName === 'flappy') {
            controls.innerHTML = `<button class="action-game-btn" id="flappy-jump-btn">👆 ZIPLA (DOKUN)</button>`;
            this.startFlappyGame(canvas, winEl);
        } else if (gameName === 'snake') {
            controls.innerHTML = `
                <div class="dpad">
                    <button class="dpad-btn dpad-up" id="btn-up">▲</button>
                    <button class="dpad-btn dpad-left" id="btn-left">◄</button>
                    <button class="dpad-btn dpad-down" id="btn-down">▼</button>
                    <button class="dpad-btn dpad-right" id="btn-right">►</button>
                </div>
                <div style="font-size: 11px; color: var(--text-muted); text-align: center; flex: 1;">
                    Yılanı ekranda kaydırarak veya yön tuşlarıyla kontrol et.
                </div>
            `;
            this.startSnakeGame(canvas, winEl);
        } else if (gameName === 'pacman') {
            controls.innerHTML = `
                <div class="dpad">
                    <button class="dpad-btn dpad-up" id="p-up">▲</button>
                    <button class="dpad-btn dpad-left" id="p-left">◄</button>
                    <button class="dpad-btn dpad-down" id="p-down">▼</button>
                    <button class="dpad-btn dpad-right" id="p-right">►</button>
                </div>
                <div style="font-size: 11px; color: var(--text-muted); text-align: center; flex: 1;">
                    Yemleri topla, hayaletlerden kaç! Ekranda parmak kaydırarak da kontrol edebilirsin.
                </div>
            `;
            this.startPacmanGame(canvas, winEl);
        } else if (gameName === 'firewater') {
            controls.innerHTML = `
                <div style="display: flex; gap: 8px; width: 100%; align-items: center;">
                    <button class="action-game-btn" id="fw-switch-btn" style="flex: 1.5; font-size: 12px; height: 50px;">
                        🔄 Karakter: <b id="fw-char-label">🔥 Ateş</b>
                    </button>
                    <div style="display: flex; gap: 4px; flex: 2;">
                        <button class="dpad-btn" id="fw-left" style="flex: 1; height: 50px;">◄</button>
                        <button class="dpad-btn" id="fw-right" style="flex: 1; height: 50px;">►</button>
                        <button class="action-game-btn" id="fw-jump" style="flex: 1.2; height: 50px; font-size: 14px; background: #3fb950;">▲ ZIPLA</button>
                    </div>
                </div>
            `;
            this.startFireWaterGame(canvas, winEl);
        } else if (gameName === 'bench') {
            controls.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0 10px;">
                    <span id="bench-fps" style="font-size: 16px; font-weight: 700; color: #3fb950;">60 FPS</span>
                    <span id="bench-status" style="font-size: 12px; color: #58a6ff;">GPU Testi Aktif</span>
                </div>
            `;
            this.startBenchmark(canvas, winEl);
        }
    }

    // Flappy Floppy Mini Oyunu
    startFlappyGame(canvas, winEl) {
        const ctx = canvas.getContext('2d');
        let birdY = 100;
        let velocity = 0;
        const gravity = 0.35;
        let score = 0;
        let pipes = [];
        let isGameOver = false;
        let frame = 0;

        const jump = () => {
            if (isGameOver) {
                birdY = 100;
                velocity = 0;
                pipes = [];
                score = 0;
                isGameOver = false;
            }
            velocity = -5.8;
            window.Sound.playGameTone(600, 'sine', 0.05);
        };

        const jumpBtn = winEl.querySelector('#flappy-jump-btn');
        if (jumpBtn) jumpBtn.addEventListener('click', jump);
        canvas.addEventListener('pointerdown', jump);

        const loop = () => {
            ctx.fillStyle = '#10141f';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            velocity += gravity;
            birdY += velocity;

            // Boru üretimi
            if (frame % 80 === 0) {
                const gap = 80;
                const topH = Math.floor(Math.random() * (canvas.height - gap - 40)) + 20;
                pipes.push({ x: canvas.width, topH: topH, gap: gap, passed: false });
            }

            // Çizim & Çarpışma
            ctx.fillStyle = '#2ea043';
            pipes.forEach(pipe => {
                pipe.x -= 2.2;
                // Üst boru
                ctx.fillRect(pipe.x, 0, 36, pipe.topH);
                // Alt boru
                ctx.fillRect(pipe.x, pipe.topH + pipe.gap, 36, canvas.height - (pipe.topH + pipe.gap));

                // Skor kontrolü
                if (!pipe.passed && pipe.x < 50) {
                    pipe.passed = true;
                    score++;
                    window.System.money += 2; // Para kazandırır
                    window.Sound.playGameTone(880, 'sine', 0.08);
                }

                // Çarpışma
                if (pipe.x < 65 && pipe.x + 36 > 45) {
                    if (birdY < pipe.topH || birdY + 16 > pipe.topH + pipe.gap) {
                        isGameOver = true;
                    }
                }
            });

            pipes = pipes.filter(p => p.x > -40);

            // Zemin çarpışma
            if (birdY > canvas.height - 18 || birdY < 0) {
                isGameOver = true;
            }

            // Disket (Oyuncu)
            ctx.fillStyle = '#bc8cff';
            ctx.fillRect(45, birdY, 18, 18);
            ctx.fillStyle = '#fff';
            ctx.fillRect(49, birdY + 3, 10, 6);

            // Skor yazısı
            ctx.fillStyle = '#fff';
            ctx.font = '14px sans-serif';
            ctx.fillText(`Skor: ${score}  (Kazanılan: $${score * 2})`, 12, 22);

            if (isGameOver) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#f85149';
                ctx.font = '18px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('OYUN BİTTİ!', canvas.width / 2, canvas.height / 2 - 10);
                ctx.fillStyle = '#fff';
                ctx.font = '12px sans-serif';
                ctx.fillText('Tekrar oynamak için dokun', canvas.width / 2, canvas.height / 2 + 15);
                ctx.textAlign = 'start';
            } else {
                frame++;
                this.flappyLoop = requestAnimationFrame(loop);
            }
        };

        this.flappyLoop = requestAnimationFrame(loop);
    }

    // Retro Yılan Oyunu
    startSnakeGame(canvas, winEl) {
        const ctx = canvas.getContext('2d');
        const grid = 15;
        let snake = [{ x: 5, y: 5 }];
        let dir = { x: 1, y: 0 };
        let food = { x: 12, y: 8 };
        let score = 0;

        const setDir = (x, y) => {
            if (dir.x + x !== 0 || dir.y + y !== 0) {
                dir = { x, y };
                window.Sound.playKeyClick();
            }
        };

        const upBtn = winEl.querySelector('#btn-up');
        const downBtn = winEl.querySelector('#btn-down');
        const leftBtn = winEl.querySelector('#btn-left');
        const rightBtn = winEl.querySelector('#btn-right');

        if (upBtn) upBtn.addEventListener('click', () => setDir(0, -1));
        if (downBtn) downBtn.addEventListener('click', () => setDir(0, 1));
        if (leftBtn) leftBtn.addEventListener('click', () => setDir(-1, 0));
        if (rightBtn) rightBtn.addEventListener('click', () => setDir(1, 0));

        this.snakeLoop = setInterval(() => {
            const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

            // Duvarlardan geçiş
            const cols = Math.floor(canvas.width / grid);
            const rows = Math.floor(canvas.height / grid);
            if (head.x < 0) head.x = cols - 1;
            if (head.x >= cols) head.x = 0;
            if (head.y < 0) head.y = rows - 1;
            if (head.y >= rows) head.y = 0;

            // Kendine çarpma
            if (snake.some(s => s.x === head.x && s.y === head.y)) {
                snake = [{ x: 5, y: 5 }];
                dir = { x: 1, y: 0 };
                score = 0;
                window.Sound.playError();
                return;
            }

            snake.unshift(head);

            // Yem yeme
            if (head.x === food.x && head.y === food.y) {
                score++;
                window.System.money += 5; // Ödül
                window.Sound.playGameTone(750, 'square', 0.08);
                food = {
                    x: Math.floor(Math.random() * cols),
                    y: Math.floor(Math.random() * rows)
                };
            } else {
                snake.pop();
            }

            // Çizim
            ctx.fillStyle = '#080d14';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Yem
            ctx.fillStyle = '#f85149';
            ctx.fillRect(food.x * grid, food.y * grid, grid - 2, grid - 2);

            // Yılan
            ctx.fillStyle = '#00f0ff';
            snake.forEach((s, idx) => {
                ctx.fillStyle = idx === 0 ? '#388bfd' : '#00f0ff';
                ctx.fillRect(s.x * grid, s.y * grid, grid - 2, grid - 2);
            });

            ctx.fillStyle = '#fff';
            ctx.font = '12px sans-serif';
            ctx.fillText(`Yılan Skoru: ${score}  (+$${score * 5})`, 10, 18);
        }, 120);
    }

    // 3D Donanım Benchmark Testi
    startBenchmark(canvas, winEl) {
        const ctx = canvas.getContext('2d');
        const fpsEl = winEl.querySelector('#bench-fps');
        let angle = 0;
        let lastTime = performance.now();
        let frames = 0;

        const specs = window.System.getCurrentSpecs();
        const baseGpuFps = Math.min(240, Math.floor(specs.gpu.score / 120) + 30);

        const loop = (now) => {
            frames++;
            if (now - lastTime >= 1000) {
                if (fpsEl) {
                    fpsEl.textContent = `${baseGpuFps} FPS (${specs.gpu.name.split(' ')[1] || 'GPU'})`;
                }
                lastTime = now;
                frames = 0;
            }

            ctx.fillStyle = 'rgba(5, 8, 15, 0.25)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Dönen 3D Tel Kafes Küp
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const size = 65;

            angle += 0.025;

            const nodes = [
                [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
                [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
            ];

            const edges = [
                [0, 1], [1, 2], [2, 3], [3, 0],
                [4, 5], [5, 6], [6, 7], [7, 4],
                [0, 4], [1, 5], [2, 6], [3, 7]
            ];

            const projected = nodes.map(([x, y, z]) => {
                // Y ve X ekseni etrafında döndür
                const rad = angle;
                const cosY = Math.cos(rad), sinY = Math.sin(rad);
                const cosX = Math.cos(rad * 0.7), sinX = Math.sin(rad * 0.7);

                let x1 = x * cosY - z * sinY;
                let z1 = z * cosY + x * sinY;
                let y1 = y * cosX - z1 * sinX;
                let z2 = z1 * cosX + y * sinX;

                const fov = 200;
                const scale = fov / (fov + z2 * 40);
                return [cx + x1 * size * scale, cy + y1 * size * scale];
            });

            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2;
            edges.forEach(([i, j]) => {
                ctx.beginPath();
                ctx.moveTo(projected[i][0], projected[i][1]);
                ctx.lineTo(projected[j][0], projected[j][1]);
                ctx.stroke();
            });

            this.benchLoop = requestAnimationFrame(loop);
        };

        this.benchLoop = requestAnimationFrame(loop);
    }

    // ==========================================================================
    // Pac-Man Mini Oyunu
    // ==========================================================================
    startPacmanGame(canvas, winEl) {
        const ctx = canvas.getContext('2d');
        const tileSize = 20;
        const cols = 19;
        const rows = 12;

        const originalMap = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,3,2,2,2,2,2,2,1,1,1,2,2,2,2,2,2,3,1],
            [1,2,1,1,2,1,1,2,1,1,1,2,1,1,2,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,2,1,2,1,1,0,1,1,2,1,2,1,1,2,1],
            [0,2,2,2,2,1,2,1,0,0,0,1,2,1,2,2,2,2,0],
            [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,2,1,1,2,2,1,2,2,1,1,2,1,1,2,1],
            [1,3,2,1,2,2,2,2,2,0,2,2,2,2,2,1,2,3,1],
            [1,1,2,2,2,1,1,1,2,1,2,1,1,1,2,2,2,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];

        let map = originalMap.map(r => [...r]);
        let pacman = { x: 9.5 * tileSize, y: 9 * tileSize, dirX: 0, dirY: 0, nextX: 0, nextY: 0, angle: 0.2, mouthSpeed: 0.04 };
        let ghosts = [
            { x: 9 * tileSize, y: 5 * tileSize, color: '#f85149', dirX: 1, dirY: 0, scared: 0 },
            { x: 8 * tileSize, y: 5 * tileSize, color: '#bc8cff', dirX: -1, dirY: 0, scared: 0 },
            { x: 10 * tileSize, y: 5 * tileSize, color: '#00f0ff', dirX: 0, dirY: -1, scared: 0 }
        ];

        let score = 0;
        let isGameOver = false;

        const setDir = (dx, dy) => {
            pacman.nextX = dx;
            pacman.nextY = dy;
        };

        const u = winEl.querySelector('#p-up');
        const d = winEl.querySelector('#p-down');
        const l = winEl.querySelector('#p-left');
        const r = winEl.querySelector('#p-right');
        if (u) u.addEventListener('click', () => setDir(0, -1));
        if (d) d.addEventListener('click', () => setDir(0, 1));
        if (l) l.addEventListener('click', () => setDir(-1, 0));
        if (r) r.addEventListener('click', () => setDir(1, 0));

        let touchStartX = 0, touchStartY = 0;
        canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        canvas.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(dx) > Math.abs(dy)) {
                setDir(dx > 0 ? 1 : -1, 0);
            } else {
                setDir(0, dy > 0 ? 1 : -1);
            }
        }, { passive: true });

        const canMove = (x, y) => {
            const c = Math.floor(x / tileSize);
            const r = Math.floor(y / tileSize);
            if (c < 0 || c >= cols) return true;
            if (r < 0 || r >= rows) return false;
            return map[r][c] !== 1;
        };

        const loop = () => {
            ctx.fillStyle = '#0a0a14';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            let remainingDots = 0;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const tile = map[r][c];
                    if (tile === 1) {
                        ctx.fillStyle = '#1e3a8a';
                        ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
                        ctx.strokeStyle = '#3b82f6';
                        ctx.strokeRect(c * tileSize + 1, r * tileSize + 1, tileSize - 2, tileSize - 2);
                    } else if (tile === 2) {
                        remainingDots++;
                        ctx.fillStyle = '#fbbf24';
                        ctx.beginPath();
                        ctx.arc(c * tileSize + tileSize / 2, r * tileSize + tileSize / 2, 3, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (tile === 3) {
                        remainingDots++;
                        ctx.fillStyle = '#f59e0b';
                        ctx.beginPath();
                        ctx.arc(c * tileSize + tileSize / 2, r * tileSize + tileSize / 2, 6, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }

            const speed = 2;
            const nextCenterX = pacman.x + pacman.nextX * speed;
            const nextCenterY = pacman.y + pacman.nextY * speed;

            if (canMove(nextCenterX, nextCenterY)) {
                pacman.dirX = pacman.nextX;
                pacman.dirY = pacman.nextY;
            }

            const newX = pacman.x + pacman.dirX * speed;
            const newY = pacman.y + pacman.dirY * speed;
            if (canMove(newX, newY)) {
                pacman.x = newX;
                pacman.y = newY;
            }

            if (pacman.x < 0) pacman.x = canvas.width;
            if (pacman.x > canvas.width) pacman.x = 0;

            const pCol = Math.floor(pacman.x / tileSize);
            const pRow = Math.floor(pacman.y / tileSize);
            if (pCol >= 0 && pCol < cols && pRow >= 0 && pRow < rows) {
                if (map[pRow][pCol] === 2) {
                    map[pRow][pCol] = 0;
                    score += 10;
                    window.System.money += 0.5;
                    window.Sound.playPacmanChomp(false);
                } else if (map[pRow][pCol] === 3) {
                    map[pRow][pCol] = 0;
                    score += 50;
                    window.System.money += 2;
                    window.Sound.playPacmanChomp(true);
                    ghosts.forEach(g => g.scared = 240);
                }
            }

            pacman.angle += pacman.mouthSpeed;
            if (pacman.angle > 0.4 || pacman.angle < 0.05) pacman.mouthSpeed = -pacman.mouthSpeed;

            let rot = 0;
            if (pacman.dirX === 1) rot = 0;
            else if (pacman.dirX === -1) rot = Math.PI;
            else if (pacman.dirY === 1) rot = Math.PI / 2;
            else if (pacman.dirY === -1) rot = -Math.PI / 2;

            ctx.save();
            ctx.translate(pacman.x, pacman.y);
            ctx.rotate(rot);
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.arc(0, 0, 8, pacman.angle, Math.PI * 2 - pacman.angle);
            ctx.lineTo(0, 0);
            ctx.fill();
            ctx.restore();

            ghosts.forEach(g => {
                if (g.scared > 0) g.scared--;

                const gSpeed = g.scared > 0 ? 1 : 1.4;
                if (!canMove(g.x + g.dirX * gSpeed, g.y + g.dirY * gSpeed) || Math.random() < 0.04) {
                    const dirs = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];
                    const valid = dirs.filter(d => canMove(g.x + d.x * 3, g.y + d.y * 3));
                    if (valid.length > 0) {
                        const chosen = valid[Math.floor(Math.random() * valid.length)];
                        g.dirX = chosen.x;
                        g.dirY = chosen.y;
                    }
                }
                g.x += g.dirX * gSpeed;
                g.y += g.dirY * gSpeed;

                ctx.fillStyle = g.scared > 0 ? '#38bdf8' : g.color;
                ctx.beginPath();
                ctx.arc(g.x, g.y - 2, 7, Math.PI, 0, false);
                ctx.lineTo(g.x + 7, g.y + 6);
                ctx.lineTo(g.x - 7, g.y + 6);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.fillRect(g.x - 4, g.y - 4, 3, 3);
                ctx.fillRect(g.x + 1, g.y - 4, 3, 3);

                const dist = Math.hypot(pacman.x - g.x, pacman.y - g.y);
                if (dist < 12) {
                    if (g.scared > 0) {
                        score += 200;
                        window.System.money += 10;
                        window.Sound.playCoin();
                        g.x = 9 * tileSize;
                        g.y = 5 * tileSize;
                        g.scared = 0;
                        window.System.showToast('Hayalet Yendi!', '+ $10 Kazanıldı!', '👻');
                    } else {
                        isGameOver = true;
                        window.Sound.playError();
                    }
                }
            });

            ctx.fillStyle = '#fff';
            ctx.font = '12px sans-serif';
            ctx.fillText(`Pacman Skor: ${score}  (Kasa: $${window.System.money.toFixed(1)})`, 10, 16);

            if (remainingDots === 0) {
                map = originalMap.map(r => [...r]);
                score += 500;
                window.System.money += 50;
                window.Sound.playCoin();
                window.System.showToast('BÖLÜM TEMİZLENDİ!', '+ $50 Bonus!', '🟡');
            }

            if (isGameOver) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#f85149';
                ctx.font = '18px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('YAKALANDIN!', canvas.width / 2, canvas.height / 2 - 10);
                ctx.fillStyle = '#fff';
                ctx.font = '12px sans-serif';
                ctx.fillText('Yeniden oynamak için ekrana dokun', canvas.width / 2, canvas.height / 2 + 15);
                ctx.textAlign = 'start';
            } else {
                this.pacmanLoop = requestAnimationFrame(loop);
            }
        };

        canvas.addEventListener('click', () => {
            if (isGameOver) {
                map = originalMap.map(r => [...r]);
                pacman.x = 9.5 * tileSize;
                pacman.y = 9 * tileSize;
                pacman.dirX = 0; pacman.dirY = 0;
                isGameOver = false;
                this.pacmanLoop = requestAnimationFrame(loop);
            }
        });

        this.pacmanLoop = requestAnimationFrame(loop);
    }

    // ==========================================================================
    // Ateş ve Su (Fireboy & Watergirl) Mini Oyunu
    // ==========================================================================
    startFireWaterGame(canvas, winEl) {
        const ctx = canvas.getContext('2d');

        let fireboy = { x: 30, y: 195, vx: 0, vy: 0, onGround: true, gems: 0, color: '#ff3b30' };
        let watergirl = { x: 60, y: 195, vx: 0, vy: 0, onGround: true, gems: 0, color: '#007aff' };
        let active = 'fire';

        const platforms = [
            { x: 0, y: 220, w: 380, h: 20 },
            { x: 0, y: 160, w: 140, h: 12 },
            { x: 200, y: 160, w: 180, h: 12 },
            { x: 100, y: 105, w: 180, h: 12 },
            { x: 290, y: 70, w: 90, h: 12 }
        ];

        const lavaPool = { x: 140, y: 216, w: 60, h: 8 };
        const waterPool = { x: 230, y: 216, w: 60, h: 8 };
        const acidPool = { x: 160, y: 101, w: 60, h: 8 };

        let redGems = [{ x: 165, y: 185, collected: false }, { x: 120, y: 80, collected: false }];
        let blueGems = [{ x: 255, y: 185, collected: false }, { x: 260, y: 80, collected: false }];

        const button = { x: 40, y: 156, w: 20, h: 4, pressed: false };
        let laserDoor = { x: 220, y: 105, w: 8, h: 55, active: true };

        const redDoor = { x: 310, y: 38, w: 24, h: 32 };
        const blueDoor = { x: 345, y: 38, w: 24, h: 32 };

        let levelWon = false;
        let keys = { left: false, right: false };

        const switchBtn = winEl.querySelector('#fw-switch-btn');
        const charLabel = winEl.querySelector('#fw-char-label');
        const leftBtn = winEl.querySelector('#fw-left');
        const rightBtn = winEl.querySelector('#fw-right');
        const jumpBtn = winEl.querySelector('#fw-jump');

        if (switchBtn) {
            switchBtn.addEventListener('click', () => {
                window.Sound.playClick();
                active = active === 'fire' ? 'water' : 'fire';
                charLabel.innerHTML = active === 'fire' ? '🔥 Ateş' : '💧 Su';
                switchBtn.style.borderColor = active === 'fire' ? '#ff3b30' : '#007aff';
            });
        }

        const pressLeft = () => keys.left = true;
        const releaseLeft = () => keys.left = false;
        const pressRight = () => keys.right = true;
        const releaseRight = () => keys.right = false;

        if (leftBtn) {
            leftBtn.addEventListener('pointerdown', pressLeft);
            leftBtn.addEventListener('pointerup', releaseLeft);
            leftBtn.addEventListener('pointerleave', releaseLeft);
        }
        if (rightBtn) {
            rightBtn.addEventListener('pointerdown', pressRight);
            rightBtn.addEventListener('pointerup', releaseRight);
            rightBtn.addEventListener('pointerleave', releaseRight);
        }

        const jump = () => {
            const cur = active === 'fire' ? fireboy : watergirl;
            if (cur.onGround) {
                cur.vy = -6.5;
                cur.onGround = false;
                window.Sound.playJump();
            }
        };

        if (jumpBtn) jumpBtn.addEventListener('click', jump);

        const resetChars = () => {
            fireboy.x = 30; fireboy.y = 195; fireboy.vx = 0; fireboy.vy = 0;
            watergirl.x = 60; watergirl.y = 195; watergirl.vx = 0; watergirl.vy = 0;
            window.Sound.playSplash();
        };

        const loop = () => {
            ctx.fillStyle = '#111827';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#374151';
            platforms.forEach(p => {
                ctx.fillRect(p.x, p.y, p.w, p.h);
                ctx.fillStyle = '#4b5563';
                ctx.fillRect(p.x, p.y, p.w, 3);
                ctx.fillStyle = '#374151';
            });

            ctx.fillStyle = '#ef4444';
            ctx.fillRect(lavaPool.x, lavaPool.y, lavaPool.w, lavaPool.h);
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(waterPool.x, waterPool.y, waterPool.w, waterPool.h);
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(acidPool.x, acidPool.y, acidPool.w, acidPool.h);

            button.pressed = (Math.abs(fireboy.x - button.x) < 16 && Math.abs(fireboy.y - button.y) < 16) ||
                             (Math.abs(watergirl.x - button.x) < 16 && Math.abs(watergirl.y - button.y) < 16);
            laserDoor.active = !button.pressed;

            ctx.fillStyle = button.pressed ? '#10b981' : '#f59e0b';
            ctx.fillRect(button.x, button.y + (button.pressed ? 2 : 0), button.w, button.h);

            if (laserDoor.active) {
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(laserDoor.x + 4, laserDoor.y);
                ctx.lineTo(laserDoor.x + 4, laserDoor.y + laserDoor.h);
                ctx.stroke();
            }

            ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
            ctx.fillRect(redDoor.x, redDoor.y, redDoor.w, redDoor.h);
            ctx.strokeStyle = '#ef4444';
            ctx.strokeRect(redDoor.x, redDoor.y, redDoor.w, redDoor.h);
            ctx.fillStyle = '#fff';
            ctx.fillText('🔥', redDoor.x + 4, redDoor.y + 20);

            ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
            ctx.fillRect(blueDoor.x, blueDoor.y, blueDoor.w, blueDoor.h);
            ctx.strokeStyle = '#3b82f6';
            ctx.strokeRect(blueDoor.x, blueDoor.y, blueDoor.w, blueDoor.h);
            ctx.fillStyle = '#fff';
            ctx.fillText('💧', blueDoor.x + 4, blueDoor.y + 20);

            redGems.forEach(g => {
                if (!g.collected) {
                    ctx.fillStyle = '#ef4444';
                    ctx.beginPath();
                    ctx.arc(g.x, g.y, 5, 0, Math.PI * 2);
                    ctx.fill();
                    if (Math.hypot(fireboy.x - g.x, fireboy.y - g.y) < 15) {
                        g.collected = true;
                        window.System.money += 15;
                        window.Sound.playCoin();
                    }
                }
            });

            blueGems.forEach(g => {
                if (!g.collected) {
                    ctx.fillStyle = '#3b82f6';
                    ctx.beginPath();
                    ctx.arc(g.x, g.y, 5, 0, Math.PI * 2);
                    ctx.fill();
                    if (Math.hypot(watergirl.x - g.x, watergirl.y - g.y) < 15) {
                        g.collected = true;
                        window.System.money += 15;
                        window.Sound.playCoin();
                    }
                }
            });

            const chars = [fireboy, watergirl];
            chars.forEach(c => {
                const isSelected = (c === fireboy && active === 'fire') || (c === watergirl && active === 'water');
                if (isSelected) {
                    if (keys.left) c.vx = -3;
                    else if (keys.right) c.vx = 3;
                    else c.vx = 0;
                } else {
                    c.vx = 0;
                }

                c.vy += 0.35;
                c.x += c.vx;
                c.y += c.vy;

                if (laserDoor.active && c.x + 12 > laserDoor.x && c.x < laserDoor.x + laserDoor.w && c.y > laserDoor.y && c.y < laserDoor.y + laserDoor.h) {
                    c.x = laserDoor.x - 14;
                }

                c.onGround = false;
                platforms.forEach(p => {
                    if (c.x + 10 > p.x && c.x - 10 < p.x + p.w) {
                        if (c.y + 12 >= p.y && c.y - c.vy <= p.y + 6) {
                            c.y = p.y - 12;
                            c.vy = 0;
                            c.onGround = true;
                        }
                    }
                });

                c.x = Math.max(10, Math.min(canvas.width - 10, c.x));
            });

            if (watergirl.x > lavaPool.x && watergirl.x < lavaPool.x + lavaPool.w && watergirl.y > lavaPool.y - 10) {
                window.System.showToast('Su Kız Yandı!', 'Ateş havuzuna sadece Ateş Çocuk girebilir.', '🔥');
                resetChars();
            }
            if (fireboy.x > waterPool.x && fireboy.x < waterPool.x + waterPool.w && fireboy.y > waterPool.y - 10) {
                window.System.showToast('Ateş Çocuk Söndü!', 'Su havuzuna sadece Su Kız girebilir.', '💧');
                resetChars();
            }
            if ((fireboy.x > acidPool.x && fireboy.x < acidPool.x + acidPool.w && fireboy.y > acidPool.y - 10) ||
                (watergirl.x > acidPool.x && watergirl.x < acidPool.x + acidPool.w && watergirl.y > acidPool.y - 10)) {
                window.System.showToast('Zehirli Asit!', 'Yeşil gölete ikisi de giremez.', '☠️');
                resetChars();
            }

            ctx.fillStyle = fireboy.color;
            ctx.beginPath();
            ctx.arc(fireboy.x, fireboy.y, 8, 0, Math.PI * 2);
            ctx.fill();
            if (active === 'fire') {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            ctx.fillStyle = watergirl.color;
            ctx.beginPath();
            ctx.arc(watergirl.x, watergirl.y, 8, 0, Math.PI * 2);
            ctx.fill();
            if (active === 'water') {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            const fireWon = Math.hypot(fireboy.x - (redDoor.x + 12), fireboy.y - (redDoor.y + 16)) < 16;
            const waterWon = Math.hypot(watergirl.x - (blueDoor.x + 12), watergirl.y - (blueDoor.y + 16)) < 16;

            if (fireWon && waterWon && !levelWon) {
                levelWon = true;
                window.System.money += 100;
                window.Sound.playStartup();
                window.System.showToast('TEBRİKLER!', 'Ateş ve Su kapılara ulaştı! +$100 Ödül!', '🏆');
            }

            ctx.fillStyle = '#fff';
            ctx.font = '11px sans-serif';
            ctx.fillText(`Aktif: ${active === 'fire' ? 'Ateş Çocuk (Kırmızı)' : 'Su Kız (Mavi)'} | Kapılara Ulaş!`, 10, 16);

            if (!levelWon) {
                this.firewaterLoop = requestAnimationFrame(loop);
            } else {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#3fb950';
                ctx.font = '18px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('SEVİYE TAMAMLANDI!', canvas.width / 2, canvas.height / 2 - 10);
                ctx.fillStyle = '#fff';
                ctx.font = '12px sans-serif';
                ctx.fillText('+$100 Hesaba Eklendi. Tekrar oynamak için dokun.', canvas.width / 2, canvas.height / 2 + 15);
                ctx.textAlign = 'start';
            }
        };

        canvas.addEventListener('click', () => {
            if (levelWon) {
                levelWon = false;
                redGems.forEach(g => g.collected = false);
                blueGems.forEach(g => g.collected = false);
                resetChars();
                this.firewaterLoop = requestAnimationFrame(loop);
            }
        });

        this.firewaterLoop = requestAnimationFrame(loop);
    }

    // ==========================================================================
    // 7. UYGULAMA: SimGoogle & İnternet Tarayıcısı
    // ==========================================================================
    openBrowser() {
        const renderGoogleHome = () => `
            <div class="google-view">
                <div class="google-logo">
                    <span class="g-blue">S</span><span class="g-red">i</span><span class="g-yellow">m</span><span class="g-blue">G</span><span class="g-green">o</span><span class="g-red">o</span><span class="g-yellow">g</span><span class="g-blue">l</span><span class="g-green">e</span>
                </div>
                <div class="google-search-row">
                    <span>🔍</span>
                    <input type="text" class="google-search-input" id="g-search-in" placeholder="Google'da arayın veya bir URL yazın...">
                </div>
                <div class="google-btns">
                    <button class="google-btn" id="g-search-btn">Google'da Ara</button>
                    <button class="google-btn" id="g-lucky-btn">Kendimi Şanslı Hissediyorum</button>
                </div>

                <div class="browser-bookmarks">
                    <div class="bm-item" data-site="tube">
                        <div class="bm-icon">📺</div>
                        <span class="bm-label">VidTube</span>
                    </div>
                    <div class="bm-item" data-site="news">
                        <div class="bm-icon">📰</div>
                        <span class="bm-label">SimHaber</span>
                    </div>
                    <div class="bm-item" data-site="wiki">
                        <div class="bm-icon">💡</div>
                        <span class="bm-label">WikiBilgi</span>
                    </div>
                    <div class="bm-item" data-site="crypto">
                        <div class="bm-icon">🪙</div>
                        <span class="bm-label">Kripto</span>
                    </div>
                </div>
            </div>
        `;

        const html = `
            <div class="browser-container">
                <div class="browser-toolbar">
                    <button class="browser-nav-btn" id="b-back" title="Geri">◀</button>
                    <button class="browser-nav-btn" id="b-forward" title="İleri">▶</button>
                    <button class="browser-nav-btn" id="b-refresh" title="Yenile">🔄</button>
                    <button class="browser-nav-btn" id="b-home" title="Ana Sayfa">🏠</button>
                    <div class="browser-address-bar">
                        <span>🔒</span>
                        <input type="text" class="browser-url-input" id="b-url" value="https://www.google.com">
                    </div>
                </div>
                <div class="browser-content" id="b-content">
                    ${renderGoogleHome()}
                </div>
            </div>
        `;

        window.System.openWindow('browser', 'SimGoogle - İnternet Tarayıcısı', '🌐', html, {
            width: 490,
            height: 480,
            onInit: (winEl) => {
                const content = winEl.querySelector('#b-content');
                const urlInput = winEl.querySelector('#b-url');
                const homeBtn = winEl.querySelector('#b-home');
                const refreshBtn = winEl.querySelector('#b-refresh');

                const showHome = () => {
                    urlInput.value = 'https://www.google.com';
                    content.innerHTML = renderGoogleHome();
                    bindHomeEvents();
                };

                const doSearch = (query) => {
                    const q = query.trim().toLowerCase();
                    if (!q) return;
                    window.Sound.playClick();
                    urlInput.value = `https://www.google.com/search?q=${encodeURIComponent(q)}`;

                    let resultsHtml = '';
                    if (q.includes('pacman') || q.includes('oyun') || q.includes('ateş')) {
                        resultsHtml = `
                            <div class="res-item" onclick="window.Apps.openGames();">
                                <span class="res-title">🟡 Pac-Man & Ateş ve Su - SimPC Oyun Merkezi</span>
                                <span class="res-desc">Efsanevi Pac-Man ve Ateş ve Su oyununu hemen oyna! Buraya dokunarak oyunu aç.</span>
                            </div>
                        `;
                    } else if (q.includes('rtx') || q.includes('ekran kartı') || q.includes('parça') || q.includes('gpu')) {
                        resultsHtml = `
                            <div class="res-item" onclick="window.Apps.openShop();">
                                <span class="res-title">🛒 ParçaBurada - RTX 5090 CyberTitan ve En İyi GPU Fiyatları</span>
                                <span class="res-desc">Ekran kartını yükselt, hashrate ve FPS'i ikiye katla! Buraya dokunarak Mağazaya git.</span>
                            </div>
                        `;
                    } else if (q.includes('bitcoin') || q.includes('kripto') || q.includes('para')) {
                        resultsHtml = `
                            <div class="res-item" onclick="window.Apps.openMiner();">
                                <span class="res-title">⚡ SimCoin Borsa Takibi ve Canlı Madencilik</span>
                                <span class="res-desc">SimCoin şu anda $${window.System.coinPrice.toFixed(2)} seviyesinde! Madenciliği başlatmak için tıkla.</span>
                            </div>
                        `;
                    } else if (q.includes('hacker') || q.includes('cmd') || q.includes('kod')) {
                        resultsHtml = `
                            <div class="res-item" onclick="window.Apps.openTerminal();">
                                <span class="res-title">💻 Root Hacker Kılavuzu: Terminal Komutları</span>
                                <span class="res-desc">Komutlar: 'hack', 'matrix', 'scan', 'easteregg'. Hemen terminali açıp dene!</span>
                            </div>
                        `;
                    }

                    resultsHtml += `
                        <div class="res-item">
                            <span class="res-title">${query} Nedir? - WikiBilgi Ansiklopedisi</span>
                            <span class="res-desc">SimPC sanal evreninde '${query}' hakkında en güncel bilgiler, açıklamalar ve kullanıcı yorumları.</span>
                        </div>
                        <div class="res-item">
                            <span class="res-title">VidTube: '${query}' ile ilgili en popüler 10 video</span>
                            <span class="res-desc">İzlenme rekorları kıran inceleme ve eğlenceli videolar.</span>
                        </div>
                    `;

                    content.innerHTML = `
                        <div class="search-results-box">
                            <div style="font-size: 12px; color: #70757a; margin-bottom: 8px;">Yaklaşık 142.000 sonuç bulundu (0.24 saniye)</div>
                            ${resultsHtml}
                        </div>
                    `;
                };

                const bindHomeEvents = () => {
                    const searchIn = winEl.querySelector('#g-search-in');
                    const searchBtn = winEl.querySelector('#g-search-btn');
                    const luckyBtn = winEl.querySelector('#g-lucky-btn');

                    if (searchIn) {
                        searchIn.addEventListener('keydown', (e) => {
                            if (e.key === 'Enter') doSearch(searchIn.value);
                        });
                    }
                    if (searchBtn) searchBtn.addEventListener('click', () => doSearch(searchIn ? searchIn.value : ''));
                    if (luckyBtn) luckyBtn.addEventListener('click', () => doSearch('pacman'));

                    winEl.querySelectorAll('.bm-item').forEach(bm => {
                        bm.addEventListener('click', () => {
                            const site = bm.getAttribute('data-site');
                            window.Sound.playClick();
                            if (site === 'tube') {
                                urlInput.value = 'https://www.vidtube.sim/trending';
                                content.innerHTML = `
                                    <div style="width: 100%; display: flex; flex-direction: column; gap: 14px;">
                                        <div style="font-size: 16px; font-weight: 700; color: #ff0000;">📺 VidTube Trendler</div>
                                        <div style="background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px;">
                                            <b>🔥 RTX 5090 ile Yumurta Pişirdik!</b>
                                            <p style="font-size: 12px; color: #6b7280;">1.2 Milyon Görüntülenme • 2 gün önce</p>
                                        </div>
                                        <div style="background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px;">
                                            <b>💻 Bilgisayara Sıvı Soğutma Yerine Çay Koyduk!</b>
                                            <p style="font-size: 12px; color: #6b7280;">850 Bin Görüntülenme • 5 gün önce</p>
                                        </div>
                                    </div>
                                `;
                            } else if (site === 'news') {
                                urlInput.value = 'https://www.simhaber.com';
                                content.innerHTML = `
                                    <div style="width: 100%; display: flex; flex-direction: column; gap: 14px;">
                                        <div style="font-size: 16px; font-weight: 700; color: #1e40af;">📰 SimHaber - Teknoloji ve Borsa</div>
                                        <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">
                                            <h4 style="color: #111;">SimCoin Borsasında Tarihi Rekor!</h4>
                                            <p style="font-size: 12px; color: #4b5563;">Kripto madencileri ekran kartlarına hücum etti. Fiyatlar artıyor.</p>
                                        </div>
                                        <div>
                                            <h4 style="color: #111;">Uzmanlar Uyardı: Overclock Yaparken Sıcaklığa Dikkat</h4>
                                            <p style="font-size: 12px; color: #4b5563;">105°C'yi aşan sistemlerin Mavi Ekran vererek çöktüğü tespit edildi.</p>
                                        </div>
                                    </div>
                                `;
                            } else if (site === 'wiki') {
                                urlInput.value = 'https://www.wikibilgi.org/donanim';
                                content.innerHTML = `
                                    <div style="width: 100%; display: flex; flex-direction: column; gap: 12px;">
                                        <h3 style="color: #111;">💡 Donanım Sözlüğü</h3>
                                        <p style="font-size: 12px; color: #374151;"><b>Overclock Nedir?</b> Parçaların fabrika ayarlarındaki hız limitlerini aşarak daha yüksek performans elde etme işlemidir. Fazla ısı üretir.</p>
                                        <p style="font-size: 12px; color: #374151;"><b>Sıvı Soğutma:</b> Radyatör ve su pompası yardımıyla işlemci ısısını hızlıca tahliye eder.</p>
                                    </div>
                                `;
                            } else if (site === 'crypto') {
                                this.openMiner();
                            }
                        });
                    });
                };

                homeBtn.addEventListener('click', showHome);
                refreshBtn.addEventListener('click', showHome);
                bindHomeEvents();
            }
        });
    }

    // ==========================================================================
    // 5. UYGULAMA: Dosya Gezgini & Not Defteri
    // ==========================================================================
    openFiles() {
        const html = `
            <div class="file-explorer">
                <div class="file-item" data-action="notes">
                    <span class="file-icon">📝</span>
                    <span class="file-name">Notlar.txt</span>
                </div>
                <div class="file-item" data-action="crypto-wallet">
                    <span class="file-icon">🔑</span>
                    <span class="file-name">KriptoCuzdan.key</span>
                </div>
                <div class="file-item" data-action="system32">
                    <span class="file-icon">⚠️</span>
                    <span class="file-name" style="color: #f85149;">System32</span>
                </div>
                <div class="file-item" data-action="photos">
                    <span class="file-icon">🖼️</span>
                    <span class="file-name">Resimlerim</span>
                </div>
            </div>
        `;

        window.System.openWindow('files', 'Dosya Gezgini', '📁', html, {
            width: 380,
            height: 320,
            onInit: (winEl) => {
                winEl.querySelectorAll('.file-item').forEach(item => {
                    item.addEventListener('click', () => {
                        window.Sound.playClick();
                        const act = item.getAttribute('data-action');
                        if (act === 'notes') {
                            this.openNotepad();
                        } else if (act === 'crypto-wallet') {
                            window.System.showToast('Cüzdan Anahtarı', 'Yedek Anahtar: 0x99B... Paran güvende!', '🔑');
                        } else if (act === 'photos') {
                            window.System.showToast('Resimler', 'Klasörde 4 adet ekran görüntüsü var.', '🖼️');
                        } else if (act === 'system32') {
                            if (confirm('DİKKAT: System32 işletim sisteminin kalbidir! Silmek istediğine emin misin?')) {
                                window.System.triggerBsod('SYSTEM32_DELETED_BY_USER');
                            }
                        }
                    });
                });
            }
        });
    }

    openNotepad() {
        const html = `
            <div style="display: flex; flex-direction: column; height: 100%;">
                <div class="notepad-toolbar">
                    <button class="np-btn" id="np-save-btn">💾 Kaydet</button>
                    <button class="np-btn" id="np-clear-btn">Temizle</button>
                </div>
                <textarea class="notepad-textarea" id="notepad-text">${window.System.notesContent}</textarea>
            </div>
        `;

        window.System.openWindow('notepad', 'Not Defteri', '📝', html, {
            width: 400,
            height: 380,
            onInit: (winEl) => {
                const saveBtn = winEl.querySelector('#np-save-btn');
                const clearBtn = winEl.querySelector('#np-clear-btn');
                const text = winEl.querySelector('#notepad-text');

                saveBtn.addEventListener('click', () => {
                    window.Sound.playClick();
                    window.System.notesContent = text.value;
                    window.System.saveState();
                    window.System.showToast('Kaydedildi', 'Not defteri içeriği hafızaya kaydedildi.', '💾');
                });

                clearBtn.addEventListener('click', () => {
                    text.value = '';
                });
            }
        });
    }

    // ==========================================================================
    // 6. UYGULAMA: Sistem Ayarları & Kişiselleştirme
    // ==========================================================================
    openSettings() {
        const html = `
            <div class="settings-container">
                <div class="settings-group">
                    <span class="settings-title">🎨 Duvar Kağıdı Seçimi</span>
                    <div class="wallpapers-grid">
                        <div class="wp-card wp-cyberpunk ${window.System.wallpaper === 'wp-cyberpunk' ? 'active' : ''}" data-wp="wp-cyberpunk">Cyberpunk Neon</div>
                        <div class="wp-card wp-bliss ${window.System.wallpaper === 'wp-bliss' ? 'active' : ''}" data-wp="wp-bliss">Windows XP Tepeleri</div>
                        <div class="wp-card wp-retro95 ${window.System.wallpaper === 'wp-retro95' ? 'active' : ''}" data-wp="wp-retro95">Retro 95 Turkuaz</div>
                        <div class="wp-card wp-darkglass ${window.System.wallpaper === 'wp-darkglass' ? 'active' : ''}" data-wp="wp-darkglass">Koyu Cam</div>
                    </div>
                </div>

                <div class="settings-group">
                    <span class="settings-title">🔊 Ses Kontrolü</span>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span id="mute-label">${window.Sound.enabled ? 'Açık 🔊' : 'Sessiz 🔇'}</span>
                        <button class="np-btn" id="toggle-mute-btn">${window.Sound.enabled ? 'Sessize Al' : 'Sesi Aç'}</button>
                    </div>
                </div>

                <div class="settings-group">
                    <span class="settings-title">⚙️ Oyun Sıfırlama</span>
                    <button class="power-btn" id="reset-game-btn" style="width: fit-content;">Tüm İlerlemeyi Sıfırla</button>
                </div>
            </div>
        `;

        window.System.openWindow('settings', 'Sistem Ayarları', '⚙️', html, {
            width: 420,
            height: 420,
            onInit: (winEl) => {
                // Duvar kağıtları
                winEl.querySelectorAll('.wp-card').forEach(card => {
                    card.addEventListener('click', () => {
                        window.Sound.playClick();
                        winEl.querySelectorAll('.wp-card').forEach(c => c.classList.remove('active'));
                        card.classList.add('active');
                        const wp = card.getAttribute('data-wp');
                        window.System.applyWallpaper(wp);
                    });
                });

                // Ses aç/kapat
                const muteBtn = winEl.querySelector('#toggle-mute-btn');
                const muteLabel = winEl.querySelector('#mute-label');
                muteBtn.addEventListener('click', () => {
                    const isEnabled = window.Sound.toggleMute();
                    muteLabel.textContent = isEnabled ? 'Açık 🔊' : 'Sessiz 🔇';
                    muteBtn.textContent = isEnabled ? 'Sessize Al' : 'Sesi Aç';
                });

                // Sıfırlama
                winEl.querySelector('#reset-game-btn').addEventListener('click', () => {
                    if (confirm('Tüm donanımlar ve paranız sıfırlanacak. Devam edilsin mi?')) {
                        window.System.resetState();
                    }
                });
            }
        });
    }

    // Canlı açık pencereleri güncelle (Ticker tarafından çağrılır)
    updateLiveViews() {
        // Madenci penceresi açıksa istatistikleri güncelle
        const minerWin = document.getElementById('win-miner');
        if (minerWin) {
            const specs = window.System.getCurrentSpecs();
            const ocFactor = 1 + (window.System.overclock / 100);
            const hashrate = (specs.gpu.hashrate + specs.cpu.hashrate) * ocFactor;

            const hashEl = minerWin.querySelector('#miner-hashrate');
            const coinEl = minerWin.querySelector('#miner-coin-bal');
            const priceEl = minerWin.querySelector('#miner-coin-price');
            const totalEl = minerWin.querySelector('#miner-total-val');
            const tempEl = minerWin.querySelector('#miner-temp-val');
            const fillEl = minerWin.querySelector('#miner-temp-fill');
            const fanEl = minerWin.querySelector('#miner-fan-val');

            if (hashEl) hashEl.textContent = `${hashrate.toFixed(1)} MH/s`;
            if (coinEl) coinEl.textContent = `${window.System.simCoin.toFixed(4)} SC`;
            if (priceEl) priceEl.textContent = `$${window.System.coinPrice.toFixed(2)}`;
            if (totalEl) totalEl.textContent = `$${(window.System.simCoin * window.System.coinPrice).toFixed(2)}`;
            if (tempEl) tempEl.textContent = `${Math.round(window.System.temperature)}°C`;
            if (fillEl) fillEl.style.width = `${Math.min(100, (window.System.temperature / 110) * 100)}%`;
            if (fanEl) fanEl.textContent = `Fan: %${Math.round(Math.min(100, Math.max(20, (window.System.temperature - 30) * 1.5)))}`;
        }
    }
}

window.Apps = new AppManager();
