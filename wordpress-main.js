import { contentLoader } from './content-loader.js';
import { formHandler } from './form-handler.js';

// Mobile menu
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('hidden');
});

// Lucide Icons
lucide.createIcons();

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Chart.js - Inicializar com dados padrão
const ctx = document.getElementById('surgeryChart').getContext('2d');
const surgeryChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [{
      label: 'Cirurgias',
      data: [1800, 1900, 2100, 2400, 2600],
      borderColor: '#059669',
      backgroundColor: 'rgba(5,150,105,.2)',
      tension: .4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#059669'
    }]
  },
  options: {
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#e5e7eb' }, ticks: { stepSize: 500 } }
    }
  }
});

// Dynamic keyframes for animations
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {0%{opacity:0}100%{opacity:1}}
  @keyframes fadeInUp {0%{opacity:0;transform:translateY(40px)}100%{opacity:1;transform:translateY(0)}}
  .animate-spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);

// Carregar conteúdo quando a página estiver pronta
document.addEventListener('DOMContentLoaded', async () => {
  // Aguardar um pouco para garantir que todos os elementos estejam carregados
  setTimeout(async () => {
    await contentLoader.loadAllContent();
    lucide.createIcons(); // Recriar ícones após carregar conteúdo
  }, 500);
});

// Recarregar conteúdo a cada 5 minutos (opcional)
setInterval(async () => {
  await contentLoader.loadAllContent();
  lucide.createIcons();
}, 300000); // 5 minutos