// ==================== 全局变量 ====================
let currentSlide = 0;
const totalSlides = 3;

// ==================== DOM 元素 ====================
const navbar = document.querySelector('.navbar');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const nftCards = document.querySelectorAll('.nft-card');
const followButtons = document.querySelectorAll('.btn-follow');
const connectButton = document.querySelector('.btn-connect');

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initSlider();
    initNavbarScroll();
    initCardHover();
    initFollowButtons();
    initConnectButton();
    initQuickAccessCards();
});

// ==================== 轮播功能 ====================
function initSlider() {
    // 自动播放
    setInterval(() => {
        nextSlide();
    }, 5000);

    // 点击圆点切换
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
}

function goToSlide(index) {
    // 隐藏当前幻灯片
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // 更新索引
    currentSlide = index;

    // 显示新幻灯片
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    const nextIndex = (currentSlide + 1) % totalSlides;
    goToSlide(nextIndex);
}

function prevSlide() {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(prevIndex);
}

// ==================== 导航栏滚动效果 ====================
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ==================== 卡片悬停效果 ====================
function initCardHover() {
    nftCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ==================== 关注按钮 ====================
function initFollowButtons() {
    followButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent === '关注') {
                this.textContent = '已关注';
                this.style.background = 'var(--primary-color)';
                this.style.color = 'white';
            } else {
                this.textContent = '关注';
                this.style.background = 'transparent';
                this.style.color = 'var(--primary-color)';
            }
        });
    });
}

// ==================== 连接钱包按钮 ====================
function initConnectButton() {
    if (connectButton) {
        connectButton.addEventListener('click', function() {
            // 模拟连接钱包
            this.textContent = '连接中...';
            this.disabled = true;

            setTimeout(() => {
                this.textContent = '已连接';
                this.style.background = 'var(--success-color)';
                this.disabled = false;
            }, 1500);
        });
    }
}

// ==================== 快速入口卡片 ====================
function initQuickAccessCards() {
    const quickCards = document.querySelectorAll('.quick-card');

    quickCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;

            // 简单的反馈动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px)';
            }, 150);

            // 显示提示（实际项目中会跳转到对应页面）
            showToast(`正在前往${title}...`);
        });
    });
}

// ==================== Toast 提示 ====================
function showToast(message) {
    // 创建 toast 元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    // 添加样式
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'var(--dark-bg)';
    toast.style.color = 'white';
    toast.style.padding = '1rem 2rem';
    toast.style.borderRadius = '30px';
    toast.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    toast.style.zIndex = '9999';
    toast.style.animation = 'slideUp 0.3s ease';

    // 添加到页面
    document.body.appendChild(toast);

    // 3秒后移除
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
    }
`;
document.head.appendChild(style);

// ==================== 平滑滚动 ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== 懒加载图片 ====================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// 观察所有需要动画的元素
document.querySelectorAll('.nft-card, .creator-card, .quick-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// 添加可见性样式
const visibilityStyle = document.createElement('style');
visibilityStyle.textContent = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(visibilityStyle);

// ==================== 数字动画 ====================
function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    const range = end - start;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.floor(start + range * easeProgress);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// 为统计数字添加动画
const statValues = document.querySelectorAll('.stat-value');
statValues.forEach(stat => {
    const text = stat.textContent;
    const numericValue = parseInt(text.replace(/,/g, '').replace(/[^\d]/g, ''));
    if (!isNaN(numericValue)) {
        // 存储原始文本格式
        stat.dataset.originalText = text;

        // 观察元素是否进入视口
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateValue(stat, 0, numericValue, 2000);
                    statObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statObserver.observe(stat);
    }
});

// ==================== 控制台信息 ====================
console.log('%c NFT7 Platform ', 'background: #6c5ce7; color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('%c 探索无限可能，收藏独特价值 ', 'color: #6c5ce7; font-size: 14px;');
