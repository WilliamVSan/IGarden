document.addEventListener('DOMContentLoaded', function() {
    var logoutBtn = document.getElementById('profile-menu-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('igarden-auth');
            localStorage.removeItem('igarden-user');
            window.location.href = 'login.html';
        });
    }
});

window.capturedImageDataUrl = null;
window.isCapturedImageSelected = false;
const openCameraBtn = document.getElementById('open-camera-btn');
const cameraModal = document.getElementById('camera-modal');
const closeCameraModal = document.getElementById('close-camera-modal');
const cameraVideo = document.getElementById('camera-video');
const takePhotoBtn = document.getElementById('take-photo-btn');
if (takePhotoBtn) {
    takePhotoBtn.innerHTML = '<i class="fas fa-camera"></i>';
}
const cameraCanvas = document.getElementById('camera-canvas');
const imagePreview = document.getElementById('image-preview');
const imagePreviewContainer = document.getElementById('image-preview-container');
let cameraStream = null;

// Adicione o botão de alternância de câmera
let switchCameraBtn = document.getElementById('switch-camera-btn');
if (!switchCameraBtn) {
    switchCameraBtn = document.createElement('button');
    switchCameraBtn.type = 'button';
    switchCameraBtn.id = 'switch-camera-btn';
    switchCameraBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    switchCameraBtn.style.marginTop = '8px';
    switchCameraBtn.style.backgroundColor = '#b2d8b2';
    switchCameraBtn.style.color = '#fff';
    switchCameraBtn.style.border = 'none';
    switchCameraBtn.style.padding = '8px 16px';
    switchCameraBtn.style.borderRadius = '6px';
    switchCameraBtn.style.cursor = 'pointer';
    // Adiciona o botão ao modal da câmera
    const cameraModalContent = cameraModal.querySelector('.modal-content');
    cameraModalContent.insertBefore(switchCameraBtn, takePhotoBtn);
}

let currentFacingMode = 'environment';

async function startCamera(facingMode = 'environment') {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
        cameraVideo.srcObject = cameraStream;
        currentFacingMode = facingMode;
    } catch (err) {
        alert('Não foi possível acessar a câmera.');
        cameraModal.style.display = 'none';
    }
}

function updateImagePreview(src, highlight = false) {
    if (src) {
        imagePreview.src = src;
        imagePreview.style.display = 'inline-block';
        imagePreview.style.border = highlight ? '3px solid #4CAF50' : '1px solid #ccc';
    } else {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
        imagePreview.style.border = '1px solid #ccc';
    }
}

imagePreview.addEventListener('click', function() {
    if (window.capturedImageDataUrl && imagePreview.src === window.capturedImageDataUrl) {
        window.isCapturedImageSelected = !window.isCapturedImageSelected;
        updateImagePreview(window.capturedImageDataUrl, window.isCapturedImageSelected);
    }
});

openCameraBtn.addEventListener('click', async function() {
    cameraModal.style.display = 'flex';
    cameraCanvas.style.display = 'none';
    cameraVideo.style.display = 'block';
    await startCamera('environment'); // Sempre abre na traseira
});

switchCameraBtn.addEventListener('click', async function() {
    const newFacing = currentFacingMode === 'environment' ? 'user' : 'environment';
    await startCamera(newFacing);
});

closeCameraModal.addEventListener('click', function() {
    cameraModal.style.display = 'none';
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
});

takePhotoBtn.addEventListener('click', function() {
    if (!cameraVideo.srcObject) return;
    cameraCanvas.width = cameraVideo.videoWidth;
    cameraCanvas.height = cameraVideo.videoHeight;
    cameraCanvas.getContext('2d').drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);
    window.capturedImageDataUrl = cameraCanvas.toDataURL('image/png');
    window.isCapturedImageSelected = true;
    updateImagePreview(window.capturedImageDataUrl, true);
    cameraCanvas.style.display = 'block';
    cameraVideo.style.display = 'none';
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    setTimeout(() => {
        cameraModal.style.display = 'none';
    }, 600);
});

document.querySelector('.close-modal').addEventListener('click', function () {
    cameraModal.style.display = 'none';
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
});

document.getElementById('image-upload').addEventListener('change', function(e) {
    window.capturedImageDataUrl = null;
    window.isCapturedImageSelected = false;
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(ev) {
            updateImagePreview(ev.target.result, false);
        };
        reader.readAsDataURL(this.files[0]);
    } else {
        updateImagePreview(null);
    }
});

