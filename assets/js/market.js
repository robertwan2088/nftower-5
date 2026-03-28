// ==================== 市场页面 JavaScript ====================

// ==================== 全局变量 ====================
let currentView = 'grid';
let currentFilter = 'all';
let currentSort = 'popular';
let currentPage = 1;

// ==================== DOM 元素 ====================
const nftGrid = document.getElementById('nftGrid');
const searchInput = document.getElementById('searchInput');
const viewBtns = document.querySelectorAll('.view-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortBtns = document.querySelectorAll('.sort-btn');
const sidebar = document.querySelector('.sidebar');
const filtersToggle = document.querySelector('.btn-filters-toggle');
const applyFiltersBtn = document.querySelector('.btn-apply-filters');
const resetFiltersBtn = document.querySelector('.btn-reset-filters');
const pageBtns = document.querySelectorAll('.page-btn:not([disabled]):not(.ellipsis)');
const favoriteButtons = document.querySelectorAll('.btn-favorite');

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initViewToggle();
    initFilters();
    initSort();
    initSearch();
    initFiltersToggle();
    initPagination();
    initFavoriteButtons();
    initPriceSlider();
});

// ==================== 视图切换 ====================
function initViewToggle() {
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            switchView(view);
        });
    });
}

function switchView(view) {
    currentView = view;

    // 更新按钮状态
    viewBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    // 更新网格视图
    if (view === 'list') {
        nftGrid.classList.add('list-view');
    } else {
        nftGrid.classList.remove('list-view');
    }

    // 添加动画
    const cards = nftGrid.querySelectorAll('.nft-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
        }, 10);
    });
}

// ==================== 筛选功能 ====================
function initFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            applyCategoryFilter(filter);
        });
    });

    applyFiltersBtn.addEventListener('click', applyAllFilters);
    resetFiltersBtn.addEventListener('click', resetFilters);
}

function applyCategoryFilter(filter) {
    currentFilter = filter;

    // 更新按钮状态
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    // 筛选卡片
    const cards = nftGrid.querySelectorAll('.nft-card');
    cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });

    // 更新结果数量
    updateResultsCount();
}

function applyAllFilters() {
    showToast('筛选条件已应用');

    // 关闭侧边栏（移动端）
    if (window.innerWidth <= 1200) {
        sidebar.classList.remove('active');
    }
}

function resetFilters() {
    // 重置类别筛选
    currentFilter = 'all';
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === 'all');
    });

    // 重置排序
    currentSort = 'popular';
    sortBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === 'popular');
    });

    // 重置价格滑块
    document.getElementById('priceSlider').value = 5000;

    // 重置复选框
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });

    // 重置输入框
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });

    // 重置搜索
    searchInput.value = '';

    // 显示所有卡片
    const cards = nftGrid.querySelectorAll('.nft-card');
    cards.forEach(card => {
        card.style.display = 'block';
    });

    showToast('筛选条件已重置');
}

// ==================== 排序功能 ====================
function initSort() {
    sortBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sort = this.dataset.sort;
            applySort(sort);
        });
    });
}

