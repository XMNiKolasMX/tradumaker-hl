document.addEventListener('DOMContentLoaded', () => {
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

            // Estilos dinámicos para el botón hamburguesa (para asegurar que funcione sin alterar tu CSS)
            menuToggle.style.cssText = `
                display: none;
                font-size: 1.5rem;
                color: white;
                cursor: pointer;
                padding: 5px;
            `;

            // Media query lógica inyectada o manejada por clases
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
    // 2. EFECTO DE APARICIÓN SUAVE (Fade-in Inteligente con Scroll)
    // -------------------------------------------------------------------------
    const elementsToAnimate = document.querySelectorAll('.game-card, .about-card, .value-box, .donate-card-pro, .feature-item');
    
    // Preparar elementos ocultos inicialmente
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Se activa cuando el 15% del elemento es visible
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                observerInstance.unobserve(el); // Dejar de observar una vez animado
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(el => observer.observe(el));

    // -------------------------------------------------------------------------
    // 3. ENLACE ACTIVO AUTOMÁTICO EN LA BARRA DE NAVEGACIÓN
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
    // 4. EFECTO HOVER DINÁMICO EXTRA (Efecto sutil de brillo o elevación en tarjetas)
    // -------------------------------------------------------------------------
    elementsToAnimate.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-6px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});