// ==================== 个人中心扩展 JavaScript ====================

// ==================== DOM 元素 ====================
const periodSelect = document.getElementById('periodSelect');
const viewToggle = document.querySelectorAll('.view-toggle .view-btn');
const filterBtns = document.querySelectorAll('.tab-filters .filter-btn');
const pageBtns = document.querySelectorAll('.pagination .page-btn');
const toggleSwitches = document.querySelectorAll('.setting-toggle');
const sectionLinks = document.querySelectorAll('.dropdown-menu-item, .user-dropdown-action, .setting-item, .privacy-item, .security-item');

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initPeriodSelect();
    initViewToggle();
    initFilterBtns();
    initPagination();
    initToggleSwitches();
    initSectionLinks();
    initSocialLogin();
    initChartAnimations();
});

// ==================== 时间周期选择 ====================
function initPeriodSelect() {
    if (periodSelect) {
        periodSelect.addEventListener('change', function() {
            const period = this.value;
            updateOverviewData(period);
        });
    }
}

function updateOverviewData(period) {
    console.log(`更新概览数据: ${period}`);
    showToast(`正在加载最近${period === '7days' ? '7天' : period === '30days' ? '30天' : '90天'}的数据...`);

    // 模拟数据更新
    setTimeout(() => {
        showToast('数据已更新');
        animateCards();
    }, 1000);
}

// ==================== 视图切换 ====================
function initViewToggle() {
    viewToggle.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            switchView(view);
        });
    });
}

function switchView(view) {
    // 更新按钮状态
    viewToggle.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    // 更新网格视图
    const grid = document.querySelector('.collection-grid, .favorites-grid, .nft-grid');
    if (grid) {
        if (view === 'list') {
            grid.classList.add('list-view');
        } else {
            grid.classList.remove('list-view');
        }
    }

    showToast(`已切换到${view === 'grid' ? '网格' : '列表'}视图`);
    animateCards();
}

// ==================== 筛选按钮 ====================
function initFilterBtns() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            applyFilter(filter);
        });
    });
}

function applyFilter(filter) {
    // 更新按钮状态
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    showToast(`已筛选: ${filter === 'all' ? '全部' : filter}`);
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

let currentPage = 1;

function goToPage(page) {
    if (page < 1 || page > 99) return;

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
    pageBtns[pageBtns.length - 1].disabled = page === 99;

    showToast(`跳转到第 ${page} 页`);
    animateCards();
}

// ==================== 切换开关 ====================
function initToggleSwitches() {
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
            const isActive = this.classList.contains('active');
            const settingLabel = this.closest('.setting-item, .privacy-item')?.querySelector('.setting-label')?.textContent;

            if (settingLabel) {
                showToast(`${settingLabel} 已${isActive ? '开启' : '关闭'}`);
            }
        });
    });
}

// ==================== 章节链接 ====================
function initSectionLinks() {
    sectionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const section = this.dataset.section;
            const action = this.dataset.action;

            if (section) {
                e.preventDefault();
                switchSection(section);
            } else if (action) {
                e.preventDefault();
                handleAction(action);
            }
        });
    });
}

function switchSection(section) {
    // 平滑滚动到对应部分
    const sectionEl = document.getElementById(`section-${section}`);
    if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: 'smooth' });
    }

    // 更新菜单高亮
    const menuItems = document.querySelectorAll('.profile-menu-item');
    menuItems.forEach(item => {
        item.classList.toggle('active', item.dataset.section === section);
    });

    showToast(`已切换到 ${getSectionName(section)}`);
}

function getSectionName(section) {
    const names = {
        'overview': '概览',
        'collection': '我的收藏',
        'favorites': '收藏夹',
        'activity': '活动记录',
        'offers': '出价管理',
        'earnings': '收益',
        'nfts': '我的 NFT',
        'staking': '质押',
        'settings': '账户设置',
        'security': '安全设置',
        'notifications': '通知设置',
        'privacy': '隐私设置'
    };
    return names[section] || section;
}

function handleAction(action) {
    switch(action) {
        case 'profile':
            showToast('打开编辑资料...');
            break;
        case 'security':
            showToast('打开账户安全...');
            break;
        case 'notifications':
            showToast('打开通知设置...');
            break;
        case 'privacy':
            showToast('打开隐私设置...');
            break;
        case 'help':
            showToast('前往帮助中心...');
            break;
        case 'logout':
            logout();
            break;
        default:
            showToast(`打开${action}...`);
    }
}

// ==================== 社交登录 ====================
function initSocialLogin() {
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const provider = this.textContent.trim();
            showToast(`正在使用 ${provider} 登录...`);

            setTimeout(() => {
                showToast(`${provider} 登录成功！`);
                closeModal('loginModal');
                closeModal('registerModal');
                showLoggedInState();
            }, 1500);
        });
    });
}

// ==================== 图表动画 ====================
function initChartAnimations() {
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// ==================== 卡片动画 ====================
function animateCards() {
    const cards = document.querySelectorAll('.collection-item, .nft-card, .offer-item, .stake-item, .activity-item, .earning-item, .summary-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
        }, 100);
    });
}

// ==================== Toast 提示 ====================
function showToast(message, duration = 3000) {
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
        top: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
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
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// ==================== 控制台信息 ====================
console.log('%c 个人中心扩展已加载 ', 'background: #6c5ce7; color: white; padding: 5px 10px; border-radius: 5px;');
console.log('当前部分:', window.location.hash || 'overview');
console.log('功能:');
console.log('  - 9 个主要内容模块');
console.log('  - 完整的设置功能');
console.log('  - 详细的收益记录');
console.log('  - 丰富的活动追踪');

// ==================== 页面加载完成 ====================
window.addEventListener('load', function() {
    console.log('个人中心页面加载完成');
    animateCards();
    initChartAnimations();
});
