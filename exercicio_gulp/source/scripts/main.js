document.addEventListener('DOMContentLoaded', () => {
    const btn = document.createElement('button');
    btn.textContent = 'Clique aqui!';
    btn.onclick = () => alert('Você clicou no botão!');
    document.body.appendChild(btn);
});
