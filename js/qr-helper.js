// ========== QR HELPER ==========
function generateQR(container, data) {
    container.innerHTML = '';
    
    try {
        const text = typeof data === 'string' ? data : JSON.stringify(data);
        const encoded = encodeURIComponent(text);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encoded}&format=png&bgcolor=ffffff&color=1a1a2e&margin=10`;
        
        const img = document.createElement('img');
        img.src = qrUrl;
        img.alt = 'QR-код';
        img.style.width = '180px';
        img.style.height = '180px';
        img.style.borderRadius = '12px';
        img.style.background = 'white';
        img.style.padding = '10px';
        
        img.onerror = function() {
            this.src = `https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${encoded}&choe=UTF-8&chld=H|0`;
        };
        
        container.appendChild(img);
        return true;
    } catch(e) {
        console.error('QR ошибка:', e);
        container.innerHTML = '<div style="color:#ff4444;">⚠️ Ошибка QR</div>';
        return false;
    }
}
