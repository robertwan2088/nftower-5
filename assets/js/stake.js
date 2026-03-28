// ==================== 质押页面 JavaScript ====================

// ==================== 全局变量 ====================
let currentTab = 'my-stake';

// ==================== DOM 元素 ====================
const stakeNavBtns = document.querySelectorAll('.stake-nav-btn');
const stakeTabs = document.querySelectorAll('.stake-tab');
const newStakeForm = document.getElementById('newStakeForm');

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initStakeNav();
    initNewStakeForm();
    initActionButtons();
});

// ==================== 质押导航 ====================
function initStakeNav() {
    stakeNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchTab(tab);
        });
    });
}

function switchTab(tab) {
    currentTab = tab;

    // 更新按钮状态
    stakeNavBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // 更新标签页
    stakeTabs.forEach(tabEl => {
        tabEl.classList.toggle('active', tabEl.id === `tab-${tab}`);
    });

    // 加载标签页数据
    loadTabData(tab);
}

function loadTabData(tab) {
    switch(tab) {
        case 'my-stake':
            loadMyStake();
            break;
        case 'pools':
            loadPools();
            break;
        case 'earnings':
            loadEarnings();
            break;
        case 'new-stake':
            // 表单页面不需要加载数据
            break;
    }
}

// ==================== 我的质押 ====================
function loadMyStake() {
    console.log('加载我的质押数据...');
    // 实际项目中会调用 API 获取数据
}

// ==================== 质押池 ====================
function loadPools() {
    console.log('加载质押池数据...');
    // 实际项目中会调用 API 获取数据
}

// ==================== 收益记录 ====================
function loadEarnings() {
    console.log('加载收益记录数据...');
    // 实际项目中会调用 API 获取数据
}

// ==================== 新增质押表单 ====================
function initNewStakeForm() {
    if (!newStakeForm) return;

    newStakeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitStakeForm();
    });

    // 取消按钮
    const cancelBtn = newStakeForm.querySelector('.form-actions .btn-secondary');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('确定要取消吗？表单内容将不会保存。')) {
                newStakeForm.reset();
                switchTab('my-stake');
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

    // 质押期限选项
    const periodRadios = document.querySelectorAll('input[name="period"]');
    periodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateEstimatedEarnings(this.value);
        });
    });
}

function submitStakeForm() {
    // 获取表单数据
    const formData = new FormData(newStakeForm);
    const pool = formData.get('pool');
    const period = formData.get('period');

    console.log('质押数据:', { pool, period });

    // 模拟提交
    showToast('正在提交质押...');

    setTimeout(() => {
        showToast('质押提交成功！');
        newStakeForm.reset();
        switchTab('my-stake');
    }, 1500);
}

// ==================== NFT 选择器 ====================
function openNftSelector() {
    showToast('打开 NFT 选择器...');
    // 实际项目中会打开模态框或新页面
}

// ==================== 更新预估收益 ====================
function updateEstimatedEarnings(period) {
    const earnings = {
        '30': 45.67,
        '90': 156.89,
        '180': 334.56
    };

    const earningItems = document.querySelectorAll('.estimated-earnings .earning-item');
    const periodLabels = ['30天后', '90天后', '180天后'];

    earningItems.forEach((item, index) => {
        const periodKey = ['30', '90', '180'][index];
        const value = item.querySelector('.value');
        if (period === periodKey) {
            value.style.color = 'var(--success-color)';
            value.style.fontWeight = '800';
        } else {
            value.style.color = 'var(--success-color)';
            value.style.fontWeight = '700';
            value.style.opacity = '0.6';
        }
    });
}

