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
const cameraCanvas = document.getElementById('camera-canvas');
const imagePreview = document.getElementById('image-preview');
const imagePreviewContainer = document.getElementById('image-preview-container');
let cameraStream = null;

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
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraVideo.srcObject = cameraStream;
    } catch (err) {
        alert('Não foi possível acessar a câmera.');
        cameraModal.style.display = 'none';
    }
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
    const imageUpload = document.getElementById('image-upload').files[0];
    let imageUrl = null;

    if (capturedImageDataUrl && isCapturedImageSelected) {
        imageUrl = capturedImageDataUrl;
    } else if (imageUpload) {
        imageUrl = URL.createObjectURL(imageUpload);
    }

    document.getElementById('add-card-modal').style.display = 'none';
});

document.getElementById('menu-add-card').addEventListener('click', function () {
    window.capturedImageDataUrl = null;
    window.isCapturedImageSelected = false;
    updateImagePreview(null);
    document.getElementById('image-upload').value = '';
});
