
let apenasFavoritos = false;

function carregarCatalogo() {
    const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    const catalogo = document.getElementById('catalogo');
    const estatisticas = document.getElementById('estatisticas');
    const termoBusca = document.getElementById('inputBusca').value.toLowerCase();
    const filtroCat = document.getElementById('filtroCategoria').value;
    
    catalogo.innerHTML = '';

    // Filtragem
    const filmesFiltrados = filmes.filter((f, index) => {
        const matchesBusca = f.titulo.toLowerCase().includes(termoBusca);
        const matchesCat = filtroCat === 'Todos' || f.categoria === filtroCat;
        const matchesFav = !apenasFavoritos || f.favorito;
        f.originalIndex = index; // Preserva o index original para ações
        return matchesBusca && matchesCat && matchesFav;
    });

    if (filmesFiltrados.length === 0) {
        catalogo.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 50px; color: #b3b3b3;">Nenhum filme encontrado com os filtros atuais.</p>';
    } else {
        filmesFiltrados.forEach((f, i) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.animationDelay = `${i * 0.1}s`;
            
            card.innerHTML = `
                <button class="btn-favorito ${f.favorito ? 'is-fav' : ''}" onclick="toggleFavorito(${f.originalIndex})">
                    ${f.favorito ? '❤️' : '🤍'}
                </button>
                <img src="${f.capa}" alt="Capa de ${f.titulo}">
                <div class="card-content">
                    <span class="badge-categoria">${f.categoria || 'Outros'}</span>
                    <h3>${f.titulo}</h3>
                    <p>Minutos assistidos: ${f.minutos}</p>
                    <div class="card-actions">
                        <button class="btn-cinema" onclick="abrirCinema(${f.originalIndex})">Assistir 🎬</button>
                        <button class="btn-editar" onclick="editarFilme(${f.originalIndex})">✏️</button>
                    </div>
                    <button class="btn-excluir" onclick="confirmarExclusao(${f.originalIndex}, this)">Excluir Filme</button>
                </div>
            `;
            catalogo.appendChild(card);
        });
    }

    const total = filmesFiltrados.reduce((acc, f) => acc + f.minutos, 0);
    estatisticas.textContent = `Total de minutos assistidos (filtrados): ${total}`;
}

// Funções de Ação
function toggleFavorito(index) {
    const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    filmes[index].favorito = !filmes[index].favorito;
    localStorage.setItem('filmes', JSON.stringify(filmes));
    carregarCatalogo();
    showToast(filmes[index].favorito ? 'Adicionado aos favoritos!' : 'Removido dos favoritos');
}

function editarFilme(index) {
    window.location.href = `index.html?edit=${index}`;
}

function abrirCinema(index) {
    const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    const f = filmes[index];
    const modal = document.getElementById('modalCinema');
    const container = document.getElementById('videoContainer');
    const detalhes = document.getElementById('detalhesFilme');

    container.innerHTML = `<iframe src="https://www.youtube.com/embed/${f.youtube}?autoplay=1" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    detalhes.innerHTML = `
        <h2 style="color: #e50914;">${f.titulo}</h2>
        <p><strong>Categoria:</strong> ${f.categoria || 'Outros'}</p>
        <p><strong>Tempo assistido:</strong> ${f.minutos} minutos</p>
    `;
    
    modal.style.display = 'block';
}

function confirmarExclusao(index, element) {
    const card = element.closest('.card');
    if (confirm('Tem certeza que deseja excluir este filme?')) {
        card.style.animation = 'fadeIn 0.5s ease-in reverse forwards';
        setTimeout(() => {
            const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
            filmes.splice(index, 1);
            localStorage.setItem('filmes', JSON.stringify(filmes));
            carregarCatalogo();
            showToast('Filme removido!');
        }, 500);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    carregarCatalogo();
    
    document.getElementById('inputBusca').addEventListener('input', carregarCatalogo);
    document.getElementById('filtroCategoria').addEventListener('change', carregarCatalogo);
    
    document.getElementById('btnVerFavoritos').addEventListener('click', function() {
        apenasFavoritos = !apenasFavoritos;
        this.classList.toggle('active');
        this.textContent = apenasFavoritos ? 'Ver Todos 🎬' : 'Ver Favoritos ❤️';
        carregarCatalogo();
    });

    // Modal Close
    document.querySelector('.close-modal').onclick = () => {
        document.getElementById('modalCinema').style.display = 'none';
        document.getElementById('videoContainer').innerHTML = ''; // Para o vídeo
    };

    window.onclick = (event) => {
        const modal = document.getElementById('modalCinema');
        if (event.target == modal) {
            modal.style.display = 'none';
            document.getElementById('videoContainer').innerHTML = '';
        }
    };
});

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.5s ease-in reverse forwards';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
