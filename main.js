
class Filme {
    constructor(titulo, capa, youtube, categoria, minutos, favorito = false) {
        this.titulo = titulo;
        this.capa = capa;
        this.youtube = youtube;
        this.categoria = categoria;
        this.minutos = minutos;
        this.favorito = favorito;
    }
}

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

// Carregar dados para edição se houver um parâmetro na URL
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const editIndex = urlParams.get('edit');
    
    if (editIndex !== null) {
        const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
        const f = filmes[editIndex];
        
        if (f) {
            document.getElementById('titulo').value = f.titulo;
            document.getElementById('capa').value = f.capa;
            document.getElementById('youtube').value = f.youtube;
            document.getElementById('categoria').value = f.categoria || 'Outros';
            document.getElementById('minutos').value = f.minutos;
            document.getElementById('editIndex').value = editIndex;
            document.getElementById('btnSubmit').textContent = 'Salvar Alterações';
            document.querySelector('h2').textContent = 'Editar Filme';
        }
    }
});

document.getElementById('filmeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('btnSubmit');
    const originalText = btn.textContent;
    
    btn.classList.add('btn-loading');
    btn.disabled = true;

    await new Promise(resolve => setTimeout(resolve, 600));

    const titulo = document.getElementById('titulo').value;
    const capa = document.getElementById('capa').value;
    const youtube = document.getElementById('youtube').value;
    const categoria = document.getElementById('categoria').value;
    const minutos = Number(document.getElementById('minutos').value);
    const editIndex = Number(document.getElementById('editIndex').value);

    const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    
    if (editIndex > -1) {
        // Modo Edição
        filmes[editIndex].titulo = titulo;
        filmes[editIndex].capa = capa;
        filmes[editIndex].youtube = youtube;
        filmes[editIndex].categoria = categoria;
        filmes[editIndex].minutos = minutos;
        showToast('Filme atualizado com sucesso!');
    } else {
        // Modo Cadastro
        const filme = new Filme(titulo, capa, youtube, categoria, minutos);
        filmes.push(filme);
        showToast('Filme adicionado com sucesso!');
    }
    
    localStorage.setItem('filmes', JSON.stringify(filmes));
    
    btn.classList.remove('btn-loading');
    btn.disabled = false;
    btn.textContent = 'Sucesso! ✨';
    
    setTimeout(() => {
        if (editIndex > -1) {
            window.location.href = 'catalogo.html';
        } else {
            btn.textContent = originalText;
            e.target.reset();
            document.getElementById('editIndex').value = '-1';
        }
    }, 1500);
});
