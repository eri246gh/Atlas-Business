// ============================================================
// ATLAS BUSINESS — LANDING.JS (INTERAÇÕES DA LANDING PAGE)
// ============================================================

/**
 * Controla todas as interações específicas da landing page:
 * - Menu mobile
 * - Scroll da navbar
 * - Accordion FAQ
 * - Smooth scroll para links internos
 * - Animações de entrada
 */
const LandingPage = (() => {
    'use strict';

    /**
     * Inicializa o menu hamburger para dispositivos móveis
     */
    const initMobileMenu = () => {
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const navbarNav = document.getElementById('navbarNav');
        const navLinks = navbarNav ? navbarNav.querySelectorAll('.navbar__link') : [];

        if (!hamburgerBtn || !navbarNav) return;

        const toggleMenu = () => {
            const isOpen = navbarNav.classList.toggle('open');
            hamburgerBtn.classList.toggle('active');
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        const closeMenu = () => {
            navbarNav.classList.remove('open');
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };

        hamburgerBtn.addEventListener('click', toggleMenu);

        // Fecha o menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Fecha o menu ao redimensionar para desktop
        window.addEventListener('resize', Atlas.debounce(() => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        }, 200));
    };

    /**
     * Adiciona efeito de scroll na navbar
     * - Reduz opacidade do glass
     * - Adiciona sombra
     */
    const initNavbarScroll = () => {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        const handleScroll = Atlas.debounce(() => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 50);

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Verifica estado inicial
        handleScroll();
    };

    /**
     * Inicializa o accordion da seção FAQ
     */
    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item__question');
        if (!faqItems.length) return;

        faqItems.forEach(button => {
            button.addEventListener('click', () => {
                const faqItem = button.parentElement;
                const isActive = faqItem.classList.contains('active');

                // Fecha todos os itens abertos
                document.querySelectorAll('.faq-item.active').forEach(item => {
                    if (item !== faqItem) {
                        item.classList.remove('active');
                        item.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
                    }
                });

                // Alterna o item clicado
                if (isActive) {
                    faqItem.classList.remove('active');
                    button.setAttribute('aria-expanded', 'false');
                } else {
                    faqItem.classList.add('active');
                    button.setAttribute('aria-expanded', 'true');
                }
            });
        });
    };

    /**
     * Inicializa smooth scroll para links internos
     */
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 64;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 16;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth',
                    });
                }
            });
        });
    };

    /**
     * Inicializa animações de entrada com Intersection Observer
     */
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll(
            '.tool-card, .benefit-card, .step, .faq-item'
        );

        if (!animatedElements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Aplica um delay progressivo para efeito cascata
                        const delay = Math.min(index * 50, 300);
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
        );

        // Configura estado inicial dos elementos
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    };

    /**
     * Inicializa contador animado para as estatísticas do hero
     */
    const initStatsCounter = () => {
        const statNumbers = document.querySelectorAll('.hero__stat-number');
        if (!statNumbers.length) return;

        const animateCounter = (el) => {
            const text = el.textContent;
            const hasPlus = text.includes('+');
            const hasPercent = text.includes('%');
            const numericPart = parseInt(text.replace(/[^0-9]/g, ''), 10);
            if (isNaN(numericPart)) return;

            const duration = 2000;
            const startTime = performance.now();
            const suffix = hasPlus ? '+' : hasPercent ? '%' : '';

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Easing ease-out
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * numericPart);

                el.textContent = current + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };

            requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        statNumbers.forEach(el => observer.observe(el));
    };

    /**
     * Inicializa todos os componentes da landing page
     */
    const init = () => {
        initMobileMenu();
        initNavbarScroll();
        initFaqAccordion();
        initSmoothScroll();
        initScrollAnimations();
        initStatsCounter();
    };

    // ========== API PÚBLICA ==========
    return { init };
})();

// Inicializar landing page quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    LandingPage.init();
});