function applySort(sort) {
    currentSort = sort;

    // 更新按钮状态
    sortBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === sort);
    });

    // 获取所有可见卡片
    const cards = Array.from(nftGrid.querySelectorAll('.nft-card:not([style*="display: none"])'));

    // 根据排序方式排序
    cards.sort((a, b) => {
        switch(sort) {
            case 'price-low':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            case 'price-high':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            case 'recent':
                return a.dataset.status === 'new' ? -1 : 1;
            case 'popular':
            default:
                return a.dataset.status === 'rare' ? -1 : 1;
        }
    });

    // 重新排列卡片
    cards.forEach(card => {
        nftGrid.appendChild(card);
    });

    // 添加动画
    cards.forEach((card, index) => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s forwards`;
        }, 10);
    });
}

// ==================== 搜索功能 ====================
function initSearch() {
    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.toLowerCase().trim();

        const cards = nftGrid.querySelectorAll('.nft-card');
        cards.forEach(card => {
            const title = card.querySelector('.nft-title').textContent.toLowerCase();
            const creator = card.querySelector('.nft-creator span').textContent.toLowerCase();

            if (query === '' || title.includes(query) || creator.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        updateResultsCount();
    }, 300));
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== 侧边栏切换 ====================
function initFiltersToggle() {
    if (filtersToggle) {
        filtersToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });

        // 点击外部关闭
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !filtersToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }

    // 添加关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.className = 'sidebar-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.cssText = `
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(108, 92, 231, 0.1);
        border: none;
        font-size: 1.25rem;
        color: var(--primary-color);
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1001;
    `;

    closeBtn.addEventListener('click', function() {
        sidebar.classList.remove('active');
    });

    sidebar.appendChild(closeBtn);

    // 在移动端显示关闭按钮
    const showCloseBtn = () => {
        if (window.innerWidth <= 1200 && sidebar.classList.contains('active')) {
            closeBtn.style.display = 'flex';
        } else {
            closeBtn.style.display = 'none';
        }
    };

    showCloseBtn();
    window.addEventListener('resize', showCloseBtn);
}

// ==================== 分页功能 ====================
function initPagination() {
    pageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;

            const page = parseInt(this.textContent) || (this.querySelector('.fa-chevron-right') ? currentPage + 1 : currentPage - 1);
            goToPage(page);
        });
    });
}

function goToPage(page) {
    if (page < 1 || page > 100) return;

    currentPage = page;

    // 更新按钮状态
    pageBtns.forEach(btn => {
        const btnPage = parseInt(btn.textContent);
        if (!isNaN(btnPage)) {
            btn.classList.toggle('active', btnPage === page);
        }
    });

    // 更新禁用状态
    pageBtns[0].disabled = page === 1;
    pageBtns[pageBtns.length - 1].disabled = page === 100;

    // 加载新页面数据（实际项目中会调用 API）
    loadPageData(page);
}

function loadPageData(page) {
    showToast(`正在加载第 ${page} 页...`);

    // 模拟加载延迟
    const cards = nftGrid.querySelectorAll('.nft-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        setTimeout(() => {
            card.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s forwards`;
        }, 300);
    });
}

// ==================== 收藏按钮 ====================
function initFavoriteButtons() {
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');

            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showToast('已添加到收藏');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showToast('已取消收藏');
            }
        });
    });
}

// ==================== 价格滑块 ====================
function initPriceSlider() {
    const slider = document.getElementById('priceSlider');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');

    if (slider) {
        slider.addEventListener('input', function() {
            const value = this.value;

            // 更新价格输入框
            if (maxPrice) {
                maxPrice.value = value;
            }

            // 筛选价格范围内的卡片
            filterByPrice(0, parseInt(value));
        });
    }
}

function filterByPrice(min, max) {
    const cards = nftGrid.querySelectorAll('.nft-card');
    cards.forEach(card => {
        const price = parseInt(card.dataset.price);

        if (price >= min && price <= max) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    updateResultsCount();
}

// ==================== 更新结果数量 ====================
function updateResultsCount() {
    const visibleCards = nftGrid.querySelectorAll('.nft-card:not([style*="display: none"])');
    const count = visibleCards.length;
    const resultsCount = document.querySelector('.results-count');

    if (resultsCount) {
        resultsCount.textContent = `显示 ${count} 个结果`;
    }
}

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

// ==================== 键盘快捷键 ====================
document.addEventListener('keydown', function(e) {
    // ESC 键关闭侧边栏
    if (e.key === 'Escape') {
        sidebar.classList.remove('active');
    }

    // Ctrl/Cmd + K 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});

// ==================== 控制台信息 ====================
console.log('%c 市场页面已加载 ', 'background: #6c5ce7; color: white; padding: 5px 10px; border-radius: 5px;');
console.log('快捷键:');
console.log('  Ctrl/Cmd + K - 聚焦搜索框');
console.log('  ESC - 关闭侧边栏');
