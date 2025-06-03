if (localStorage.getItem('igarden-auth') === 'true') {
    window.location.href = 'home.html';
}
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    let users = JSON.parse(localStorage.getItem('igarden-users') || '{}');
    if (users[user] && users[user] === pass) {
        localStorage.setItem('igarden-auth', 'true');
        localStorage.setItem('igarden-user', user);
        window.location.href = 'home.html';
    } else {
        document.getElementById('login-error').innerText = 'Usuário ou senha inválidos.';
        document.getElementById('login-error').style.display = 'block';
    }
});
