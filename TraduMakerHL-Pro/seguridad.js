// ==========================================
// TRADEMAKER HL - SEGURIDAD GLOBAL AVANZADA
// ==========================================

// 1. Bloqueo estricto de clic derecho y teclas rápidas
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', function(e) {
    if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
        (e.ctrlKey && e.key === 'U')
    ) {
        e.preventDefault();
        return false;
    }
});

// 2. Trampa de Consola / Inspección (Muestra "No permitido" si abren el F12 o herramientas)
setInterval(function() {
    const antes = performance.now();
    debugger; // Esta línea congela y detecta si la consola está abierta
    const despues = performance.now();

    // Si el navegador tardó más de 100 milisegundos, significa que la consola está abierta e inspeccionando
    if (despues - antes > 100) {
        bloquearPorInspeccion();
    }
}, 500);

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
                    font-family: 'Inter', sans-serif, Arial;
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
                h1 { font-size: 24px; margin-bottom: 15px; font-family: 'Cinzel', serif; }
                p { color: #ccc; font-size: 15px; line-height: 1.5; }
            </style>
        </head>
        <body>
            <div class="box">
                <h1>🚫 INSPECCIÓN NO PERMITIDA</h1>
                <p>Las herramientas de desarrollo están bloqueadas por políticas de seguridad del sitio <strong>TraduMaker HL</strong>.</p>
                <p>Cierra la consola para continuar navegando.</p>
            </div>
        </body>
        </html>
    `;
}

// 3. Bloqueo estricto de VPN / Proxy / Datacenter (Mantenemos tu función anterior)
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
                <p>Por motivos de seguridad, debes <strong>desactivar la VPN</strong> para navegar aquí.</p>
            </div>
        </body>
        </html>
    `;
}

window.addEventListener('DOMContentLoaded', verificarSeguridadRed);
