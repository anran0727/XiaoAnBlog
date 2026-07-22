function initTheme() {
    var savedTheme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
        }
    });
}

function initProgressBar() {
    var progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', function() {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

function initBackToTop() {
    var backToTop = document.querySelector('.back-to-top');
    if (!backToTop) {
        backToTop = document.createElement('a');
        backToTop.href = '#';
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '↑';
        backToTop.setAttribute('aria-label', '返回顶部');
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        document.body.appendChild(backToTop);
    }
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
}

function initHeaderScroll() {
    var header = document.getElementById('page-header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
            if (header.classList.contains('header-transparent')) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }
        } else {
            header.classList.remove('header-scrolled');
            if (header.classList.contains('header-transparent')) {
                header.style.backgroundColor = 'transparent';
            }
        }
    });
}

function initDrawerMenu() {
    var toggleMenu = document.getElementById('toggle-menu');
    if (!toggleMenu) return;
    
    var drawer = document.createElement('div');
    drawer.className = 'drawer';
    drawer.style.cssText = 'position: fixed; top: 0; right: -280px; width: 280px; height: 100vh; background-color: var(--card-bg-color); z-index: 999; transition: right 0.3s ease; padding: 20px; border-left: 1px solid var(--border-color);';
    
    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = 'position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 20px; color: var(--text-color); cursor: pointer;';
    drawer.appendChild(closeBtn);
    
    var menuItems = document.querySelectorAll('.menus_items .site-page');
    var nav = document.createElement('nav');
    nav.style.cssText = 'margin-top: 50px;';
    
    menuItems.forEach(function(item) {
        var link = document.createElement('a');
        link.href = item.href;
        link.textContent = item.textContent;
        link.className = item.className;
        link.style.cssText = 'display: block; padding: 12px 0; color: var(--text-color); text-decoration: none; font-size: 16px; border-bottom: 1px solid var(--border-color);';
        link.addEventListener('click', function() {
            drawer.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        });
        nav.appendChild(link);
    });
    
    drawer.appendChild(nav);
    document.body.appendChild(drawer);
    
    var overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 998; opacity: 0; visibility: hidden; transition: all 0.3s ease;';
    document.body.appendChild(overlay);
    
    toggleMenu.addEventListener('click', function(e) {
        e.preventDefault();
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        drawer.style.right = '0';
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
    });
    
    closeBtn.addEventListener('click', function() {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        drawer.style.right = '-280px';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
    });
    
    overlay.addEventListener('click', function() {
        closeBtn.click();
    });
}

function initCodeCopy() {
    document.querySelectorAll('pre code').forEach(function(codeBlock) {
        var pre = codeBlock.parentElement;
        if (pre.querySelector('.copy-btn')) return;
        
        var copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = '复制';
        copyBtn.style.cssText = 'position: absolute; top: 8px; right: 8px; padding: 4px 12px; font-size: 12px; background-color: rgba(111, 66, 193, 0.1); color: var(--accent-color); border: 1px solid var(--accent-color); border-radius: 4px; cursor: pointer; transition: all 0.3s ease;';
        
        pre.style.position = 'relative';
        pre.appendChild(copyBtn);
        
        copyBtn.addEventListener('click', function() {
            var text = codeBlock.textContent;
            navigator.clipboard.writeText(text).then(function() {
                copyBtn.textContent = '已复制';
                copyBtn.style.backgroundColor = 'var(--accent-color)';
                copyBtn.style.color = '#ffffff';
                setTimeout(function() {
                    copyBtn.textContent = '复制';
                    copyBtn.style.backgroundColor = 'rgba(111, 66, 193, 0.1)';
                    copyBtn.style.color = 'var(--accent-color)';
                }, 2000);
            });
        });
    });
}

function initToc() {
    var toc = document.querySelector('.toc');
    if (!toc) return;
    
    var headings = document.querySelectorAll('article h1, article h2, article h3');
    var tocList = toc.querySelector('ul');
    
    headings.forEach(function(heading, index) {
        var level = parseInt(heading.tagName.charAt(1));
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + heading.id;
        a.textContent = heading.textContent;
        a.style.cssText = 'display: block; padding: 6px 0; font-size: 14px; color: var(--text-secondary-color); text-decoration: none; transition: color 0.3s ease;';
        a.style.paddingLeft = (level - 1) * 15 + 'px';
        li.appendChild(a);
        tocList.appendChild(li);
        
        a.addEventListener('click', function(e) {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    window.addEventListener('scroll', function() {
        var currentHeading = '';
        headings.forEach(function(heading) {
            if (heading.offsetTop - 100 <= window.scrollY) {
                currentHeading = heading.id;
            }
        });
        
        tocList.querySelectorAll('a').forEach(function(link) {
            if (link.href.includes('#' + currentHeading)) {
                link.style.color = 'var(--accent-color)';
                link.style.fontWeight = '600';
            } else {
                link.style.color = 'var(--text-secondary-color)';
                link.style.fontWeight = 'normal';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initProgressBar();
    initBackToTop();
    initHeaderScroll();
    initDrawerMenu();
    initCodeCopy();
    initToc();
});