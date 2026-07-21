// ========== ОБЩИЕ ФУНКЦИИ ==========

function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

function generateId(prefix) {
    return prefix + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
}

function getStatusName(status) {
    const map = {
        'collecting': '🟡 Собирается',
        'sent': '🔵 Отправлен',
        'in_pvz': '🟢 В ПВЗ',
        'ready': '✅ Готов',
        'delivered': '📦 Выдан',
        'return': '🔄 Возврат'
    };
    return map[status] || status;
}

function openPhotoModal(imageSrc) {
    if (!imageSrc) return;
    let modal = document.getElementById('photoModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'photoModal';
        modal.className = 'photo-modal-overlay hidden';
        modal.innerHTML = `
            <button class="photo-modal-close" onclick="closePhotoModal()">✕</button>
            <div class="photo-modal-content" onclick="event.stopPropagation();">
                <img id="photoModalImage" src="">
            </div>
        `;
        document.body.appendChild(modal);
    }
    const img = document.getElementById('photoModalImage');
    img.src = imageSrc;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closePhotoModal();
});

console.log('📦 Utils загружены');
