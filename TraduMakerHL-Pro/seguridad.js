// ==========================================
// TRADEMAKER HL - SEGURIDAD GLOBAL (EXCEPTO ADMIN)
// ==========================================

// 1. Bloqueo general de clic derecho para usuarios comunes
document.addEventListener('contextmenu', e => {
    // Opcional: si quieres que el admin sí pueda hacer clic derecho, puedes dejar esto activo para todos,
    // o el sistema validará el rol abajo. Por seguridad estándar, lo dejamos para visitantes/usuarios.
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
        (e.ctrlKey && e.key === 'U')
    ) {
        // Permitiremos temporalmente si es admin (se gestiona en la validación asíncrona)
    }
});

// 2. Trampa de Consola Inteligente (Exime a Administradores y Moderadores)
async function iniciarSistemaSeguridad() {
    try {
        // Verificamos si hay una sesión activa en Supabase
        const { data: { session } } = await supabaseGlobal.auth.getSession();
        
        let esStaff = false;

        if (session && session.user) {
            // Consultamos el rol del usuario en la base de datos
            const { data: perfil } = await supabaseGlobal
                .from('usuarios_registrados')
                .select('rol')
                .eq('id', session.user.id)
                .single();

            const rol = perfil ? perfil.rol : 'usuario';
            
            // Si es admin o moderador, lo eximimos del bloqueo de inspección
            if (rol === 'admin' || rol === 'moderador') {
                esStaff = true;
            }
        }

        // Si NO es staff (es un usuario normal o visitante), activamos la trampa de inspección estricta
        if (!esStaff) {
            setInterval(function() {
                const antes = performance.now();
                debugger;
                const despues = performance.now();

                if (despues - antes > 100) {
                    bloquearPorInspeccion();
                }
            }, 500);
        }

    } catch (error) {
        console.error("Error en validación de seguridad de roles.");
    }
}

function bloquearPorInspeccion() {
    document.documentElement.innerHTML = `
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Inspección No Permitida</title>
            <style>
                body {
                    background-color: #0b0b0b;
                    color: #ff3333;
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    text-align: center;
                    flex-direction: column;
                }
                .box {
                    border: 2px solid #ff3333;
                    padding: 40px;
                    border-radius: 12px;
                    background: #141414;
                    box-shadow: 0 0 30px rgba(255, 0, 0, 0.4);
                    max-width: 500px;
                }
                h1 { font-size: 24px; margin-bottom: 15px; }
                p { color: #ccc; font-size: 15px; line-height: 1.5; }
            </style>
        </head>
        <body>
            <div class="box">
                <h1>🚫 INSPECCIÓN NO PERMITIDA</h1>
                <p>Las herramientas de desarrollo están restringidas para los visitantes del sitio <strong>TraduMaker HL</strong>.</p>
            </div>
        </body>
        </html>
    `;
}

// 3. Verificación de VPN (Aplica para todos por seguridad de red)
async function verificarSeguridadRed() {
    try {
        let respuesta = await fetch('https://ipwho.is/');
        let datos = await respuesta.json();

        if (datos && datos.success) {
            let esVpnOProxy = false;
            if (datos.connection) {
                let asnOrg = (datos.connection.asn && datos.connection.asn.org) ? datos.connection.asn.org.toLowerCase() : '';
                const proveedoresSospechosos = ['vpn', 'proxy', 'hosting', 'datacenter', 'ovh', 'digitalocean', 'aws', 'amazon', 'm247', 'hetzner', 'nordvpn', 'expressvpn'];
                for (let palabra of proveedoresSospechosos) {
                    if (asnOrg.includes(palabra)) {
                        esVpnOProxy = true;
                        break;
                    }
                }
            }
            if (esVpnOProxy || (datos.security && datos.security.vpn)) {
                // Opcional: si el admin usa VPN y no quieres que le bloquee, puedes omitirlo o dejarlo activo.
                destruirPantallaPorVpn();
            }
        }
    } catch (error) {
        console.error("Error validando red de seguridad.");
    }
}

function destruirPantallaPorVpn() {
    document.documentElement.innerHTML = `
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Acceso Denegado</title>
            <style>
                body {
                    background-color: #0b0b0b;
                    color: #ff3333;
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    text-align: center;
                    flex-direction: column;
                }
                .box {
                    border: 2px solid #ff3333;
                    padding: 40px;
                    border-radius: 10px;
                    background: #141414;
                    box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
                }
                h1 { font-size: 28px; margin-bottom: 10px; }
                p { color: #ccc; font-size: 16px; }
            </style>
        </head>
        <body>
            <div class="box">
                <h1>⚠️ ACCESO DENEGADO</h1>
                <p>Se ha detectado el uso de una <strong>VPN, Proxy o Red Anónima</strong>.</p>
                <p>Debes desactivarla para navegar en el sitio.</p>
            </div>
        </body>
        </html>
    `;
}

// Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    iniciarSistemaSeguridad();
    verificarSeguridadRed();
});
