document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('reg-username').value.trim();
    const pass = document.getElementById('reg-password').value;
    const pass2 = document.getElementById('reg-password2').value;
    const errorDiv = document.getElementById('register-error');
    const successDiv = document.getElementById('register-success');
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    if (!user || !pass || !pass2) {
        errorDiv.innerText = 'Preencha todos os campos.';
        errorDiv.style.display = 'block';
        return;
    }
    if (pass !== pass2) {
        errorDiv.innerText = 'As senhas não coincidem.';
        errorDiv.style.display = 'block';
        return;
    }
    // Checa se usuário já existe
    let users = JSON.parse(localStorage.getItem('igarden-users') || '{}');
    if (users[user]) {
        errorDiv.innerText = 'Usuário já cadastrado.';
        errorDiv.style.display = 'block';
        return;
    }
    // Salva usuário (senha em texto puro, apenas para demo!)
    users[user] = pass;
    localStorage.setItem('igarden-users', JSON.stringify(users));
    successDiv.innerText = 'Cadastro realizado com sucesso! Redirecionando para login...';
    successDiv.style.display = 'block';
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1200);
});
