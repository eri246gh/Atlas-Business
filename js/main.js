// ============================================================
// ATLAS BUSINESS — MAIN.JS (UTILITÁRIOS GLOBAIS)
// ============================================================

/**
 * Namespace global para o Atlas Business
 * Centraliza todos os utilitários e módulos da aplicação
 */
const Atlas = (() => {
    'use strict';

    // ========== CONSTANTES ==========
    const STORAGE_KEYS = {
        THEME: 'atlas_theme',
        PREFERENCES: 'atlas_preferences',
    };

    // ========== UTILITÁRIOS ==========

    /**
     * Seleciona elementos do DOM de forma concisa
     * @param {string} selector - Seletor CSS
     * @param {Element} context - Contexto opcional (padrão: document)
     * @returns {Element|null}
     */
    const $ = (selector, context = document) => context.querySelector(selector);

    /**
     * Seleciona múltiplos elementos do DOM
     * @param {string} selector - Seletor CSS
     * @param {Element} context - Contexto opcional
     * @returns {NodeList}
     */
    const $$ = (selector, context = document) => context.querySelectorAll(selector);

    /**
     * Cria um elemento HTML com atributos e conteúdo
     * @param {string} tag - Tag HTML
     * @param {Object} attrs - Atributos do elemento
     * @param {string|Element|Array} children - Conteúdo ou filhos
     * @returns {Element}
     */
    const createElement = (tag, attrs = {}, ...children) => {
        const el = document.createElement(tag);
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className') {
                el.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dk, dv]) => {
                    el.dataset[dk] = dv;
                });
            } else if (key.startsWith('on')) {
                el.addEventListener(key.slice(2).toLowerCase(), value);
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(el.style, value);
            } else {
                el.setAttribute(key, value);
            }
        });
        children.forEach(child => {
            if (typeof child === 'string') {
                el.appendChild(document.createTextNode(child));
            } else if (child instanceof Element) {
                el.appendChild(child);
            } else if (Array.isArray(child)) {
                child.forEach(c => el.appendChild(c));
            }
        });
        return el;
    };

    /**
     * Debounce para otimizar eventos frequentes
     * @param {Function} fn - Função a ser executada
     * @param {number} delay - Atraso em ms
     * @returns {Function}
     */
    const debounce = (fn, delay = 150) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(null, args), delay);
        };
    };

    /**
     * Formata valor monetário em BRL
     * @param {number} value - Valor numérico
     * @returns {string}
     */
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    /**
     * Formata data para o padrão brasileiro
     * @param {Date|string} date - Data
     * @returns {string}
     */
    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    /**
     * Copia texto para a área de transferência
     * @param {string} text - Texto a ser copiado
     * @returns {Promise<boolean>}
     */
    const copyToClipboard = async (text) => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            }
            // Fallback para navegadores mais antigos
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        } catch (err) {
            console.error('Erro ao copiar:', err);
            return false;
        }
    };

    /**
     * Exibe uma notificação toast
     * @param {string} message - Mensagem
     * @param {string} type - success | error | info
     * @param {number} duration - Duração em ms
     */
    const showToast = (message, type = 'info', duration = 3000) => {
        const container = $('#toastContainer');
        if (!container) return;

        const toast = createElement('div', {
            className: `toast toast--${type}`,
        });

        const icons = {
            success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
        };

        toast.innerHTML = `${icons[type] || icons.info} <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease-in forwards';
            toast.addEventListener('animationend', () => toast.remove());
        }, duration);
    };

    /**
     * Obtém valor do localStorage com segurança
     * @param {string} key - Chave
     * @param {*} defaultValue - Valor padrão
     * @returns {*}
     */
    const getStorage = (key, defaultValue = null) => {
        try {
            const value = localStorage.getItem(key);
            return value !== null ? JSON.parse(value) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    };

    /**
     * Salva valor no localStorage com segurança
     * @param {string} key - Chave
     * @param {*} value - Valor
     */
    const setStorage = (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('Não foi possível salvar no localStorage:', e);
        }
    };

    /**
     * Inicializa componentes que precisam de observação de interseção
     * para animações de entrada (reveal on scroll)
     */
    const initRevealAnimations = () => {
        const revealElements = $$('[data-reveal]');
        if (!revealElements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        revealElements.forEach(el => observer.observe(el));
    };

    // ========== API PÚBLICA ==========
    return {
        $,
        $$,
        createElement,
        debounce,
        formatCurrency,
        formatDate,
        copyToClipboard,
        showToast,
        getStorage,
        setStorage,
        initRevealAnimations,
        STORAGE_KEYS,
    };
})();

// Expor para uso global (útil para outros scripts)
window.Atlas = Atlas;