// ==================== 操作按钮 ====================
function initActionButtons() {
    // 收取收益按钮
    document.querySelectorAll('.stake-item .btn-action-sm').forEach(btn => {
        if (btn.textContent.includes('收取收益')) {
            btn.addEventListener('click', function() {
                const item = this.closest('.stake-item');
                const title = item.querySelector('.stake-title').textContent;
                
                // 模拟收取收益
                showToast(`正在收取 "${title}" 的收益...`);
                
                setTimeout(() => {
                    showToast('收益已到账！');
                }, 1500);
            });
        }
    });

    // 解除质押按钮
    document.querySelectorAll('.stake-item .btn-action-sm.danger').forEach(btn => {
        if (btn.textContent.includes('解除质押')) {
            btn.addEventListener('click', function() {
                const item = this.closest('.stake-item');
                const title = item.querySelector('.stake-title').textContent;
                
                if (confirm(`确定要解除 "${title}" 的质押吗？`)) {
                    showToast('正在解除质押...');
                    setTimeout(() => {
                        showToast('质押已解除');
                        item.style.opacity = '0.5';
                    }, 1500);
                }
            });
        }
    });

    // 加入质押按钮
    document.querySelectorAll('.pool-card .btn-primary').forEach(btn => {
        if (btn.textContent === '加入质押') {
            btn.addEventListener('click', function() {
                const pool = this.closest('.pool-card');
                const poolName = pool.querySelector('.pool-info h4').textContent;
                const apy = pool.querySelector('.pool-stat .value').textContent;
                
                showToast(`正在加入 "${poolName}" (${apy})`);
                setTimeout(() => {
                    switchTab('new-stake');
                }, 500);
            });
        }
    });

    // 导出按钮
    const exportBtn = document.querySelector('.earnings-table').parentElement.querySelector('.btn-action-sm');
    if (exportBtn && exportBtn.textContent.includes('导出')) {
        exportBtn.addEventListener('click', function() {
            showToast('正在导出收益记录...');
            setTimeout(() => {
                showToast('导出完成，文件已下载');
            }, 2000);
        });
    }
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
    const cardValues = document.querySelectorAll('.overview-card .card-value');
    cardValues.forEach(card => {
        const text = card.textContent;
        if (text.includes('¥')) {
            const numericValue = parseFloat(text.replace(/[¥,]/g, ''));
            if (!isNaN(numericValue)) {
                animateValue(card, 0, Math.floor(numericValue), 1500);
                setTimeout(() => {
                    card.textContent = '¥ ' + numericValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }, 1500);
            }
        } else if (text.includes('%')) {
            const numericValue = parseFloat(text.replace('%', ''));
            if (!isNaN(numericValue)) {
                animateValue(card, 0, numericValue, 1500);
                setTimeout(() => {
                    card.textContent = numericValue.toFixed(1) + '%';
                }, 1500);
            }
        } else {
            const numericValue = parseInt(text.replace(/,/g, ''));
            if (!isNaN(numericValue)) {
                animateValue(card, 0, numericValue, 1500);
            }
        }
    });
}

// 页面加载时动画统计数字
setTimeout(animateStats, 300);

// ==================== 质押列表动画 ====================
function animateStakeItems() {
    const items = document.querySelectorAll('.stake-item');
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
    setTimeout(animateStakeItems, 100);
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

// ==================== 收益计算 ====================
function calculateEarnings(apy, periodDays, nftValue) {
    // 简单的收益计算公式
    const dailyRate = apy / 365 / 100;
    const earnings = nftValue * dailyRate * periodDays;
    return earnings;
}

// ==================== 质押风险提示 ====================
function showRiskWarning(poolType) {
    const riskMessages = {
        '高收益': '高收益池可能伴随较高风险，请谨慎投资。',
        '高风险高收益': '高风险高收益池波动性较大，请确保您能承受潜在损失。',
        '稳定': '稳定池收益较低但风险相对较小。',
        '灵活': '灵活池支持随时取出，但 APY 较低。'
    };

    if (riskMessages[poolType]) {
        showToast(riskMessages[poolType]);
    }
}

// ==================== 键盘快捷键 ====================
document.addEventListener('keydown', function(e) {
    // ESC 键返回我的质押
    if (e.key === 'Escape') {
        switchTab('my-stake');
    }

    // N 键打开新增质押
    if (e.key === 'n' || e.key === 'N') {
        if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            switchTab('new-stake');
        }
    }

    // E 键查看收益
    if (e.key === 'e' || e.key === 'E') {
        if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            switchTab('earnings');
        }
    }
});

// ==================== 控制台信息 ====================
console.log('%c 质押页面已加载 ', 'background: #6c5ce7; color: white; padding: 5px 10px; border-radius: 5px;');
console.log('当前标签页:', currentTab);
console.log('快捷键:');
console.log('  ESC - 返回我的质押');
console.log('  N - 新增质押');
console.log('  E - 查看收益');

// ==================== 页面加载完成 ====================
window.addEventListener('load', function() {
    console.log('质押页面加载完成');
    animateStats();
    animateStakeItems();
});
