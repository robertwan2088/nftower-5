// ==================== 个人中心 JavaScript ====================

// ==================== 全局变量 ====================
let currentSection = 'overview';

// ==================== DOM 元素 ====================
const profileMenuItems = document.querySelectorAll('.profile-menu-item');
const profileSections = document.querySelectorAll('.profile-section');
const periodSelect = document.querySelector('.period-select');
const filterBtns = document.querySelectorAll('.activity-filters .filter-btn');

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initProfileMenu();
    initPeriodSelect();
    initActivityFilters();
    initActionButtons();
    initSettingsForm();
});

// ==================== 个人中心菜单 ====================
function initProfileMenu() {
    profileMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            switchSection(section);
        });
    });
}

function switchSection(section) {
    currentSection = section;

    // 更新菜单状态
    profileMenuItems.forEach(item => {
        item.classList.toggle('active', item.dataset.section === section);
    });

    // 更新内容区域
    profileSections.forEach(sec => {
        sec.classList.toggle('active', sec.id === `section-${section}`);
    });

    // 加载区域数据
    loadSectionData(section);
}

function loadSectionData(section) {
    console.log(`加载 ${section} 区域数据...`);
    // 实际项目中会调用 API 获取对应区域的数据
}

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

    // 模拟数据加载
    setTimeout(() => {
        showToast('数据已更新');
    }, 1000);
}

// ==================== 活动筛选 ====================
function initActivityFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            applyActivityFilter(filter);
        });
    });
}

function applyActivityFilter(filter) {
    // 更新按钮状态
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    // 筛选活动记录
    const tableRows = document.querySelectorAll('.activity-table tbody tr');
    tableRows.forEach(row => {
        const activityType = row.querySelector('.activity-type');
        if (filter === 'all' || activityType.classList.contains(filter)) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });

    showToast(`已筛选: ${filter === 'all' ? '全部' : filter === 'buy' ? '购买' : filter === 'sell' ? '出售' : '转账'}`);
}

// ==================== 操作按钮 ====================
function initActionButtons() {
    // 编辑资料按钮
    const editProfileBtn = document.querySelector('.profile-actions .btn-primary');
    if (editProfileBtnBtn) {
        editProfileBtn.addEventListener('click', function() {
            showToast('打开编辑资料表单...');
        });
    }

    // 分享按钮
    const shareBtn = document.querySelector('.profile-actions .btn-secondary');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: 'Felix 的 NFT7 个人主页',
                    url: window.location.href
                });
            } else {
                showToast('链接已复制到剪贴板');
            }
        });
    }

    // 退出登录按钮
    const logoutBtn = document.querySelector('.profile-actions .btn-secondary.danger');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('确定要退出登录吗？')) {
                showToast('正在退出登录...');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
    }

    // 编辑头像按钮
    const editAvatarBtn = document.querySelector('.btn-edit-avatar');
    if (editAvatarBtn) {
        editAvatarBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    showToast('正在上传头像...');
                    // 实际项目中会上传头像
                }
            });
            input.click();
        });
    }

    // 移除收藏按钮
    const removeFavoriteBtns = document.querySelectorAll('.btn-remove-favorite');
    removeFavoriteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.nft-card');
            const title = card.querySelector('.nft-title').textContent;
            if (confirm(`确定要从收藏夹移除 "${title}" 吗？`)) {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    card.remove();
                    showToast('已移除');
                }, 300);
            }
        });
    });

    // 出价管理按钮
    const offerActions = document.querySelectorAll('.offer-actions .btn-action-sm');
    offerActions.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            const offerItem = this.closest('.offer-item');
            const title = offerItem.querySelector('.offer-title').textContent;

            if (action === '提高出价' || action === '重新出价') {
                const newPrice = prompt(`为 "${title}" 输入新的出价金额：`);
                if (newPrice && !isNaN(newPrice)) {
                    showToast(`出价已更新: ¥${newPrice}`);
                }
            } else if (action === '取消出价') {
                if (confirm(`确定要取消对 "${title}" 的出价吗？`)) {
                    showToast('出价已取消');
                    offerItem.style.opacity = '0.5';
                }
            }
        });
    });

    // 查看活动按钮
    const viewActivityBtns = document.querySelectorAll('.activity-table .btn-action-sm');
    viewActivityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const nft = row.cells[1].textContent;
            showToast(`查看活动详情: ${nft}`);
        });
    });
}

