// ==================== 帮助中心 JavaScript ====================

// ==================== 全局变量 ====================
let currentCategory = 'all';

// ==================== DOM 元素 ====================
const helpSearchInput = document.getElementById('helpSearchInput');
const searchBtn = document.querySelector('.search-btn');
const helpNavItems = document.querySelectorAll('.help-nav-item');
const articleCategories = document.querySelectorAll('.article-category');
const quickLinks = document.querySelectorAll('.quick-link');
const btnContact = document.querySelector('.btn-contact');
const btnReadMore = document.querySelectorAll('.btn-read-more');

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initHelpNav();
    initSearch();
    initQuickLinks();
    initContactButton();
    initReadMoreButtons();
    initFAQ();
});

// ==================== 帮助导航 ====================
function initHelpNav() {
    helpNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            filterByCategory(category);
        });
    });
}

function filterByCategory(category) {
    currentCategory = category;

    // 更新导航状态
    helpNavItems.forEach(item => {
        item.classList.toggle('active', item.dataset.category === category);
    });

    // 筛选文章
    articleCategories.forEach(catEl => {
        const catCategory = catEl.dataset.category;
        if (category === 'all' || catCategory === category) {
            catEl.style.display = 'block';
            catEl.style.animation = 'fadeIn 0.5s ease';
        } else {
            catEl.style.display = 'none';
        }
    });

    // 更新结果数量
    updateResultsCount();
}

function updateResultsCount() {
    const visibleCategories = document.querySelectorAll('.article-category:not([style*="display: none"])');
    let count = 0;

    visibleCategories.forEach(cat => {
        const articles = cat.querySelectorAll('.article-item');
        count += articles.length;
    });

    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        if (currentCategory === 'all') {
            resultsCount.textContent = `共 156 篇文章`;
        } else {
            resultsCount.textContent = `共 ${count} 篇文章`;
        }
    }
}

// ==================== 搜索功能 ====================
function initSearch() {
    // 搜索按钮点击
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // 回车键搜索
    if (helpSearchInput) {
        helpSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // 实时搜索（防抖）
        helpSearchInput.addEventListener('input', debounce(function() {
            if (this.value.length >= 2) {
                performSearch();
            }
        }, 500));
    }
}

function performSearch() {
    const query = helpSearchInput.value.toLowerCase().trim();

    if (!query) {
        // 如果搜索框为空，显示当前分类
        filterByCategory(currentCategory);
        return;
    }

    showToast('正在搜索...');

    // 获取所有文章和 FAQ
    const allArticles = document.querySelectorAll('.article-item');
    const allFAQs = document.querySelectorAll('.faq-item');

    let matchCount = 0;

    // 搜索文章
    allArticles.forEach(article => {
        const title = article.querySelector('.article-content h4').textContent.toLowerCase();
        const description = article.querySelector('.article-content p').textContent.toLowerCase();
        const category = article.closest('.article-category');

        if (title.includes(query) || description.includes(query)) {
            article.style.display = 'flex';
            if (category) {
                category.style.display = 'block';
            }
            matchCount++;
        } else {
            article.style.display = 'none';
        }
    });

    // 搜索 FAQ
    allFAQs.forEach(faq => {
        const question = faq.querySelector('.faq-question').textContent.toLowerCase();
        const answer = faq.querySelector('.faq-answer').textContent.toLowerCase();

        if (question.includes(query) || answer.includes(query)) {
            faq.style.display = 'block';
            matchCount++;
        } else {
            faq.style.display = 'none';
        }
    });

    // 显示搜索结果
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        resultsCount.textContent = `找到 ${matchCount} 个结果`;
    }

    showToast(`搜索完成，找到 ${matchCount} 个结果`);
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

// ==================== 快速链接 ====================
function initQuickLinks() {
    quickLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const query = this.textContent;
            helpSearchInput.value = query;
            performSearch();
        });
    });
}

// ==================== 联系客服 ====================
function initContactButton() {
    if (btnContact) {
        btnContact.addEventListener('click', function() {
            showToast('正在打开客服聊天窗口...');
            // 实际项目中会打开客服聊天窗口
        });
    }
}

// ==================== 阅读更多按钮 ====================
function initReadMoreButtons() {
    btnReadMore.forEach(btn => {
        btn.addEventListener('click', function() {
            const article = this.closest('.article-item');
            const title = article.querySelector('.article-content h4').textContent;
            showToast(`正在打开: ${title}`);
            // 实际项目中会跳转到文章详情页
        });
    });
}

