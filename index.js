// Função genérica para obter ou criar containers
function getOrCreateContainer(containerId, style) {
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      Object.assign(container.style, style);
      document.body.appendChild(container);
    }
    return container;
  }
  
  // Função para criar ícones de alertas
  function createAlertIcon(type) {
    const icon = document.createElement('div');
    icon.className = 'icon';
    const iconClass = {
      success: 'fa-check',
      info: 'fa-info-circle',
      warning: 'fa-exclamation-triangle',
      danger: 'fa-times-circle',
    }[type];
    icon.innerHTML = `<i class="fas ${iconClass}" style="font-size: 24px;"></i>`;
    return icon;
  }
  
  // Função para criar conteúdo do alerta
  function createAlertContent(title, message) {
    const content = document.createElement('div');
    content.innerHTML = `<div class="title">${title}</div><div class="message">${message}</div>`;
    return content;
  }
  
  // Função para criar a barra de progresso
  function createProgressBar(duration) {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.animationDuration = `${duration}ms`;
    return progressBar;
  }
  
  // Função para criar o botão de fechamento
  function createCloseButton(alertBox, timeoutId) {
    const closeButton = document.createElement('div');
    closeButton.className = 'close';
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.addEventListener('click', () => {
      clearTimeout(timeoutId);
      removeElementWithAnimation(alertBox);
    });
    return closeButton;
  }
  
  // Função genérica para remover elementos com animação
  function removeElementWithAnimation(element) {
    element.style.transition = 'transform 0.3s ease-in, opacity 0.3s ease-in';
    element.style.opacity = '0';
    element.style.transform = 'translateY(-100%)'; 
    setTimeout(() => element.remove(), 300);
  }
  
  // Objeto FlickerAlerts para exibir os alertas
  const FlickerAlerts = {
    showAlert: function ({ type, title, message, duration = 3000, position = 'top-right' }) {
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const container = getOrCreateContainer('alerts-container', {
          position: 'fixed',
          pointerEvents: 'none',
          top: position.includes('top') ? '0' : 'auto',
          bottom: position.includes('bottom') ? '0' : 'auto',
          left: position.includes('left') ? '0' : 'auto',
          right: position.includes('right') ? '0' : 'auto',
          transform: position.includes('center') ? 'translateX(-50%)' : 'none',
          zIndex: 9999,
          flexDirection: ['top-right', 'top-left', 'bottom-right', 'bottom-left'].includes(position) ? 'column' : 'column-reverse',
        });
  
        const alertBox = document.createElement('div');
        alertBox.className = `notification ${type}`;
        alertBox.style.opacity = '0';
        alertBox.style.transform = 'translateY(-100%)';
  
        // Ícone
        alertBox.appendChild(createAlertIcon(type));
  
        // Divider (linha de separação)
        const divider = document.createElement('div');
        divider.className = 'divider';
        alertBox.appendChild(divider);
  
        // Conteúdo
        alertBox.appendChild(createAlertContent(title, message));
  
        // Barra de progresso
        alertBox.appendChild(createProgressBar(duration));
  
        // Botão de fechamento
        alertBox.appendChild(createCloseButton(alertBox));
  
        container.prepend(alertBox);
  
        setTimeout(() => {
          alertBox.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
          alertBox.style.opacity = '1';
          alertBox.style.transform = 'translateY(0)';
        }, 0);
  
        const timeoutId = setTimeout(() => removeElementWithAnimation(alertBox), duration);
      }
    },
  };
  
  // Botões de teste
  if (typeof document !== 'undefined') {
    document.getElementById('success-btn')?.addEventListener('click', () => {
      FlickerAlerts.showAlert({
        type: 'success',
        title: 'Sucesso!',
        message: 'Essa mensagem é personalizável.',
      });
    });
  
    document.getElementById('info-btn')?.addEventListener('click', () => {
      FlickerAlerts.showAlert({
        type: 'info',
        title: 'Informação!',
        message: 'Essa mensagem é personalizável.',
      });
    });
  
    document.getElementById('warning-btn')?.addEventListener('click', () => {
      FlickerAlerts.showAlert({
        type: 'warning',
        title: 'Alerta!',
        message: 'Essa mensagem é personalizável.',
      });
    });
  
    document.getElementById('error-btn')?.addEventListener('click', () => {
      FlickerAlerts.showAlert({
        type: 'danger',
        title: 'Erro!',
        message: 'Essa mensagem é personalizável.',
      });
    });
  }
  
  // Exportação
  
  
  const FlickerModals = {
    showModal: function ({ type, title, message, onConfirm, onCancel, timer = 5000 }) {
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const container = getOrCreateContainer('modals-container', {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        });
  
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        modalContainer.style.opacity = '0';
        modalContainer.style.transform = 'scale(0.9)';
        modalContainer.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
  
        const modalDialog = document.createElement('div');
        modalDialog.className = 'modal-dialog';
        modalDialog.setAttribute('role', 'document');
  
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
  
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'close';
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.innerHTML = `<div><i class="fas fa-times"></i></div>`;
        closeButton.addEventListener('click', () => {
          removeElementWithAnimation(modalContainer);
          if (onCancel) onCancel();
        });
        modalHeader.appendChild(closeButton);
  
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        const icon = document.createElement('div');
        icon.className = type === 'delete' ? 'icon-delete' : 'icon-check';
        icon.innerHTML = `<i class="fas ${type === 'delete' ? 'fa-trash-alt' : 'fa-exclamation-triangle'}"></i>`;
        modalBody.appendChild(icon);
  
        const divider = document.createElement('div');
        divider.className = 'divider';
        modalBody.appendChild(divider);
  
        const bodyContent = document.createElement('div');
        bodyContent.innerHTML = `
          <h5 class="modal-title-${type}">${title}</h5>
          <p>${message}</p>
        `;
        modalBody.appendChild(bodyContent);
  
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
  
        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.className = 'btn btn-cancel';
        cancelButton.innerText = 'Não, cancelar';
        cancelButton.addEventListener('click', () => {
          removeElementWithAnimation(modalContainer);
          if (onCancel) onCancel();
        });
        modalFooter.appendChild(cancelButton);
  
        const confirmButton = document.createElement('button');
        confirmButton.type = 'button';
        confirmButton.className = type === 'delete' ? 'btn btn-confirm-delete' : 'btn btn-confirm-warning';
        confirmButton.innerText = type === 'delete' ? 'Sim, deletar' : 'Sim, confirmar';
        confirmButton.addEventListener('click', () => {
          removeElementWithAnimation(modalContainer);
          if (onConfirm) onConfirm();
        });
        modalFooter.appendChild(confirmButton);
  
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modalDialog.appendChild(modalContent);
        modalContainer.appendChild(modalDialog);
        container.appendChild(modalContainer);
  
        setTimeout(() => {
          modalContainer.style.opacity = '1';
          modalContainer.style.transform = 'scale(1)';
        }, 0);
  
        const timeoutId = setTimeout(() => removeElementWithAnimation(modalContainer), timer);
      }
    },
  };
  // Botões de teste - Eles podem ser removidos se não forem necessários
  if (typeof document !== 'undefined') {
    document.getElementById('modal-warning-btn')?.addEventListener('click', () => {
      FlickerModals.showModal({
        type: 'warning',
        title: 'Tem certeza que deseja aceitar?',
        message: 'Você tem certeza que deseja aceitar isso?',
        onConfirm: () => {
          console.log('Confirmado!');
          // Exibir alerta de sucesso após a confirmação
          FlickerAlerts.showAlert({
            type: 'success',
            title: 'Sucesso!',
            message: 'Ação realizada com sucesso!',
            duration: 3000 // duração do alerta
          });
        },
        onCancel: () => { 
          console.log('Cancelado!'); 
        }
      });
    });
  
    document.getElementById('modal-delete-btn')?.addEventListener('click', () => {
      FlickerModals.showModal({
        type: 'delete',
        title: 'Tem certeza que deseja deletar?',
        message: 'Você tem certeza que deseja deletar isso?',
        onConfirm: () => {
          console.log('Deletado com sucesso!');
          // Exibir alerta de sucesso após a confirmação
          FlickerAlerts.showAlert({
            type: 'success',
            title: 'Sucesso!',
            message: 'Item deletado com sucesso!',
            duration: 3000 // duração do alerta
          });
        },
        onCancel: () => { 
          console.log('Cancelado!'); 
        }
      });
    });
  }
  
  export { FlickerAlerts, FlickerModals };