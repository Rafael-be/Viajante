// Sistema de Perfil do Caroneiro

class ProfileSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadUserProfile();
        this.setupEventListeners();
    }

    checkAuth() {
        const currentUser = JSON.parse(localStorage.getItem('caroneiro_currentUser'));
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }
        this.currentUser = currentUser;
    }

    loadUserProfile() {
        if (!this.currentUser) return;

        // Atualizar informações básicas
        document.getElementById('profile-name').textContent = this.currentUser.name;
        document.getElementById('profile-bio').textContent = this.currentUser.bio || 'Viajante do Caroneiro';
        
        // Atualizar foto se existir
        const profileImg = document.getElementById('profile-img');
        if (this.currentUser.photo && profileImg) {
            profileImg.src = this.currentUser.photo;
        }

        // Atualizar estatísticas
        this.updateStats();

        // Carregar viagens
        this.loadPastTrips();
        this.loadWishlist();

        // Preencher formulário de edição
        this.populateEditForm();
    }

    updateStats() {
        const tripsCount = this.currentUser.pastTrips?.length || 0;
        const friendsCount = this.currentUser.friends?.length || 0;

        document.getElementById('trips-count').textContent = tripsCount;
        document.getElementById('friends-count').textContent = friendsCount;
    }

    loadPastTrips() {
        const pastTripsContainer = document.getElementById('past-trips');
        if (!pastTripsContainer) return;

        const pastTrips = this.currentUser.pastTrips || [];

        if (pastTrips.length === 0) {
            pastTripsContainer.innerHTML = `
                <div class="empty-state">
                    <p>Nenhuma viagem realizada ainda</p>
                    <p>Comece planejando sua primeira viagem!</p>
                </div>
            `;
            return;
        }

        pastTripsContainer.innerHTML = pastTrips.map(trip => `
            <div class="trip-card">
                <div class="trip-image">
                    <img src="${trip.image || 'assets/images/trip-placeholder.jpg'}" alt="${trip.destination}">
                </div>
                <div class="trip-info">
                    <h4>${trip.destination}</h4>
                    <p class="trip-date">${this.formatDate(trip.date)}</p>
                    <p class="trip-description">${trip.description || 'Viagem incrível!'}</p>
                    <div class="trip-companions">
                        <span>Companheiros