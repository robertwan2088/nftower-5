// ==================== 预约页面 JavaScript ====================

// ==================== 全局变量 ====================
let currentTab = 'today';

// ==================== DOM 元素 ====================
const reserveNavBtns = document.querySelectorAll('.reserve-nav-btn');
const reserveTabs = document.querySelectorAll('.reserve-tab');
const filterSelects = document.querySelectorAll('.filter-select');
const newReserveForm = document.getElementById('newReserveForm');

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initReserveNav();
    initFilterSelects();
    initNewReserveForm();
});

// ==================== 预约导航 ====================
function initReserveNav() {
    reserveNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchTab(tab);
        });
    });
}

function switchTab(tab) {
    currentTab = tab;

    // 更新按钮状态
    reserveNavBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // 更新标签页
    reserveTabs.forEach(tabEl => {
        tabEl.classList.toggle('active', tabEl.id === `tab-${tab}`);
    });

    // 加载标签页数据
    loadTabData(tab);
}

function loadTabData(tab) {
    switch(tab) {
        case 'today':
            loadTodayReserves();
            break;
        case 'upcoming':
            loadUpcomingReserves();
            break;
        case 'new':
            // 表单页面不需要加载数据
            break;
        case 'history':
            loadHistoryReserves();
            break;
    }
}

// ==================== 今日预约 ====================
function loadTodayReserves() {
    console.log('加载今日预约数据...');
    // 实际项目中会调用 API 获取数据
}

// ==================== 我的预约 ====================
function loadUpcomingReserves() {
    console.log('加载我的预约数据...');
    // 实际项目中会调用 API 获取数据
}

// ==================== 历史记录 ====================
function loadHistoryReserves() {
    console.log('加载历史记录数据...');
    // 实际项目中会调用 API 获取数据
}

// ==================== 筛选功能 ====================
function initFilterSelects() {
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            const filterType = this.previousElementSibling?.textContent || 'filter';
            const filterValue = this.value;
            applyFilter(filterType, filterValue);
        });
    });
}

function applyFilter(filterType, filterValue) {
    console.log(`应用筛选: ${filterType} = ${filterValue}`);

    // 获取当前标签页的列表项
    const currentTabEl = document.querySelector(`.reserve-tab.active`);
    const listItems = currentTabEl.querySelectorAll('.reserve-item, .history-item');

    // 应用筛选逻辑
    listItems.forEach(item => {
        // 根据筛选条件显示/隐藏项目
        // 实际项目中需要更复杂的筛选逻辑
        item.style.display = 'flex';
    });

    showToast(`筛选条件已更新`);
}

// ==================== 新增预约表单 ====================
function initNewReserveForm() {
    if (!newReserveForm) return;

    newReserveForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitReserveForm();
    });

    // 取消按钮
    const cancelBtn = newReserveForm.querySelector('.btn-secondary');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('确定要取消吗？表单内容将不会保存。')) {
                newReserveForm.reset();
                switchTab('today');
            }
        });
    }

    // NFT 选择器
    const selectedNft = document.getElementById('selectedNft');
    if (selectedNft) {
        selectedNft.addEventListener('click', function() {
            openNftSelector();
        });
    }
}

function submitReserveForm() {
    // 获取表单数据
    const formData = new FormData(newReserveForm);
    const data = {};

    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }

    console.log('预约数据:', data);

    // 模拟提交
    showToast('正在提交预约...');

    setTimeout(() => {
        showToast('预约提交成功！');
        newReserveForm.reset();
        switchTab('today');
    }, 1500);
}

// ==================== NFT 选择器 ====================
function openNftSelector() {
    showToast('打开 NFT 选择器...');
    // 实际项目中会打开模态框或新页面
}

