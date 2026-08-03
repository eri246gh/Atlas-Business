// components/Sidebar.js
// ============================================================
// ATLAS BUSINESS — COMPONENTE SIDEBAR REUTILIZÁVEL
// ============================================================

/**
 * Componente de menu lateral para o dashboard.
 * 
 * Uso:
 *   const sidebar = new Sidebar('sidebar-container', {
 *       items: [...],
 *       activeIndex: 0,
 *       onSelect: (item, index) => { ... }
 *   });
 */
class Sidebar {
    /**
     * @param {string} containerId - ID do elemento que receberá a sidebar
     * @param {Object} options - Configurações
     * @param {Array} options.items - Itens do menu [{ id, label, icon (SVG string), href, badge? }]
     * @param {number} options.activeIndex - Índice do item ativo inicial
     * @param {Function} options.onSelect - Callback ao selecionar um item (recebe item, index)
     */
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Sidebar: container #${containerId} não encontrado`);
            return;
        }

        this.items = options.items || [];
        this.activeIndex = options.activeIndex || 0;
        this.onSelect = options.onSelect || (() => {});
        this.isCollapsed = false;

        this.render();
        this.bindEvents();
        this.setActive(this.activeIndex);
    }

    /**
     * Renderiza o HTML da sidebar
     */
    render() {
        const sidebarHTML = `
            <aside class="sidebar ${this.isCollapsed ? 'sidebar--collapsed' : ''}" id="sidebarEl">
                <div class="sidebar__header">
                    <a href="index.html" class="sidebar__logo" title="Voltar ao início">
                        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                            <rect width="32" height="32" rx="8" fill="#2563eb"/>
                            <path d="M8 22L16 8L24 22H8Z" fill="white" opacity="0.9"/>
                            <circle cx="16" cy="18" r="2.5" fill="white"/>
                        </svg>
                        <span class="sidebar__logo-text">Atlas<span>Business</span></span>
                    </a>
                    <button class="sidebar__toggle" id="sidebarToggle" title="Recolher menu">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                    </button>
                </div>
                <nav class="sidebar__nav">
                    <ul class="sidebar__list">
                        ${this.items.map((item, index) => `
                            <li class="sidebar__item" data-index="${index}">
                                <a class="sidebar__link" data-href="${item.href || '#'}" data-id="${item.id}">
                                    <span class="sidebar__icon">${item.icon || ''}</span>
                                    <span class="sidebar__label">${item.label}</span>
                                    ${item.badge ? `<span class="sidebar__badge">${item.badge}</span>` : ''}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </nav>
                <div class="sidebar__footer">
                    <a href="index.html" class="sidebar__footer-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                        </svg>
                        Voltar ao site
                    </a>
                </div>
            </aside>
        `;

        this.container.innerHTML = sidebarHTML;

        // Referências aos elementos
        this.sidebarEl = this.container.querySelector('#sidebarEl');
        this.toggleBtn = this.container.querySelector('#sidebarToggle');
        this.itemsElements = this.container.querySelectorAll('.sidebar__item');
        this.links = this.container.querySelectorAll('.sidebar__link');
    }

    /**
     * Vincula eventos aos elementos
     */
    bindEvents() {
        // Clique nos itens
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const index = parseInt(link.closest('.sidebar__item').dataset.index);
                this.setActive(index);
            });
        });

        // Botão de recolher/expandir
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleCollapse());
        }

        // Atalho: clique no logo também colapsa (opcional)
        const logoLink = this.container.querySelector('.sidebar__logo');
        if (logoLink) {
            logoLink.addEventListener('click', (e) => {
                // Navega para index.html (comportamento padrão do link)
                // Podemos também forçar o recolhimento se desejar
            });
        }
    }

    /**
     * Define o item ativo
     * @param {number} index - Índice do item
     */
    setActive(index) {
        this.itemsElements.forEach(el => el.classList.remove('sidebar__item--active'));
        const activeItem = this.container.querySelector(`.sidebar__item[data-index="${index}"]`);
        if (activeItem) {
            activeItem.classList.add('sidebar__item--active');
            this.activeIndex = index;
            // Dispara callback
            if (this.onSelect && this.items[index]) {
                this.onSelect(this.items[index], index);
            }
        }
    }

    /**
     * Alterna o recolhimento da sidebar
     */
    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        if (this.sidebarEl) {
            this.sidebarEl.classList.toggle('sidebar--collapsed', this.isCollapsed);
        }
        // Salva estado (opcional)
        Atlas.setStorage('sidebar_collapsed', this.isCollapsed);
    }

    /**
     * Atualiza dinamicamente os itens
     * @param {Array} newItems 
     */
    updateItems(newItems) {
        this.items = newItems;
        this.render();
        this.bindEvents();
        this.setActive(0);
    }
}

// Exportar para uso global
window.Sidebar = Sidebar;
