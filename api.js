import { WORDPRESS_CONFIG } from './config.js';

class WordPressAPI {
  constructor() {
    this.cache = new Map();
    this.baseUrl = WORDPRESS_CONFIG.baseUrl;
  }

  // Método genérico para fazer requisições
  async fetchData(endpoint, params = {}) {
    const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
    
    // Verificar cache
    if (WORDPRESS_CONFIG.cache.enabled && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < WORDPRESS_CONFIG.cache.duration) {
        return cached.data;
      }
    }

    try {
      const url = new URL(this.baseUrl + endpoint);
      Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
      });

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Salvar no cache
      if (WORDPRESS_CONFIG.cache.enabled) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      return null;
    }
  }

  // Buscar página por ID
  async getPage(id) {
    return await this.fetchData(`${WORDPRESS_CONFIG.endpoints.pages}/${id}`);
  }

  // Buscar post por ID
  async getPost(id) {
    return await this.fetchData(`${WORDPRESS_CONFIG.endpoints.posts}/${id}`);
  }

  // Buscar posts por categoria
  async getPostsByCategory(categoryId, limit = 10) {
    return await this.fetchData(WORDPRESS_CONFIG.endpoints.posts, {
      categories: categoryId,
      per_page: limit,
      _embed: true
    });
  }

  // Buscar depoimentos (posts de uma categoria específica)
  async getTestimonials(limit = 3) {
    // Assumindo que você criará uma categoria "depoimentos" no WordPress
    return await this.fetchData(WORDPRESS_CONFIG.endpoints.posts, {
      categories: 'depoimentos', // ou ID da categoria
      per_page: limit,
      _embed: true
    });
  }

  // Buscar procedimentos (posts de uma categoria específica)
  async getProcedures(limit = 6) {
    return await this.fetchData(WORDPRESS_CONFIG.endpoints.posts, {
      categories: 'procedimentos', // ou ID da categoria
      per_page: limit,
      _embed: true
    });
  }

  // Buscar dados do médico (campos personalizados)
  async getDoctorInfo() {
    const page = await this.getPage(WORDPRESS_CONFIG.pageIds.about);
    return page;
  }

  // Buscar estatísticas (campos personalizados)
  async getStatistics() {
    // Você pode criar uma página específica para estatísticas
    // ou usar campos personalizados na página principal
    return await this.fetchData('/wp-json/wp/v2/pages', {
      slug: 'estatisticas',
      _fields: 'acf'
    });
  }

  // Enviar formulário de contato
  async submitContactForm(formData) {
    try {
      const response = await fetch(`${this.baseUrl}/wp-json/contact-form-7/v1/contact-forms/1/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData)
      });

      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      return { status: 'error', message: 'Erro ao enviar mensagem' };
    }
  }
}

export const wpAPI = new WordPressAPI();