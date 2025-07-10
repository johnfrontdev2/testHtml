import { wpAPI } from './api.js';
import { contentLoader } from './content-loader.js';

class FormHandler {
  constructor() {
    this.initializeForm();
  }

  initializeForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', this.handleSubmit.bind(this));
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Usar mensagem dinâmica de "enviando"
    const sendingMessage = contentLoader.formMessages?.sending || 'Enviando...';
    // Mostrar loading no botão
    submitButton.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> ${sendingMessage}`;
    submitButton.disabled = true;
    
    try {
      // Preparar dados para Contact Form 7
      const data = {
        'your-name': formData.get('name'),
        'your-email': formData.get('email'),
        'your-message': formData.get('message')
      };
      
      const response = await wpAPI.submitContactForm(data);
      
      if (response.status === 'mail_sent') {
        const successMessage = contentLoader.formMessages?.success || 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
        this.showMessage(successMessage, 'success');
        form.reset();
      } else {
        const errorMessage = contentLoader.formMessages?.error || 'Erro ao enviar mensagem. Tente novamente.';
        this.showMessage(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      const errorMessage = contentLoader.formMessages?.error || 'Erro ao enviar mensagem. Tente novamente.';
      this.showMessage(errorMessage, 'error');
    } finally {
      // Restaurar botão
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      lucide.createIcons(); // Recriar ícones
    }
  }

  showMessage(message, type) {
    // Remover mensagem anterior se existir
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Criar nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message p-4 rounded-md mb-4 ${
      type === 'success' 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`;
    messageDiv.textContent = message;
    
    // Inserir mensagem antes do formulário
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageDiv, form);
    
    // Remover mensagem após 5 segundos
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }
}

export const formHandler = new FormHandler();