// ==================== 设置表单 ====================
function initSettingsForm() {
    const form = document.querySelector('.settings-form');
    if (!form) return;

    // 保存按钮
    const saveBtn = form.querySelector('.form-actions .btn-primary');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveSettings();
        });
    }

    // 取消按钮
    const cancelBtn = form.querySelector('.form-actions .btn-secondary:not(.danger)');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('确定要取消吗？未保存的更改将丢失。')) {
                form.reset();
                showToast('已取消');
            }
        });
    }
}

function saveSettings() {
    showToast('正在保存设置...');

    // 获取表单数据
    const formData = {
        username: document.querySelector('input[type="text"]').value,
        email: document.querySelector('input[type="email"]').value,
        bio: document.querySelector('textarea').value
    };

    console.log('保存设置:', formData);

    // 模拟保存
    setTimeout(() => {
        showToast('设置已保存！');
    }, 1500);
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
    const statValues = document.querySelectorAll('.stat-value');
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

// ==================== 概览卡片数字动画 ====================
function animateOverviewCards() {
    const cardValues = document.querySelectorAll('.overview-card .card-value');
    cardValues.forEach(card => {
        const text = card.textContent;
        if (text.includes('¥')) {
            const numericValue = parseFloat(text.replace(/[¥,]/g, ''));
            if (!isNaN(numericValue)) {
                animateValue(card, 0, numericValue, 2000);
                setTimeout(() => {
                    card.textContent = '¥ ' + numericValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }, 2000);
            }
        } else {
            const numericValue = parseInt(text.replace(/,/g, ''));
            if (!isNaN(numericValue)) {
                animateValue(card, 0, numericValue, 2000);
            }
        }
    });
}

// 切换到概览区域时动画
const originalSwitchSection = switchSection;
window.switchSection = function(section) {
    originalSwitchSection.call(this, section);
    if (section === 'overview') {
        setTimeout(animateOverviewCards, 100);
    }
};

// ==================== 卡片动画 ====================
function animateCards() {
    const cards = document.querySelectorAll('.collection-item, .nft-card');
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

// 切换区域时动画卡片
const originalSwitchSection = window.switchSection;
window.switchSection = function(section) {
    if (section === 'collection' || section === 'favorites') {
        setTimeout(animateCards, 100);
    }
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

// ==================== 实时数据更新 ====================
function updateRealTimeData() {
    // 更新统计数据
    const stats = document.querySelectorAll('.profile-stats .stat-value');
    stats.forEach(stat => {
        const text = stat.textContent;
        if (text.includes(',')) {
            const numericValue = parseInt(text.replace(/,/g, ''));
            const newValue = numericValue + Math.floor(Math.random() * 5) - 2;
            stat.textContent = newValue.toLocaleString();
        }
    });
}

// 每30秒更新一次数据
setInterval(updateRealTimeData, 30000);

// ==================== 页面滚动效果 ====================
window.addEventListener('scroll', function() {
    const profileSidebar = document.querySelector('.profile-sidebar');
    if (profileSidebar) {
        if (window.scrollY > 200) {
            profileSidebar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            profileSidebar.style.boxShadow = 'var(--shadow)';
        }
    }
});

// ==================== 控制台信息 ====================
console.log('%c 个人中心已加载 ', 'background: #6c5ce7; color: white; padding: 5px 10px; border-radius: 5px;');
console.log('当前区域:', currentSection);

// ==================== 页面加载完成 ====================
window.addEventListener('load', function() {
    console.log('个人中心页面加载完成');
    animateStats();
    animateOverviewCards();
});
