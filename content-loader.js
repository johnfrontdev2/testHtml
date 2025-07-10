import { wpAPI } from './api.js';
import { WORDPRESS_CONFIG } from './config.js';

class ContentLoader {
  constructor() {
    this.isLoading = false;
    this.siteSettings = null;
  }

  // Mostrar/esconder loading
  toggleLoading(show = true) {
    const loader = document.getElementById('loading');
    if (loader) {
      loader.style.display = show ? 'flex' : 'none';
    }
  }

  // Carregar configurações gerais do site
  async loadSiteSettings() {
    try {
      this.siteSettings = await wpAPI.getSiteSettings();
      if (this.siteSettings) {
        // Atualizar título do site
        const siteTitle = this.siteSettings.acf?.site_title || 'Dr. João da Silva';
        document.title = `${siteTitle} – ${this.siteSettings.acf?.site_subtitle || 'Cirurgião Geral em Brasília'}`;
        
        // Atualizar nome do médico no header
        const doctorNameHeader = document.querySelector('.doctor-name');
        if (doctorNameHeader) {
          doctorNameHeader.textContent = siteTitle;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações do site:', error);
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
          heroImage.alt = homeData.acf?.hero_image_alt || 'Foto do médico';
        }

        // Atualizar textos dos botões
        const btnConsulta = document.querySelector('.btn-consulta');
        if (btnConsulta && homeData.acf?.btn_consulta_text) {
          btnConsulta.textContent = homeData.acf.btn_consulta_text;
        }

        const btnCurriculum = document.querySelector('.btn-curriculum');
        if (btnCurriculum && homeData.acf?.btn_curriculum_text) {
          btnCurriculum.textContent = homeData.acf.btn_curriculum_text;
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
        // Atualizar título da seção
        const aboutTitle = document.querySelector('.about-title');
        if (aboutTitle && doctorData.acf?.about_title) {
          aboutTitle.textContent = doctorData.acf.about_title;
        }

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
          doctorPhoto.alt = doctorData.acf?.doctor_photo_alt || 'Equipe médica';
        }

        // Atualizar lista de benefícios
        const benefits = ['benefit_1', 'benefit_2', 'benefit_3'];
        benefits.forEach((benefit, index) => {
          const benefitElement = document.querySelector(`.benefit-${index + 1}`);
          if (benefitElement && doctorData.acf?.[benefit]) {
            benefitElement.textContent = doctorData.acf[benefit];
          }
        });
      }
    } catch (error) {
      console.error('Erro ao carregar informações do médico:', error);
    }
  }