document.getElementById('custom-upload-btn').addEventListener('click', function() {
    document.getElementById('image-upload').click();
});

document.getElementById('image-upload').addEventListener('change', function() {
    const btn = document.getElementById('custom-upload-btn');
    if (this.files && this.files[0]) {
        btn.innerHTML = `<i class="fas fa-upload"></i> ${this.files[0].name}`;
    } else {
        btn.innerHTML = `<i class="fas fa-upload"></i> Escolher arquivo`;
    }
});

const plantTypeSelect = document.getElementById('plant-type');
const customSelectBtn = document.getElementById('custom-select-btn');
const customSelectLabel = document.getElementById('custom-select-label');

customSelectBtn.addEventListener('click', function() {
    plantTypeSelect.style.opacity = '1';
    plantTypeSelect.style.position = 'static';
    plantTypeSelect.style.left = '0';
    plantTypeSelect.size = plantTypeSelect.options.length;
    plantTypeSelect.focus();

    plantTypeSelect.onblur = function() {
        plantTypeSelect.size = 0;
        plantTypeSelect.style.opacity = '0';
        plantTypeSelect.style.position = 'absolute';
        plantTypeSelect.style.left = '-9999px';
    };
});

plantTypeSelect.addEventListener('change', function() {
    const selectedOption = plantTypeSelect.options[plantTypeSelect.selectedIndex];
    customSelectLabel.textContent = selectedOption.text;
    plantTypeSelect.size = 0;
    plantTypeSelect.style.opacity = '0';
    plantTypeSelect.style.position = 'absolute';
    plantTypeSelect.style.left = '-9999px';
});

customSelectBtn.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        plantTypeSelect.focus();
        plantTypeSelect.click();
        e.preventDefault();
    }
});

document.getElementById('add-card-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const plantName = document.getElementById('plant-name').value;
    const plantType = document.getElementById('plant-type').value;
    const recommendations = typeof plantRecommendations !== "undefined" ? plantRecommendations[plantType] : undefined;

    const selectedIcon = document.querySelector('.icon-selector img.selected');
    const iconUrl = selectedIcon ? selectedIcon.src : null;

    const imageUpload = document.getElementById('image-upload').files[0];
    let imageUrl = null;

    if (window.capturedImageDataUrl && window.isCapturedImageSelected) {
        imageUrl = window.capturedImageDataUrl;
    } else if (imageUpload) {
        imageUrl = URL.createObjectURL(imageUpload);
    }

    // Crie o objeto da nova planta no formato esperado pelas notificações
    const createdAt = new Date().toISOString();
    const timestamp = Date.now();
    const newPlant = {
        name: plantName,
        type: plantType,
        waterLevel: recommendations?.waterLevel ?? '',
        temperature: recommendations?.temperature ?? '',
        lightLevel: recommendations?.lightLevel ?? '',
        favorited: false,
        timestamp: timestamp,
        createdAt: createdAt,
        imageUrl: imageUrl,
        iconUrl: iconUrl
    };

    // Salve no localStorage do usuário
    let plants = [];
    if (typeof getUserPlants === "function") {
        plants = getUserPlants();
        plants.push(newPlant);
        setUserPlants(plants);

        // Adicional: mantenha o localStorage global sincronizado para notificações
        localStorage.setItem('plants', JSON.stringify(plants));
    } else {
        // fallback para localStorage global (não recomendado)
        plants = JSON.parse(localStorage.getItem('plants') || '[]');
        plants.push(newPlant);
        localStorage.setItem('plants', JSON.stringify(plants));
    }

    // Atualize a UI
    if (typeof loadPlantsFromLocalStorage === "function") loadPlantsFromLocalStorage();
    if (typeof checkForCards === "function") checkForCards();
    if (typeof updateCardCounter === "function") updateCardCounter();

    // Feche o modal e limpe o formulário
    document.getElementById('add-card-modal').style.display = 'none';
    document.getElementById('add-card-form').reset();
    document.querySelectorAll('.icon-selector img').forEach(img => img.classList.remove('selected'));

    window.capturedImageDataUrl = null;
    window.isCapturedImageSelected = false;
    if (typeof updateImagePreview === 'function') updateImagePreview(null);
});

document.getElementById('menu-add-card').addEventListener('click', function () {
    window.capturedImageDataUrl = null;
    window.isCapturedImageSelected = false;
    updateImagePreview(null);
    document.getElementById('image-upload').value = '';
});