// ==================== FAQ 功能 ====================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        // 打开/关闭事件
        item.addEventListener('toggle', function() {
            const icon = this.querySelector('summary i');
            if (this.open) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        });

        // 点击问题时的动画
        const summary = item.querySelector('summary');
        summary.addEventListener('click', function() {
            // 关闭其他打开的 FAQ
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.open) {
                    otherItem.removeAttribute('open');
                }
            });
        });
    });
}

// ==================== 搜索建议 ====================
function showSearchSuggestions(query) {
    // 实际项目中会显示搜索建议
    console.log('搜索建议:', query);
}

// ==================== 文章收藏 ====================
function toggleArticleFavorite(articleId) {
    // 实际项目中会实现文章收藏功能
    showToast('已添加到收藏');
}

// ==================== 文章分享 ====================
function shareArticle(articleId) {
    // 实际项目中会实现文章分享功能
    if (navigator.share) {
        navigator.share({
            title: 'NFT7 帮助文章',
            url: window.location.href
        });
    } else {
        showToast('链接已复制到剪贴板');
    }
}

// ==================== 帮助反馈 ====================
function submitHelpFeedback(rating, comment) {
    // 实际项目中会提交帮助反馈
    console.log('帮助反馈:', { rating, comment });
    showToast('感谢您的反馈！');
}

// ==================== 文章排序 ====================
function sortArticles(sortBy) {
    const currentCategoryEl = document.querySelector('.article-category:not([style*="display: none"])');
    if (!currentCategoryEl) return;

    const articles = Array.from(currentCategoryEl.querySelectorAll('.article-item'));

    articles.sort((a, b) => {
        switch(sortBy) {
            case 'views':
                const viewsA = parseInt(a.querySelector('.article-meta span:last-child').textContent.replace(/[^\d]/g, ''));
                const viewsB = parseInt(b.querySelector('.article-meta span:last-child').textContent.replace(/[^\d]/g, ''));
                return viewsB - viewsA;
            case 'time':
                // 按阅读时间排序（需要从文本中提取）
                return 0;
            case 'newest':
                // 按最新发布排序（需要从数据中获取发布时间）
                return 0;
            default:
                return 0;
        }
    });

    // 重新排列文章
    const articleList = currentCategoryEl.querySelector('.article-list');
    articles.forEach(article => {
        articleList.appendChild(article);
    });
}

// ==================== 滚动到顶部 ====================
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
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
    // / 键聚焦搜索框
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        helpSearchInput.focus();
    }

    // ESC 键清空搜索
    if (e.key === 'Escape') {
        helpSearchInput.value = '';
        filterByCategory(currentCategory);
    }
});

// ==================== 文章加载动画 ====================
function animateArticles() {
    const articles = document.querySelectorAll('.article-item');
    articles.forEach((article, index) => {
        article.style.opacity = '0';
        article.style.animation = 'none';
        setTimeout(() => {
            article.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
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

// 切换分类时动画文章
const originalFilterByCategory = filterByCategory;
window.filterByCategory = function(category) {
    originalFilterByCategory.call(this, category);
    setTimeout(animateArticles, 100);
};

// ==================== 浏览历史记录 ====================
function saveArticleToHistory(articleId) {
    // 保存文章到浏览历史
    const history = JSON.parse(localStorage.getItem('helpArticleHistory') || '[]');
    if (!history.includes(articleId)) {
        history.unshift(articleId);
        if (history.length > 10) {
            history.pop();
        }
        localStorage.setItem('helpArticleHistory', JSON.stringify(history));
    }
}

function getArticleHistory() {
    return JSON.parse(localStorage.getItem('helpArticleHistory') || '[]');
}

// ==================== 控制台信息 ====================
console.log('%c 帮助中心已加载 ', 'background: #6c5ce7; color: white; padding: 5px 10px; border-radius: 5px;');
console.log('当前分类:', currentCategory);
console.log('快捷键:');
console.log('  / - 聚焦搜索框');
console.log('  ESC - 清空搜索');

// ==================== 页面加载完成 ====================
window.addEventListener('load', function() {
    console.log('帮助中心页面加载完成');
    animateArticles();
});
