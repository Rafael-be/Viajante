// Sistema de Chat do Caroneiro - VERSÃO CORRIGIDA

class ChatSystem {
    constructor() {
        this.currentConversation = null;
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadConversations();
        this.setupEventListeners();
    }

    checkAuth() {
        const currentUser = JSON.parse(localStorage.getItem('caroneiro_currentUser'));
        if (!currentUser) {
            // Se não está logado, mostra mensagem amigável
            this.showLoginMessage();
            return;
        }
        this.currentUser = currentUser;
    }

    showLoginMessage() {
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.innerHTML = `
                <div class="auth-required-message">
                    <div class="message-content">
                        <h2>💬 Acesso ao Chat</h2>
                        <p>Para usar o chat, você precisa estar logado.</p>
                        <div class="auth-actions">
                            <a href="login.html" class="btn-primary">Fazer Login</a>
                            <a href="register.html" class="btn-secondary">Criar Conta</a>
                            <a href="index.html" class="btn-link">Voltar para Início</a>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    setupEventListeners() {
        // Botão logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Só configura os outros listeners se o usuário estiver logado
        if (!this.currentUser) return;

        // Botão nova conversa
        const newChatBtn = document.getElementById('new-chat-btn');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => this.showNewChatModal());
        }

        // Enviar mensagem
        const sendBtn = document.getElementById('send-btn');
        const messageInput = document.getElementById('message-input');
        
        if (sendBtn && messageInput) {
            sendBtn.addEventListener('click', () => this.sendMessage());
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Modal nova conversa
        const modal = document.getElementById('new-chat-modal');
        const closeBtn = modal?.querySelector('.close');
        const userSearch = document.getElementById('user-search');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideNewChatModal());
        }

        if (userSearch) {
            userSearch.addEventListener('input', (e) => this.searchUsers(e.target.value));
        }

        // Fechar modal ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideNewChatModal();
            }
        });

        // Botões de ação
        const attachBtn = document.getElementById('attach-btn');
        const locationBtn = document.getElementById('location-btn');

        if (attachBtn) {
            attachBtn.addEventListener('click', () => this.handleAttachment());
        }

        if (locationBtn) {
            locationBtn.addEventListener('click', () => this.shareLocation());
        }
    }

    handleLogout() {
        localStorage.removeItem('caroneiro_currentUser');
        window.location.href = 'index.html';
    }

    loadConversations() {
        // Só carrega conversas se o usuário estiver logado
        if (!this.currentUser) return;

        const conversations = JSON.parse(localStorage.getItem('caroneiro_conversations')) || [];
        const conversationsList = document.getElementById('conversations-list');
        
        if (!conversationsList) return;

        // Filtrar conversas do usuário atual
        const userConversations = conversations.filter(conv => 
            conv.participants.includes(this.currentUser.id)
        );

        if (userConversations.length === 0) {
            conversationsList.innerHTML = `
                <div class="empty-state">
                    <p>Nenhuma conversa iniciada</p>
                    <p>Clique em "Nova Conversa" para começar</p>
                </div>
            `;
            return;
        }

        conversationsList.innerHTML = userConversations.map(conv => {
            const otherParticipant = this.getUserById(
                conv.participants.find(id => id !== this.currentUser.id)
            );
            const lastMessage = conv.messages[conv.messages.length - 1];
            const unreadCount = conv.messages.filter(msg => 
                !msg.read && msg.senderId !== this.currentUser.id
            ).length;

            return `
                <div class="conversation-item" data-conversation-id="${conv.id}">
                    <div class="conversation-avatar">
                        <img src="${otherParticipant?.photo || 'assets/images/default-avatar.png'}" alt="${otherParticipant?.name}">
                    </div>
                    <div class="conversation-info">
                        <div class="conversation-header">
                            <h4>${otherParticipant?.name || 'Usuário'}</h4>
                            <span class="conversation-time">${this.formatTime(lastMessage?.timestamp)}</span>
                        </div>
                        <p class="conversation-preview">${lastMessage?.content || 'Nenhuma mensagem'}</p>
                        ${unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        // Adicionar event listeners para as conversas
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                const conversationId = item.dataset.conversationId;
                this.openConversation(conversationId);
            });
        });
    }

    // ... (o resto do código permanece igual - showNewChatModal, hideNewChatModal, etc.)

    getUserById(userId) {
        const users = JSON.parse(localStorage.getItem('caroneiro_users')) || [];
        return users.find(user => user.id === userId);
    }

    formatTime(timestamp) {
        if (!timestamp) return '';
        
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString('pt-BR');
        }
    }

    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Inicializar o sistema de chat quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    new ChatSystem();
});