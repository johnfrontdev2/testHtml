# Integração com WordPress REST API

Este projeto foi configurado para funcionar dinamicamente com WordPress REST API. Siga os passos abaixo para configurar completamente.

## 📋 Pré-requisitos

1. **WordPress instalado e funcionando**
2. **Plugins necessários:**
   - Advanced Custom Fields (ACF) - OBRIGATÓRIO
   - Contact Form 7 - Para formulário de contato
   - WP REST API - (já incluído no WordPress 4.7+)

## 🔧 Configuração no WordPress

### 1. Configurar URL da API
Edite o arquivo `config.js` e altere a URL base:
```javascript
baseUrl: 'https://seu-dominio-wordpress.com'
```

### 2. Criar Páginas no WordPress
Crie as seguintes páginas no WordPress Admin:
- **Página Inicial** (Home)
- **Sobre** (About)
- **Procedimentos** (Procedures)
- **Contato** (Contact)
- **Estatísticas** (Statistics)
- **Configurações Gerais** (Settings)

Anote os IDs dessas páginas e atualize em `config.js`:
```javascript
pageIds: {
  home: 1,        // ID da página inicial
  about: 2,       // ID da página "Sobre"
  procedures: 3,  // ID da página "Procedimentos"
  contact: 4,     // ID da página "Contato"
  testimonials: 5, // ID da página "Depoimentos"
  settings: 6     // ID da página "Configurações Gerais"
}
```

### 3. Criar Categorias
Crie as seguintes categorias no WordPress:
- **procedimentos** - Para posts de procedimentos médicos
- **depoimentos** - Para posts de depoimentos de pacientes

### 4. Configurar Campos Personalizados (ACF)

#### Para a Página de Configurações Gerais (Settings):
- `site_title` (Texto) - Título do site (ex: "Dr. João da Silva")
- `site_subtitle` (Texto) - Subtítulo do site (ex: "Cirurgião Geral em Brasília")
- `copyright_text` (Texto) - Texto do copyright (use {year} para ano atual)
- `nav_sobre_text` (Texto) - Texto do link "Sobre"
- `nav_procedimentos_text` (Texto) - Texto do link "Procedimentos"
- `nav_estatisticas_text` (Texto) - Texto do link "Resultados"
- `nav_contato_text` (Texto) - Texto do link "Contato"
- `nav_consulta_text` (Texto) - Texto do botão "Consulta"

#### Para a Página Inicial (Home):
- `hero_title` (Texto) - Título principal
- `hero_subtitle` (Textarea) - Subtítulo
- `hero_image` (Imagem) - Imagem do hero
- `hero_image_alt` (Texto) - Texto alternativo da imagem
- `btn_consulta_text` (Texto) - Texto do botão "Agendar Consulta"
- `btn_curriculum_text` (Texto) - Texto do botão "Ver Curriculum"

#### Para a Página Sobre (About):
- `about_title` (Texto) - Título da seção "Sobre"
- `doctor_name` (Texto) - Nome do médico
- `doctor_photo` (Imagem) - Foto do médico
- `doctor_photo_alt` (Texto) - Texto alternativo da foto
- `benefit_1` (Texto) - Primeiro benefício
- `benefit_2` (Texto) - Segundo benefício
- `benefit_3` (Texto) - Terceiro benefício
- Conteúdo principal vai no editor padrão do WordPress

#### Para a Página de Procedimentos:
- `procedures_title` (Texto) - Título da seção "Procedimentos"

#### Para Posts de Procedimentos:
- `icon` (Texto) - Nome do ícone Lucide (ex: "scalpel", "heart-pulse")
- Título: usar o título padrão do post
- Descrição: usar o conteúdo ou excerpt do post

#### Para a Página de Depoimentos:
- `testimonials_title` (Texto) - Título da seção "Depoimentos"

#### Para Posts de Depoimentos:
- `author_name` (Texto) - Nome do autor do depoimento
- `author_photo` (Imagem) - Foto do autor
- Conteúdo: usar o conteúdo padrão do post

