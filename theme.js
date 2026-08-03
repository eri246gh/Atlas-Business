// ============================================================
// ATLAS BUSINESS — THEME.JS (CONTROLE DE TEMA CLARO/ESCURO)
// ============================================================

/**
 * Gerenciador de tema claro/escuro
 * Detecta preferência do sistema e permite alternância manual
 */
const ThemeManager = (() => {
    'use strict';

    const THEME_KEY = Atlas.STORAGE_KEYS.THEME;
    const DARK_CLASS = 'dark-mode';
    const LIGHT_CLASS = 'light-mode';

    /**
     * Obtém a preferência de tema do sistema
     * @returns {string} 'dark' ou 'light'
     */
    const getSystemPreference = () => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    };

    /**
     * Aplica o tema ao body
     * @param {string} theme - 'dark' ou 'light'
     */
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add(DARK_CLASS);
            document.body.classList.remove(LIGHT_CLASS);
        } else {
            document.body.classList.add(LIGHT_CLASS);
            document.body.classList.remove(DARK_CLASS);
        }
        updateToggleIcons(theme);
    };

    /**
     * Atualiza os ícones do botão de alternância
     * @param {string} theme - Tema atual
     */
    const updateToggleIcons = (theme) => {
        const sunIcons = document.querySelectorAll('.icon-sun');
        const moonIcons = document.querySelectorAll('.icon-moon');

        sunIcons.forEach(icon => {
            icon.style.display = theme === 'dark' ? 'block' : 'none';
        });
        moonIcons.forEach(icon => {
            icon.style.display = theme === 'dark' ? 'none' : 'block';
        });
    };

    /**
     * Alterna entre temas claro e escuro
     * @returns {string} Novo tema aplicado
     */
    const toggleTheme = () => {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        Atlas.setStorage(THEME_KEY, newTheme);
        return newTheme;
    };

    /**
     * Obtém o tema atual
     * @returns {string} 'dark' ou 'light'
     */
    const getCurrentTheme = () => {
        if (document.body.classList.contains(DARK_CLASS)) return 'dark';
        return 'light';
    };

    /**
     * Inicializa o gerenciador de tema
     */
    const init = () => {
        // Recupera tema salvo ou usa preferência do sistema
        const savedTheme = Atlas.getStorage(THEME_KEY);
        const initialTheme = savedTheme || getSystemPreference();
        applyTheme(initialTheme);

        // Configura botão de alternância
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const newTheme = toggleTheme();
                Atlas.showToast(
                    `Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado`,
                    'info',
                    2000
                );
            });
        }

        // Escuta mudanças na preferência do sistema
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            const savedTheme = Atlas.getStorage(THEME_KEY);
            // Só altera automaticamente se o usuário nunca definiu manualmente
            if (!savedTheme) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    };

    // ========== API PÚBLICA ==========
    return {
        init,
        toggleTheme,
        getCurrentTheme,
        applyTheme,
    };
})();

// Inicializar tema quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});
