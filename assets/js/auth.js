// ==================== 认证系统 JavaScript ====================

// ==================== 全局变量 ====================
let isLoggedIn = true; // 模拟已登录状态
const currentUser = {
    email: 'rob***@gmail.com',
    username: 'Robert',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rob',
    badges: ['verified', 'premium']
};

// ==================== DOM 元素 ====================
const authButtons = document.getElementById('authButtons');
const userProfileDisplay = document.getElementById('userProfileDisplay');
const userEmail = document.getElementById('userEmail');
const userDropdown = document.getElementById('userDropdown');
const dropdownToggle = document.querySelector('.dropdown-toggle');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initAuth();
    initDropdown();
    initModals();
    initForms();
});

// ==================== 认证初始化 ====================
function initAuth() {
    if (isLoggedIn) {
        showLoggedInState();
    } else {
        showLoggedOutState();
    }
}

function showLoggedInState() {
    if (authButtons) authButtons.style.display = 'none';
    if (userProfileDisplay) userProfileDisplay.style.display = 'flex';
    if (userEmail) {
        userEmail.textContent = currentUser.email;
    }
}

function showLoggedOutState() {
    if (authButtons) authButtons.style.display = 'flex';
    if (userProfileDisplay) userProfileDisplay.style.display = 'none';
}

// ==================== 下拉菜单 ====================
function initDropdown() {
    if (!userProfileDisplay || !dropdownToggle || !userDropdown) return;

    userProfileDisplay.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown();
    });

    dropdownToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown();
    });

    // 点击外部关闭
    document.addEventListener('click', function(e) {
        if (!userProfileDisplay.contains(e.target) && !userDropdown.contains(e.target)) {
            closeDropdown();
        }
    });
}

function toggleDropdown() {
    userDropdown.classList.toggle('show');
}

function closeDropdown() {
    if (userDropdown) {
        userDropdown.classList.remove('show');
    }
}

// ==================== 模态框 ====================
function initModals() {
    // 关闭按钮
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            closeModal(modal.id);
        });
    });

    // 点击模态框外部关闭
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });
}

function openLoginModal() {
    if (loginModal) {
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function openRegisterModal() {
    if (registerModal) {
        registerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ==================== 表单处理 ====================
function initForms() {
    // 登录表单
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin(e);
        });
    }

    // 注册表单
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister(e);
        });
    }
}

// ==================== 登录处理 ====================
function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = document.getElementById('rememberMe').checked;

    console.log('登录数据:', { email, password, rememberMe });

    // 模拟登录
    showToast('正在登录...');

    setTimeout(() => {
        // 模拟登录成功
        currentUser.email = email;
        isLoggedIn = true;

        showLoggedInState();
        closeModal('loginModal');
        showToast('登录成功！欢迎回来，' + getUsername(email));
    }, 1500);
}

function getUsername(email) {
    // 从邮箱中提取用户名
    const username = email.split('@')[0];
    // 部分邮箱显示
    const maskedEmail = email.replace(/(.{3})@/, '***@');
    return maskedEmail;
}

// ==================== 注册处理 ====================
function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // 验证
    if (!username || !email || !password || !confirmPassword) {
        showToast('请填写所有字段');
        return;
    }

    if (password !== confirmPassword) {
        showToast('两次输入的密码不一致');
        return;
    }

    if (!agreeTerms) {
        showToast('请阅读并同意服务条款和隐私政策');
        return;
    }

    if (password.length < 8) {
        showToast('密码至少需要 8 位字符');
        return;
    }

    console.log('注册数据:', { username, email, password });

    // 模拟注册
    showToast('正在注册...');

    setTimeout(() => {
        currentUser.username = username;
        currentUser.email = email;
        isLoggedIn = true;

        showLoggedInState();
        closeModal('registerModal');
        showToast('注册成功！欢迎加入 NFT7，' + username);
    }, 1500);
}

