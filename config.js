// Configuração da API WordPress
export const WORDPRESS_CONFIG = {
  // URL base da sua instalação WordPress (ALTERE ESTE URL)
  baseUrl: 'https://seu-site-wordpress.com',
  
  // Endpoints da API REST
  endpoints: {
    posts: '/wp-json/wp/v2/posts',
    pages: '/wp-json/wp/v2/pages',
    media: '/wp-json/wp/v2/media',
    categories: '/wp-json/wp/v2/categories',
    tags: '/wp-json/wp/v2/tags',
    users: '/wp-json/wp/v2/users',
    // Campos personalizados (ACF)
    acf: '/wp-json/acf/v3'
  },
  
  // IDs das páginas/posts específicos (configure no WordPress)
  pageIds: {
    home: 1,        // ID da página inicial
    about: 2,       // ID da página "Sobre"
    procedures: 3,  // ID da página "Procedimentos"
    contact: 4,     // ID da página "Contato"
    testimonials: 5, // ID da página "Depoimentos"
    settings: 6     // ID da página "Configurações Gerais"
  },
  
  // Configurações de cache
  cache: {
    enabled: true,
    duration: 300000 // 5 minutos em millisegundos
  }
};