// ==================== 操作按钮 ====================
function initActionButtons() {
    // 查看按钮
    document.querySelectorAll('.reserve-item .btn-action-sm').forEach(btn => {
        if (btn.textContent === '查看') {
            btn.addEventListener('click', function() {
                const item = this.closest('.reserve-item');
                const title = item.querySelector('.reserve-title, .nft-title').textContent;
                showToast(`查看: ${title}`);
            });
        }
    });

    // 取消按钮
    document.querySelectorAll('.reserve-item .btn-action-sm.danger').forEach(btn => {
        if (btn.textContent === '取消') {
            btn.addEventListener('click', function() {
                const item = this.closest('.reserve-item');
                const title = item.querySelector('.reserve-title').textContent;
                if (confirm(`确定要取消 "${title}" 吗？`)) {
                    showToast('预约已取消');
                    item.style.opacity = '0.5';
                }
            });
        }
    });

    // 进入按钮
    document.querySelectorAll('.reserve-item .btn-action-sm').forEach(btn => {
        if (btn.textContent === '进入') {
            btn.addEventListener('click', function() {
                showToast('正在进入会议室...');
            });
        }
    });

    // 详情按钮
    document.querySelectorAll('.reserve-item .btn-action-sm').forEach(btn => {
        if (btn.textContent === '详情') {
            btn.addEventListener('click', function() {
                const item = this.closest('.reserve-item');
                const title = item.querySelector('.nft-title').textContent;
                showToast(`查看预约详情: ${title}`);
            });
        }
    });

    // 回顾按钮
    document.querySelectorAll('.reserve-item .btn-action-sm').forEach(btn => {
        if (btn.textContent === '回顾') {
            btn.addEventListener('click', function() {
                const item = this.closest('.reserve-item');
                const title = item.querySelector('.nft-title').textContent;
                showToast(`回顾: ${title}`);
            });
        }
    });

    // 提醒按钮
    document.querySelectorAll('.reserve-item .btn-action-sm').forEach(btn => {
        if (btn.textContent === '提醒') {
            btn.addEventListener('click', function() {
                showToast('提醒已设置');
            });
        }
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

// ==================== 统计数字动画 ====================
function animateStats() {
    const statValues = document.querySelectorAll('.stat-info .stat-value');
    statValues.forEach(stat => {
        const text = stat.textContent;
        if (text.includes('%')) {
            const numericValue = parseFloat(text.replace('%', ''));
            if (!isNaN(numericValue)) {
                animateValue(stat, 0, numericValue, 1500);
                setTimeout(() => {
                    stat.textContent = numericValue.toFixed(1) + '%';
                }, 1500);
            }
        } else {
            const numericValue = parseInt(text.replace(/,/g, ''));
            if (!isNaN(numericValue)) {
                animateValue(stat, 0, numericValue, 1500);
            }
        }
    });
}

// 页面加载时动画统计数字
setTimeout(animateStats, 300);

// ==================== 预约列表动画 ====================
function animateReserveItems() {
    const items = document.querySelectorAll('.reserve-item, .history-item');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.animation = 'none';
        setTimeout(() => {
            item.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
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

// 切换标签页时动画列表
const originalSwitchTab = switchTab;
window.switchTab = function(tab) {
    originalSwitchTab.call(this, tab);
    setTimeout(animateReserveItems, 100);
};

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

// ==================== 实时时间更新 ====================
function updateCurrentTime() {
    const now = new Date();

    // 更新当前时间显示（如果有的话）
    const currentTimeElements = document.querySelectorAll('.current-time');
    currentTimeElements.forEach(el => {
        el.textContent = now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    });
}

// 每分钟更新一次时间
setInterval(updateCurrentTime, 60000);

// ==================== 预约提醒检查 ====================
function checkReserveReminders() {
    // 检查是否有即将开始的预约
    console.log('检查预约提醒...');

    // 实际项目中会调用 API 检查即将开始的预约
    // 并在需要时发送提醒通知
}

// 每5分钟检查一次提醒
setInterval(checkReserveReminders, 300000);

// ==================== 控制台信息 ====================
console.log('%c 预约页面已加载 ', 'background: #6c5ce7; color: white; padding: 5px 10px; border-radius: 5px;');
console.log('当前标签页:', currentTab);
console.log('快捷键:');
console.log('  ESC - 返回今日预约');
console.log('  N - 新增预约');
console.log('  H - 查看历史');

// ==================== 键盘快捷键 ====================
document.addEventListener('keydown', function(e) {
    // ESC 键返回今日预约
    if (e.key === 'Escape') {
        switchTab('today');
    }

    // N 键打开新增预约
    if (e.key === 'n' || e.key === 'N') {
        if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            switchTab('new');
        }
    }

    // H 键查看历史
    if (e.key === 'h' || e.key === 'H') {
        if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            switchTab('history');
        }
    }
});
