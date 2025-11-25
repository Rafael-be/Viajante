// App principal do Caroneiro

// Simulação de banco de dados local
let users = JSON.parse(localStorage.getItem('caroneiro_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('caroneiro_currentUser')) || null;
let conversations = JSON.parse(localStorage.getItem('caroneiro_conversations')) || [];

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    checkAuthStatus();
    
    // Carregar destinos em destaque na página inicial
    if (document.querySelector('.destinations-grid')) {
        loadFeaturedDestinations();
    }
    
    // Configurar eventos de logout
    const logoutButtons = document.querySelectorAll('#logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', handleLogout);
    });
});

// Verificar status de autenticação
function checkAuthStatus() {
    const protectedPages = ['profile.html', 'chat.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Se estiver na página de login/cadastro e já estiver logado, redirecionar
    if ((currentPage === 'login.html' || currentPage === 'register.html') && currentUser) {
        window.location.href = 'index.html';
        return;
    }
}

// Carregar destinos em destaque
function loadFeaturedDestinations() {
    const destinationsGrid = document.querySelector('.destinations-grid');
    if (!destinationsGrid) return;
    
    const featuredDestinations = [
        { name: 'Rio de Janeiro', country: 'Brasil', image: 'assets/images/rio.jpg' },
        { name: 'São Paulo', country: 'Brasil', image: 'assets/images/sao-paulo.jpg' },
        { name: 'Florianópolis', country: 'Brasil', image: 'assets/images/florianopolis.jpg' },
        { name: 'Salvador', country: 'Brasil', image: 'assets/images/salvador.jpg' }
    ];
    
    destinationsGrid.innerHTML = featuredDestinations.map(destination => `
        <div class="destination-card">
            <div class="destination-image">
                <img src="${destination.image}" alt="${destination.name}">
            </div>
            <div class="destination-info">
                <h3>${destination.name}</h3>
                <p>${destination.country}</p>
            </div>
        </div>
    `).join('');
}

// Manipular logout
function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('caroneiro_currentUser');
    currentUser = null;
    window.location.href = 'index.html';
}

// Função para buscar usuários
function searchUsers(query) {
    return users.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.interests.some(interest => 
            interest.toLowerCase().includes(query.toLowerCase())
        )
    );
}

// Função para buscar destinos
function searchDestinations(query) {
    // Em uma implementação real, isso viria de uma API
    const allDestinations = [
        'Rio de Janeiro', 'São Paulo', 'Belo Horizonte', 'Brasília', 'Salvador',
        'Fortaleza', 'Recife', 'Porto Alegre', 'Florianópolis', 'Curitiba'
    ];
    
    return allDestinations.filter(destination => 
        destination.toLowerCase().includes(query.toLowerCase())
    );
}

// Salvar dados no localStorage
function saveData() {
    localStorage.setItem('caroneiro_users', JSON.stringify(users));
    localStorage.setItem('caroneiro_conversations', JSON.stringify(conversations));
}