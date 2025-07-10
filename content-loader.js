import { wpAPI } from './api.js';
import { WORDPRESS_CONFIG } from './config.js';

class ContentLoader {
  constructor() {
    this.isLoading = false;
  }

  // Mostrar/esconder loading
  toggleLoading(show = true) {
    const loader = document.getElementById('loading');
    if (loader) {
      loader.style.display = show ? 'flex' : 'none';
    }
  }

  // Carregar conteúdo da página inicial
  async loadHomeContent() {
    try {
      const homeData = await wpAPI.getPage(WORDPRESS_CONFIG.pageIds.home);
      if (homeData) {
        // Atualizar título principal
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && homeData.acf?.hero_title) {
          heroTitle.textContent = homeData.acf.hero_title;
        }

        // Atualizar subtítulo
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle && homeData.acf?.hero_subtitle) {
          heroSubtitle.textContent = homeData.acf.hero_subtitle;
        }

        // Atualizar imagem do hero
        const heroImage = document.querySelector('.hero-image');
        if (heroImage && homeData.acf?.hero_image) {
          heroImage.src = homeData.acf.hero_image;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo da home:', error);
    }
  }

  // Carregar informações do médico
  async loadDoctorInfo() {
    try {
      const doctorData = await wpAPI.getDoctorInfo();
      if (doctorData) {
        // Atualizar nome do médico
        const doctorName = document.querySelector('.doctor-name');
        if (doctorName && doctorData.acf?.doctor_name) {
          doctorName.textContent = doctorData.acf.doctor_name;
        }

        // Atualizar biografia
        const doctorBio = document.querySelector('.doctor-bio');
        if (doctorBio && doctorData.content?.rendered) {
          doctorBio.innerHTML = doctorData.content.rendered;
        }

        // Atualizar foto do médico
        const doctorPhoto = document.querySelector('.doctor-photo');
        if (doctorPhoto && doctorData.acf?.doctor_photo) {
          doctorPhoto.src = doctorData.acf.doctor_photo;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar informações do médico:', error);
    }
  }

  // Carregar procedimentos
  async loadProcedures() {
    try {
      const procedures = await wpAPI.getProcedures();
      if (procedures && procedures.length > 0) {
        const proceduresContainer = document.querySelector('.procedures-grid');
        if (proceduresContainer) {
          proceduresContainer.innerHTML = '';
          
          procedures.forEach((procedure, index) => {
            const procedureCard = this.createProcedureCard(procedure, index);
            proceduresContainer.appendChild(procedureCard);
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar procedimentos:', error);
    }
  }

  // Criar card de procedimento
  createProcedureCard(procedure, index) {
    const card = document.createElement('div');
    card.className = 'bg-gray-50 rounded-lg p-6 border hover:shadow-lg transition';
    card.style.cssText = `opacity:0;animation:fadeInUp 0.8s ease-out forwards;animation-delay:${index * 0.1}s`;
    
    const icon = procedure.acf?.icon || 'scalpel';
    const title = procedure.title?.rendered || 'Procedimento';
    const description = procedure.excerpt?.rendered || procedure.content?.rendered?.substring(0, 150) + '...';
    
    card.innerHTML = `
      <i data-lucide="${icon}" class="text-emerald-600 mb-4"></i>
      <h4 class="text-lg font-semibold mb-2">${title}</h4>
      <div class="text-gray-600 text-sm">${description}</div>
    `;
    
    return card;
  }

  // Carregar depoimentos
  async loadTestimonials() {
    try {
      const testimonials = await wpAPI.getTestimonials();
      if (testimonials && testimonials.length > 0) {
        const testimonialsContainer = document.querySelector('.testimonials-grid');
        if (testimonialsContainer) {
          testimonialsContainer.innerHTML = '';
          
          testimonials.forEach((testimonial, index) => {
            const testimonialCard = this.createTestimonialCard(testimonial, index);
            testimonialsContainer.appendChild(testimonialCard);
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar depoimentos:', error);
    }
  }

  // Criar card de depoimento
  createTestimonialCard(testimonial, index) {
    const card = document.createElement('blockquote');
    card.className = 'bg-gray-50 p-6 rounded-lg border hover:shadow-lg transition';
    card.style.cssText = `opacity:0;animation:fadeInUp 0.8s ease-out forwards;animation-delay:${index * 0.1}s`;
    
    const content = testimonial.content?.rendered || '';
    const authorName = testimonial.acf?.author_name || 'Cliente';
    const authorPhoto = testimonial.acf?.author_photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=64&q=60';
    
    card.innerHTML = `
      <div class="text-gray-600 mb-4">${content}</div>
      <div class="flex items-center gap-3">
        <img src="${authorPhoto}" class="w-12 h-12 rounded-full object-cover" alt="${authorName}">
        <span class="font-medium">${authorName}</span>
      </div>
    `;
    
    return card;
  }

  // Carregar estatísticas
  async loadStatistics() {
    try {
      const statsData = await wpAPI.getStatistics();
      if (statsData && statsData.length > 0) {
        const stats = statsData[0];
        
        // Atualizar estatísticas
        const satisfactionStat = document.querySelector('.satisfaction-stat');
        if (satisfactionStat && stats.acf?.satisfaction_rate) {
          satisfactionStat.textContent = stats.acf.satisfaction_rate + '%';
        }

        const proceduresStat = document.querySelector('.procedures-stat');
        if (proceduresStat && stats.acf?.total_procedures) {
          proceduresStat.textContent = '+' + stats.acf.total_procedures;
        }

        // Atualizar dados do gráfico
        if (stats.acf?.chart_data) {
          this.updateChart(stats.acf.chart_data);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }

  // Atualizar gráfico
  updateChart(chartData) {
    const ctx = document.getElementById('surgeryChart');
    if (ctx && chartData) {
      const chart = Chart.getChart(ctx);
      if (chart) {
        chart.data.labels = chartData.labels || ['2019', '2020', '2021', '2022', '2023'];
        chart.data.datasets[0].data = chartData.data || [1800, 1900, 2100, 2400, 2600];
        chart.update();
      }
    }
  }

  // Carregar informações de contato
  async loadContactInfo() {
    try {
      const contactData = await wpAPI.getPage(WORDPRESS_CONFIG.pageIds.contact);
      if (contactData) {
        // Atualizar endereço
        const address = document.querySelector('.contact-address');
        if (address && contactData.acf?.address) {
          address.textContent = contactData.acf.address;
        }

        // Atualizar telefone
        const phone = document.querySelector('.contact-phone');
        if (phone && contactData.acf?.phone) {
          phone.textContent = contactData.acf.phone;
        }

        // Atualizar email
        const email = document.querySelector('.contact-email');
        if (email && contactData.acf?.email) {
          email.textContent = contactData.acf.email;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar informações de contato:', error);
    }
  }

  // Carregar todo o conteúdo
  async loadAllContent() {
    this.toggleLoading(true);
    
    try {
      await Promise.all([
        this.loadHomeContent(),
        this.loadDoctorInfo(),
        this.loadProcedures(),
        this.loadTestimonials(),
        this.loadStatistics(),
        this.loadContactInfo()
      ]);
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error);
    } finally {
      this.toggleLoading(false);
    }
  }
}

export const contentLoader = new ContentLoader();