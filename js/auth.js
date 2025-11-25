// Sistema de autenticação do Caroneiro - VERSÃO CORRIGIDA

// Dados de exemplo para teste
const defaultUsers = [
    {
        id: 'user1',
        name: 'João Viajante',
        email: 'joao@email.com',
        password: '123456',
        bio: 'Amo viajar e conhecer novas culturas!',
        interests: ['praia', 'aventura', 'cultura'],
        pastTrips: [],
        wishlist: [],
        friends: [],
        photo: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 'user2', 
        name: 'Maria Aventureira',
        email: 'maria@email.com',
        password: '123456',
        bio: 'Sempre em busca da próxima aventura!',
        interests: ['montanha', 'trilha', 'esportes'],
        pastTrips: [],
        wishlist: [],
        friends: [],
        photo: null,
        createdAt: new Date().toISOString()
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar usuários padrão se não existirem
    initializeDefaultUsers();
    
    // Verificar se estamos em uma página de autenticação
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Configurar login social (placeholders)
    setupSocialLogin();
});

function initializeDefaultUsers() {
    let users = JSON.parse(localStorage.getItem('caroneiro_users')) || [];
    
    // Adicionar usuários padrão se não existirem
    defaultUsers.forEach(defaultUser => {
        if (!users.find(u => u.email === defaultUser.email)) {
            users.push(defaultUser);
        }
    });
    
    localStorage.setItem('caroneiro_users', JSON.stringify(users));
}

// Manipular login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Buscar usuário
    const users = JSON.parse(localStorage.getItem('caroneiro_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Login bem-sucedido
        localStorage.setItem('caroneiro_currentUser', JSON.stringify(user));
        alert(`Bem-vindo de volta, ${user.name}!`);
        window.location.href = 'index.html';
    } else {
        alert('E-mail ou senha incorretos. Tente novamente.\n\nDica: Use joao@email.com / 123456');
    }
}

// Manipular cadastro
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const interests = document.getElementById('interests')?.value || '';
    
    // Validações básicas
    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('caroneiro_users')) || [];
    if (users.find(u => u.email === email)) {
        alert('Este e-mail já está cadastrado.');
        return;
    }
    
    // Criar novo usuário
    const newUser = {
        id: generateId(),
        name,
        email,
        password,
        bio: '',
        interests: interests.split(',').map(i => i.trim()).filter(i => i),
        pastTrips: [],
        wishlist: [],
        friends: [],
        photo: null,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('caroneiro_users', JSON.stringify(users));
    
    // Logar automaticamente
    localStorage.setItem('caroneiro_currentUser', JSON.stringify(newUser));
    alert(`Conta criada com sucesso! Bem-vindo, ${name}!`);
    window.location.href = 'index.html';
}

function setupSocialLogin() {
    // Placeholder para login social
    document.querySelectorAll('.btn-google, .btn-facebook').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Login com redes sociais será implementado em breve!\nPor enquanto, use o login tradicional.');
        });
    });
}

// Gerar ID único
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}