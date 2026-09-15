// ==========================================
// TRADEMAKER HL - SEGURIDAD GLOBAL
// ==========================================

// 1. Bloqueo de inspección, clic derecho y atajos de desarrollador
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

// 2. Bloqueo estricto de VPN / Proxy / Datacenter
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
                <p>Por motivos de seguridad y políticas de la plataforma, debes <strong>desactivar la VPN</strong> para poder navegar en este sitio.</p>
            </div>
        </body>
        </html>
    `;
}

window.addEventListener('DOMContentLoaded', verificarSeguridadRed);
