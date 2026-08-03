// js/dashboard.js
// ============================================================
// ATLAS BUSINESS — DASHBOARD CONTROLLER
// ============================================================

(function () {
    'use strict';

    // Referências DOM
    const contentArea = document.getElementById('dashboardContent');
    const breadcrumb = document.getElementById('breadcrumb');

    // Definição dos itens da sidebar
    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                  </svg>`,
            href: '#',
        },
        {
            id: 'propostas',
            label: 'Propostas Comerciais',
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>`,
            href: 'pages/propostas.html',
        },
        {
            id: 'orcamentos',
            label: 'Orçamentos',
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="20" height="18" rx="2"/><line x1="6" y1="8" x2="6" y2="8.01"/>
                    <line x1="10" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="6" y2="12.01"/>
                    <line x1="10" y1="12" x2="18" y2="12"/><line x1="6" y1="16" x2="6" y2="16.01"/><line x1="10" y1="16" x2="18" y2="16"/>
                  </svg>`,
            href: 'pages/orcamentos.html',
        },
        {
            id: 'contratos',
            label: 'Contratos',
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>`,
            href: 'pages/contratos.html',
        },
        {
            id: 'relatorios',
            label: 'Relatórios',
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>`,
            href: 'pages/relatorios.html',
        },
        {
            id: 'calculadora',
            label: 'Calculadora Inteligente',
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/>
                    <circle cx="9" cy="11" r="1.5"/><circle cx="15" cy="11" r="1.5"/>
                    <circle cx="9" cy="16" r="1.5"/><circle cx="15" cy="16" r="1.5"/>
                  </svg>`,
            href: 'pages/calculadora.html',
        },
        {
            id: 'configuracoes',
            label: 'Configurações',
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
                  </svg>`,
            href: 'pages/configuracoes.html',
        },
    ];

    /**
     * Navega para uma ferramenta específica carregando seu HTML
     * @param {string} toolId - ID da ferramenta
     */
    function navigateTo(toolId) {
        const item = menuItems.find(i => i.id === toolId);
        if (!item) return;

        // Atualiza breadcrumb
        breadcrumb.innerHTML = `<span>Dashboard</span> <span class="breadcrumb-sep">›</span> <span>${item.label}</span>`;

        // Se for o dashboard, mostra tela de boas-vindas
        if (toolId === 'dashboard') {
            showWelcomeScreen();
            return;
        }

        // Caso contrário, carrega a página da ferramenta via fetch
        loadToolPage(item.href, toolId);
    }

    /**
     * Carrega o conteúdo da página da ferramenta e injeta no dashboard
     * @param {string} url - URL da página (ex: pages/propostas.html)
     * @param {string} toolId 
     */
    async function loadToolPage(url, toolId) {
        contentArea.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Carregando ferramenta...</p>
            </div>
        `;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Página não encontrada');
            const html = await response.text();

            // Extrai apenas o conteúdo dentro de <body> (ou tudo, se for partial)
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const bodyContent = doc.body ? doc.body.innerHTML : html;

            contentArea.innerHTML = bodyContent;

            // Executa scripts inline se houver (cuidado com segurança)
            const scripts = contentArea.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript).parentNode.removeChild(newScript);
            });

            // Atualiza título da página
            document.title = `Atlas Business — ${menuItems.find(i => i.id === toolId)?.label || 'Ferramenta'}`;
        } catch (error) {
            contentArea.innerHTML = `
                <div class="error-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <h3>Erro ao carregar</h3>
                    <p>Não foi possível carregar esta ferramenta. Tente novamente.</p>
                    <button class="btn btn--primary btn--sm" onclick="navigateTo('dashboard')">Voltar ao início</button>
                </div>
            `;
            Atlas.showToast('Erro ao carregar a ferramenta', 'error');
        }
    }

    /**
     * Mostra a tela de boas-vindas inicial
     */
    function showWelcomeScreen() {
        breadcrumb.innerHTML = `<span>Dashboard</span>`;
        contentArea.innerHTML = `
            <div class="dashboard-welcome">
                <div class="welcome-card">
                    <h2>Bem-vindo ao Atlas Business</h2>
                    <p>Selecione uma ferramenta no menu lateral para começar a criar documentos profissionais.</p>
                    <div class="welcome-tools-grid">
                        ${menuItems.filter(i => i.id !== 'dashboard' && i.id !== 'configuracoes').map(item => `
                            <div class="welcome-tool" onclick="navigateTo('${item.id}')">
                                <span class="welcome-tool__icon">${item.icon}</span>
                                <span>${item.label}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Inicializa a sidebar e o dashboard
     */
    function initDashboard() {
        // Inicializa a sidebar
        const sidebar = new Sidebar('sidebarContainer', {
            items: menuItems,
            activeIndex: 0,
            onSelect: (item) => {
                navigateTo(item.id);
            },
        });

        // Restaura estado de colapso
        const savedCollapsed = Atlas.getStorage('sidebar_collapsed', false);
        if (savedCollapsed) {
            sidebar.toggleCollapse();
        }

        // Configura botão de tema no dashboard
        const themeToggle = document.getElementById('themeToggleDashboard');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                ThemeManager.toggleTheme();
            });
        }

        // Navega para o dashboard inicial
        navigateTo('dashboard');
    }

    // Torna a função de navegação global para ser usada nos cliques rápidos
    window.navigateTo = navigateTo;

    // Inicia quando DOM estiver pronto
    document.addEventListener('DOMContentLoaded', initDashboard);
})();
