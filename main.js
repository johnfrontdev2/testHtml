// Mobile menu
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('hidden');
});

// Lucide Icons
lucide.createIcons();

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Chart.js
const ctx = document.getElementById('surgeryChart').getContext('2d');
new Chart(ctx, {
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
`;
document.head.appendChild(style);