#### Para a Página de Estatísticas:
- `stats_title` (Texto) - Título da seção "Estatísticas"
- `stats_description` (Textarea) - Descrição da seção
- `satisfaction_rate` (Número) - Taxa de satisfação (ex: 98)
- `satisfaction_label` (Texto) - Label da satisfação (ex: "Satisfação")
- `total_procedures` (Texto) - Total de procedimentos (ex: "10k")
- `procedures_label` (Texto) - Label dos procedimentos (ex: "Procedimentos")
- `chart_data` (Grupo de campos):
  - `labels` (Texto) - Labels do gráfico separados por vírgula
  - `data` (Texto) - Dados do gráfico separados por vírgula

#### Para a Página de Contato:
- `contact_title` (Texto) - Título do formulário
- `name_label` (Texto) - Label do campo nome
- `email_label` (Texto) - Label do campo email
- `message_label` (Texto) - Label do campo mensagem
- `name_placeholder` (Texto) - Placeholder do campo nome
- `email_placeholder` (Texto) - Placeholder do campo email
- `message_placeholder` (Texto) - Placeholder do campo mensagem
- `submit_btn_text` (Texto) - Texto do botão de envio
- `address` (Texto) - Endereço
- `phone` (Texto) - Telefone
- `email` (Email) - Email de contato

### 5. Configurar Contact Form 7
1. Instale o plugin Contact Form 7
2. Crie um formulário com os campos:
   - `your-name` (Nome)
   - `your-email` (Email)
   - `your-message` (Mensagem)
3. Anote o ID do formulário e atualize no código se necessário

### 6. Configurar Permissões da API
Adicione ao `functions.php` do seu tema:

```php
// Habilitar CORS para API REST
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
});

// Expor campos ACF na API REST
add_filter('rest_prepare_post', function($response, $post, $request) {
    $response->data['acf'] = get_fields($post->ID);
    return $response;
}, 10, 3);

add_filter('rest_prepare_page', function($response, $post, $request) {
    $response->data['acf'] = get_fields($post->ID);
    return $response;
}, 10, 3);
```

## 🚀 Deploy e Hospedagem

### Passos para hospedar o site:

1. **Fazer upload dos arquivos**
   - Faça upload de todos os arquivos para seu servidor web
   - Certifique-se de que o WordPress está acessível

2. **Configurar domínio**
   - Aponte seu domínio para o servidor
   - Configure SSL (HTTPS recomendado)

3. **Testar a integração**
   - Acesse seu site
   - Verifique se o conteúdo está carregando do WordPress
   - Teste o formulário de contato

4. **Configurações de cache (opcional)**
   - O sistema já possui cache interno de 5 minutos
   - Para sites com muito tráfego, considere usar um CDN

### Estrutura de URLs da API:
- Posts: `https://seu-site.com/wp-json/wp/v2/posts`
- Páginas: `https://seu-site.com/wp-json/wp/v2/pages`
- Categorias: `https://seu-site.com/wp-json/wp/v2/categories`

## 🔍 Troubleshooting

### Problemas comuns:

1. **Conteúdo não carrega:**
   - Verifique se a URL no `config.js` está correta
   - Confirme se o WordPress está acessível
   - Verifique o console do navegador para erros

2. **Campos personalizados não aparecem:**
   - Confirme se o ACF está instalado e ativo
   - Verifique se os campos estão configurados corretamente
   - Confirme se o código no `functions.php` foi adicionado

3. **Formulário não envia:**
   - Verifique se o Contact Form 7 está instalado
   - Confirme o ID do formulário
   - Teste o formulário diretamente no WordPress

4. **Erro de CORS:**
   - Adicione o código de CORS no `functions.php`
   - Verifique as configurações do servidor

## 📱 Funcionalidades Implementadas

- ✅ **100% dos textos dinâmicos** - Tudo editável via ACF
- ✅ Carregamento dinâmico de conteúdo
- ✅ Cache automático (5 minutos)
- ✅ Formulário de contato integrado
- ✅ Responsive design
- ✅ Loading states
- ✅ Tratamento de erros
- ✅ Animações suaves
- ✅ SEO-friendly

## 🔄 Atualizações de Conteúdo

Após configurar tudo, você poderá:
- **Editar TODOS os textos** do site via WordPress Admin
- Editar conteúdo diretamente no WordPress Admin
- Adicionar novos procedimentos como posts
- Gerenciar depoimentos
- Atualizar informações de contato
- Modificar estatísticas e gráficos
- Alterar textos da navegação e footer
- Personalizar labels e placeholders do formulário

O site será atualizado automaticamente conforme você edita o conteúdo no WordPress!