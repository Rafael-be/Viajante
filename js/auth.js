// Sistema de autenticação do Caroneiro

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos em uma página de autenticação
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Manipular login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Buscar usuário
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Login bem-sucedido
        localStorage.setItem('caroneiro_currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        alert('E-mail ou senha incorretos. Tente novamente.');
    }
}

// Manipular cadastro
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validações básicas
    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        alert('Este e-mail já está cadastrado.');
        return;
    }
    
    // Criar novo usuário
    const newUser = {
        id: generateId(),
        name,
        email,
        password, // Em produção, isso seria criptografado
        bio: '',
        interests: [],
        pastTrips: [],
        wishlist: [],
        friends: [],
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveData();
    
    // Logar automaticamente
    localStorage.setItem('caroneiro_currentUser', JSON.stringify(newUser));
    window.location.href = 'index.html';
}

// Gerar ID único
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}