// ==================== 退出登录 ====================
function logout() {
    if (confirm('确定要退出登录吗？')) {
        showToast('正在退出登录...');
        
        setTimeout(() => {
            isLoggedIn = false;
            showLoggedOutState();
            closeDropdown();
            
            // 清除用户数据
            currentUser = {
                email: '',
                username: '',
                avatar: '',
                badges: []
            };

            showToast('已退出登录');
            
            // 如果在个人中心页面，跳转到首页
            if (window.location.pathname.includes('profile.html')) {
                window.location.href = 'index.html';
            }
        }, 1000);
    }
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
        z-index: 10000;
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

// ==================== 社交登录 ====================
const socialLoginButtons = document.querySelectorAll('.social-btn');
socialLoginButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const provider = this.classList.contains('google') ? 'Google' : 'GitHub';
        showToast(`正在使用 ${provider} 登录...`);
        
        setTimeout(() => {
            currentUser.email = 'rob***@gmail.com';
            currentUser.username = 'Robert';
            isLoggedIn = true;
            
            showLoggedInState();
            
            if (loginModal) loginModal.classList.remove('active');
            if (registerModal) registerModal.classList.remove('active');
            document.body.style.overflow = '';
            
            showToast(`${provider} 登录成功！`);
        }, 1500);
    });
});

// ==================== 键盘快捷键 ====================
document.addEventListener('keydown', function(e) {
    // ESC 键关闭模态框
    if (e.key === 'Escape') {
        closeModal('loginModal');
        closeModal('registerModal');
        closeDropdown();
    }

    // L 键打开登录
    if (e.key === 'l' || e.key === 'L') {
        if (!isLoggedIn && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            openLoginModal();
        }
    }

    // R 键打开注册
    if (e.key === 'r' || e.key === 'R') {
        if (!isLoggedIn && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            openRegisterModal();
        }
    }

    // E 键退出登录
    if (e.key === 'e' || e.key === 'E') {
        if (isLoggedIn && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            logout();
        }
    }
});

// ==================== 记住我功能 ====================
function handleRememberMe() {
    const rememberMeCheckbox = document.getElementById('rememberMe');
    if (rememberMeCheckbox && rememberMeCheckbox.checked) {
        // 存储登录状态（使用 localStorage）
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', currentUser.email);
    } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userEmail');
    }
}

// 页面加载时检查记住我
window.addEventListener('load', function() {
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === 'true') {
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
            currentUser.email = savedEmail;
            isLoggedIn = true;
            initAuth();
        }
    }
});

// ==================== 表单验证 ====================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function validateUsername(username) {
    return username.length >= 3 && username.length <= 20;
}

// ==================== 密码可见性切换 ====================
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
    }
}

// ==================== 忘记密码 ====================
function handleForgotPassword() {
    const email = prompt('请输入您的邮箱地址：');
    if (email && validateEmail(email)) {
        showToast(`重置密码链接已发送到 ${email}`);
    } else {
        showToast('请输入有效的邮箱地址');
    }
}

// ==================== 更新用户信息 ====================
function updateUserInfo(field, value) {
    currentUser[field] = value;
    
    if (field === 'email' && userEmail) {
        userEmail.textContent = value;
    }
    
    console.log('用户信息已更新:', currentUser);
}

// ==================== 检查登录状态 ====================
function checkLoginStatus() {
    return isLoggedIn;
}

// ==================== 获取当前用户 ====================
function getCurrentUser() {
    return currentUser;
}

// ==================== 导出函数到全局 ====================
window.openLoginModal = openLoginModal;
window.openRegisterModal = openRegisterModal;
window.closeModal = closeModal;
window.logout = logout;
window.handleForgotPassword = handleForgotPassword;
window.togglePasswordVisibility = togglePasswordVisibility;

// ==================== 控制台信息 ====================
console.log('%c 认证系统已加载 ', 'background: #6c5ce7; color: white; padding: 5px 10px; border-radius: 5px;');
console.log('登录状态:', isLoggedIn ? '已登录' : '未登录');
console.log('当前用户:', currentUser);
console.log('快捷键:');
console.log('  L - 打开登录');
console.log('  R - 打开注册');
console.log('  E - 退出登录');
console.log('  ESC - 关闭弹窗');

// ==================== 页面加载完成 ====================
window.addEventListener('load', function() {
    console.log('认证系统初始化完成');
    initAuth();
});