  // Carregar procedimentos
  async loadProcedures() {
    try {
      // Carregar título da seção
      const proceduresData = await wpAPI.getPage(WORDPRESS_CONFIG.pageIds.procedures);
      if (proceduresData) {
        const proceduresTitle = document.querySelector('.procedures-title');
        if (proceduresTitle && proceduresData.acf?.procedures_title) {
          proceduresTitle.textContent = proceduresData.acf.procedures_title;
        }
      }

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
      // Carregar título da seção
      const testimonialsData = await wpAPI.getPage(WORDPRESS_CONFIG.pageIds.testimonials);
      if (testimonialsData) {
        const testimonialsTitle = document.querySelector('.testimonials-title');
        if (testimonialsTitle && testimonialsData.acf?.testimonials_title) {
          testimonialsTitle.textContent = testimonialsData.acf.testimonials_title;
        }
      }

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
        
        // Atualizar título da seção
        const statsTitle = document.querySelector('.stats-title');
        if (statsTitle && stats.acf?.stats_title) {
          statsTitle.textContent = stats.acf.stats_title;
        }

        // Atualizar descrição da seção
        const statsDescription = document.querySelector('.stats-description');
        if (statsDescription && stats.acf?.stats_description) {
          statsDescription.textContent = stats.acf.stats_description;
        }

        // Atualizar estatísticas
        const satisfactionStat = document.querySelector('.satisfaction-stat');
        if (satisfactionStat && stats.acf?.satisfaction_rate) {
          satisfactionStat.textContent = stats.acf.satisfaction_rate + '%';
        }

        const satisfactionLabel = document.querySelector('.satisfaction-label');
        if (satisfactionLabel && stats.acf?.satisfaction_label) {
          satisfactionLabel.textContent = stats.acf.satisfaction_label;
        }

        const proceduresStat = document.querySelector('.procedures-stat');
        if (proceduresStat && stats.acf?.total_procedures) {
          proceduresStat.textContent = '+' + stats.acf.total_procedures;
        }

        const proceduresLabel = document.querySelector('.procedures-label');
        if (proceduresLabel && stats.acf?.procedures_label) {
          proceduresLabel.textContent = stats.acf.procedures_label;
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
        // Atualizar título do formulário
        const contactTitle = document.querySelector('.contact-title');
        if (contactTitle && contactData.acf?.contact_title) {
          contactTitle.textContent = contactData.acf.contact_title;
        }

        // Atualizar labels do formulário
        const nameLabel = document.querySelector('.name-label');
        if (nameLabel && contactData.acf?.name_label) {
          nameLabel.textContent = contactData.acf.name_label;
        }

        const emailLabel = document.querySelector('.email-label');
        if (emailLabel && contactData.acf?.email_label) {
          emailLabel.textContent = contactData.acf.email_label;
        }

        const messageLabel = document.querySelector('.message-label');
        if (messageLabel && contactData.acf?.message_label) {
          messageLabel.textContent = contactData.acf.message_label;
        }

        // Atualizar placeholders
        const nameInput = document.querySelector('input[name="name"]');
        if (nameInput && contactData.acf?.name_placeholder) {
          nameInput.placeholder = contactData.acf.name_placeholder;
        }

        const emailInput = document.querySelector('input[name="email"]');
        if (emailInput && contactData.acf?.email_placeholder) {
          emailInput.placeholder = contactData.acf.email_placeholder;
        }

        const messageInput = document.querySelector('textarea[name="message"]');
        if (messageInput && contactData.acf?.message_placeholder) {
          messageInput.placeholder = contactData.acf.message_placeholder;
        }

        // Atualizar texto do botão
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn && contactData.acf?.submit_btn_text) {
          submitBtn.innerHTML = `<i data-lucide="send"></i> ${contactData.acf.submit_btn_text}`;
        }

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

  // Carregar textos do footer
  async loadFooterContent() {
    try {
      if (this.siteSettings) {
        // Atualizar copyright
        const copyright = document.querySelector('.copyright-text');
        if (copyright && this.siteSettings.acf?.copyright_text) {
          const year = new Date().getFullYear();
          copyright.innerHTML = this.siteSettings.acf.copyright_text.replace('{year}', year);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo do footer:', error);
    }
  }

  // Carregar textos da navegação
  async loadNavigationContent() {
    try {
      if (this.siteSettings) {
        // Atualizar links da navegação
        const navLinks = {
          'nav-sobre': 'nav_sobre_text',
          'nav-procedimentos': 'nav_procedimentos_text',
          'nav-estatisticas': 'nav_estatisticas_text',
          'nav-contato': 'nav_contato_text',
          'nav-consulta': 'nav_consulta_text'
        };

        Object.entries(navLinks).forEach(([className, acfField]) => {
          const element = document.querySelector(`.${className}`);
          if (element && this.siteSettings.acf?.[acfField]) {
            element.textContent = this.siteSettings.acf[acfField];
          }
        });
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo da navegação:', error);
    }
  }

  // Carregar todo o conteúdo
  async loadAllContent() {
    this.toggleLoading(true);
    
    try {
      await Promise.all([
        this.loadSiteSettings(),
        this.loadHomeContent(),
        this.loadDoctorInfo(),
        this.loadProcedures(),
        this.loadTestimonials(),
        this.loadStatistics(),
        this.loadContactInfo(),
        this.loadFooterContent(),
        this.loadNavigationContent()
      ]);
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error);
    } finally {
      this.toggleLoading(false);
    }
  }
}

export const contentLoader = new ContentLoader();