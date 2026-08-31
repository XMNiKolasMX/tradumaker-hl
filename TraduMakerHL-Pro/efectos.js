document.addEventListener('DOMContentLoaded', async () => {
    // -------------------------------------------------------------------------
    // 1. MENÚ RESPONSIVO (Móvil / Tablet - Hamburguesa)
    // -------------------------------------------------------------------------
    const navLinksContainer = document.querySelector('.nav-links');
    const headerContainer = document.querySelector('.nav-container');

    if (headerContainer && navLinksContainer) {
        // Crear dinámicamente el botón hamburguesa si no existe
        if (!document.querySelector('.menu-toggle')) {
            const menuToggle = document.createElement('div');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            headerContainer.insertBefore(menuToggle, navLinksContainer);

            // Estilos dinámicos para el botón hamburguesa
            menuToggle.style.cssText = `
                display: none;
                font-size: 1.5rem;
                color: white;
                cursor: pointer;
                padding: 5px;
            `;

            menuToggle.addEventListener('click', () => {
                navLinksContainer.classList.toggle('nav-active');
                const icon = menuToggle.querySelector('i');
                if (navLinksContainer.classList.contains('nav-active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        }
    }

    // -------------------------------------------------------------------------
    // 2. CONEXIÓN A SUPABASE (Últimos lanzamientos y Estado de Juegos)
    // -------------------------------------------------------------------------
    const SUPABASE_URL = 'https://vdwixgqicpdkyhslmqou.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_yJfaiIVchThcK4RADkdmnA_uvsr84h3';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const contenedorRecientes = document.getElementById('grid-recientes');
    const listaSidebar = document.getElementById('sidebar-translations-list');

    try {
        // A. Cargar Últimos Lanzamientos (4 juegos)
        if (contenedorRecientes) {
            const { data: juegosRecientes, error: errorRecientes } = await supabaseClient
                .from('juegos')
                .select('*')
                .order('id', { ascending: false })
                .limit(4);

            if (errorRecientes) throw errorRecientes;

            if (!juegosRecientes || juegosRecientes.length === 0) {
                contenedorRecientes.innerHTML = '<p class="no-games">No hay juegos registrados todavía en Supabase.</p>';
            } else {
                contenedorRecientes.innerHTML = juegosRecientes.map(juego => `
                    <div class="game-card">
                        <div class="game-img-container">
                            <img src="${juego.imagen}" alt="${juego.titulo}" class="game-img" onerror="this.src='https://via.placeholder.com/300x200?text=TraduMakerHL'">
                            <span class="game-tag">RPG Maker</span>
                        </div>
                        <div class="game-info">
                            <h3 class="game-title">${juego.titulo}</h3>
                            <a href="juego.html?id=${juego.id}" class="btn-enter">Entrar <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                        </div>
                    </div>
                `).join('');
            }
        }

        // B. Cargar Estado de Traducciones para el widget lateral del inicio
        if (listaSidebar) {
            const { data: juegosEstados, error: errorEstados } = await supabaseClient
                .from('juegos')
                .select('titulo, traducido')
                .order('id', { ascending: false });

            if (errorEstados) throw errorEstados;

            if (!juegosEstados || juegosEstados.length === 0) {
                listaSidebar.innerHTML = '<li class="sidebar-item"><span class="sidebar-game-title">No hay registros</span></li>';
            } else {
                listaSidebar.innerHTML = juegosEstados.map(juego => {
                    const isTraducido = juego.traducido;
                    const badgeClass = isTraducido ? 'completed' : 'progress';
                    const iconClass = isTraducido ? 'fa-check' : 'fa-hourglass-half';
                    const textStatus = isTraducido ? 'Traducido' : 'Traduciendo';

                    return `
                        <li class="sidebar-item">
                            <span class="sidebar-game-title" title="${juego.titulo}">${juego.titulo}</span>
                            <span class="status-badge ${badgeClass}">
                                <i class="fa-solid ${iconClass}"></i> ${textStatus}
                            </span>
                        </li>
                    `;
                }).join('');
            }
        }

    } catch (err) {
        console.error('Error al conectar con Supabase:', err);
        if (contenedorRecientes) contenedorRecientes.innerHTML = '<p class="error-msg">Error al conectar con Supabase.</p>';
        if (listaSidebar) listaSidebar.innerHTML = '<li class="sidebar-item"><span class="sidebar-game-title">Error de conexión</span></li>';
    }

    // -------------------------------------------------------------------------
    // 3. EFECTO DE APARICIÓN SUAVE (Fade-in Inteligente con Scroll)
    // Añadimos .guild-card para que las nuevas secciones también animen
    // -------------------------------------------------------------------------
    const elementsToAnimate = document.querySelectorAll('.game-card, .about-card, .value-box, .donate-card-pro, .feature-item, .guild-card');
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                observerInstance.unobserve(el);
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(el => observer.observe(el));

    // -------------------------------------------------------------------------
    // 4. ENLACE ACTIVO AUTOMÁTICO EN LA BARRA DE NAVEGACIÓN
    // -------------------------------------------------------------------------
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // -------------------------------------------------------------------------
    // 5. EFECTO HOVER DINÁMICO EN TARJETAS
    // -------------------------------------------------------------------------
    elementsToAnimate.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-6px)';
        });
        card.addEventListener('mouseleave', () => {
            // Si ya hizo fade-in y se quedó en translateY(0), mantenemos el 0 al quitar el hover
            if (card.style.opacity === '1') {
                card.style.transform = 'translateY(0)';
            }
        });
    });
});
