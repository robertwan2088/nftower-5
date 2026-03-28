// ==================== 资产中心 JavaScript ====================

// ==================== 全局变量 ====================
let currentTab = 'my-assets';

// ==================== DOM 元素 ====================
const assetsNavBtns = document.querySelectorAll('.assets-nav-btn');
const assetsTabs = document.querySelectorAll('.assets-tab');
const sortSelect = document.querySelector('.sort-select');
const filterSelects = document.querySelectorAll('.filter-select');

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initAssetsNav();
    initSortSelect();
    initFilterSelects();
    initActionButtons();
});

// ==================== 资产导航 ====================
function initAssetsNav() {
    assetsNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchTab(tab);
        });
    });
}

function switchTab(tab) {
    currentTab = tab;

    // 更新按钮状态
    assetsNavBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // 更新标签页
    assetsTabs.forEach(tabEl => {
        tabEl.classList.toggle('active', tabEl.id === `tab-${tab}`);
    });

    // 加载标签页数据
    loadTabData(tab);
}

function loadTabData(tab) {
    switch(tab) {
        case 'my-assets':
            loadMyAssets();
            break;
        case 'staking':
            loadStaking();
            break;
        case 'earnings':
            loadEarnings();
            break;
        case 'history':
            loadHistory();
            break;
    }
}

// ==================== 我的 NFT ====================
function loadMyAssets() {
    console.log('加载我的 NFT 数据...');
    // 实际项目中会调用 API 获取数据
}

function initSortSelect() {
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            sortAssets(sortBy);
        });
    }
}

function sortAssets(sortBy) {
    const assetsGrid = document.querySelector('.assets-grid');
    if (!assetsGrid) return;

    const cards = Array.from(assetsGrid.querySelectorAll('.asset-card'));

    cards.sort((a, b) => {
        switch(sortBy) {
            case 'price-high':
                // 根据价格排序（需要从卡片中提取价格）
                return 0;
            case 'price-low':
                return 0;
            case 'name':
                const titleA = a.querySelector('.asset-title').textContent;
                const titleB = b.querySelector('.asset-title').textContent;
                return titleA.localeCompare(titleB);
            case 'recent':
            default:
                return 0;
        }
    });

    // 重新排列
    cards.forEach(card => {
        assetsGrid.appendChild(card);
    });

    // 添加动画
    cards.forEach((card, index) => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = `fadeIn 0.3s ease ${index * 0.1}s forwards`;
        }, 10);
    });

    showToast(`已按${sortBy === 'price-high' ? '价格高到低' : sortBy === 'price-low' ? '价格低到高' : sortBy === 'name' ? '名称' : '最新'}排序`);
}

// ==================== 质押 ====================
function loadStaking() {
    console.log('加载质押数据...');
    // 实际项目中会调用 API 获取数据
}

// ==================== 收益 ====================
function loadEarnings() {
    console.log('加载收益数据...');
    // 实际项目中会调用 API 获取数据
}

// ==================== 交易记录 ====================
function loadHistory() {
    console.log('加载交易记录...');
    // 实际项目中会调用 API 获取数据
}

function initFilterSelects() {
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            const filterType = this.parentElement.classList.contains('tab-filters') ? 'type' : 'time';
            const filterValue = this.value;
            filterHistory(filterType, filterValue);
        });
    });
}

function filterHistory(type, value) {
    const historyList = document.querySelector('.history-list');
    if (!historyList) return;

    const items = historyList.querySelectorAll('.history-item');

    items.forEach(item => {
        // 根据筛选条件显示/隐藏项目
        // 实际项目中需要更复杂的筛选逻辑
        item.style.display = 'block';
    });

    showToast(`筛选条件已更新`);
}

// ==================== 操作按钮 ====================
function initActionButtons() {
    // 详情按钮
    document.querySelectorAll('.btn-action-sm').forEach(btn => {
        if (btn.textContent === '详情') {
            btn.addEventListener('click', function() {
                const card = this.closest('.asset-card') || this.closest('.staking-pool');
                const title = card.querySelector('.asset-title, .pool-name h4').textContent;
                showToast(`查看 ${title} 详情`);
            });
        }
    });

    // 出售按钮
    document.querySelectorAll('.btn-action-sm').forEach(btn => {
        if (btn.textContent === '出售') {
            btn.addEventListener('click', function() {
                const card = this.closest('.asset-card');
                const title = card.querySelector('.asset-title').textContent;
                if (confirm(`确定要出售 "${title}" 吗？`)) {
                    showToast('已上架出售');
                }
            });
        }
    });

    // 质押按钮
    document.querySelectorAll('.btn-action-sm').forEach(btn => {
        if (btn.textContent === '质押') {
            btn.addEventListener('click', function() {
                const card = this.closest('.asset-card');
                const title = card.querySelector('.asset-title').textContent;
                showToast(`"${title}" 已质押到星际旅行者池`);
            });
        }
    });

    // 收益按钮
    document.querySelectorAll('.btn-action-sm').forEach(btn => {
        if (btn.textContent === '收益') {
            btn.addEventListener('click', function() {
                const pool = this.closest('.staking-pool');
                const title = pool.querySelector('.pool-name h4').textContent;
                showToast(`已领取 "${title}" 的收益`);
            });
        }
    });

    // 取消质押按钮
    document.querySelectorAll('.btn-action-sm.danger').forEach(btn => {
        btn.addEventListener('click', function() {
            const pool = this.closest('.staking-pool');
            const title = pool.querySelector('.pool-name h4').textContent;
            if (confirm(`确定要取消 "${title}" 的质押吗？`)) {
                showToast('已取消质押');
            }
        });
    });
}

// ==================== 数字动画 ====================
function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    const range = end - start;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + range * easeProgress);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ==================== 资产卡片动画 ====================
function animateAssetCards() {
    const cards = document.querySelectorAll('.asset-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
        }, 100);
    });
}

// 添加淡入上移动画样式
const fadeInUpStyle = document.createElement('style');
fadeInUpStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeInUpStyle);

// ==================== Toast 提示 ====================
function showToast(message) {
    // 移除现有的 toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        document.body.removeChild(existingToast);
    }

    // 创建新的 toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    // 添加样式
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: var(--dark-bg);
        color: white;
        padding: 1rem 2rem;
        border-radius: 30px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s ease;
        font-weight: 500;
    `;

    document.body.appendChild(toast);

    // 显示动画
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
        toast.style.opacity = '1';
    }, 10);

    // 3秒后隐藏
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ==================== 模拟数据更新 ====================
function updateStats() {
    // 更新统计数字
    const statValues = document.querySelectorAll('.stat-info .stat-value');
    statValues.forEach(stat => {
        const text = stat.textContent;
        if (text.includes('¥')) {
            const numericValue = parseFloat(text.replace(/[¥,]/g, ''));
            if (!isNaN(numericValue)) {
                // 添加随机波动
                const newValue = numericValue + (Math.random() - 0.5) * 100;
                stat.textContent = `¥ ${newValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
            }
        }
    });
}

// 每30秒更新一次数据
setInterval(updateStats, 30000);

// ==================== 控制台信息 ====================
console.log('%c 资产中心已加载 ', 'background: #6c5ce7; color: white; padding: 5px 10px; border-radius: 5px;');
console.log('当前标签页:', currentTab);
