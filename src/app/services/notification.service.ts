import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'confirm-overlay';
      
      const dialog = document.createElement('div');
      dialog.className = 'confirm-dialog';
      
      const messageEl = document.createElement('p');
      messageEl.textContent = message;
      
      const buttonsDiv = document.createElement('div');
      buttonsDiv.className = 'confirm-buttons';
      
      const confirmBtn = document.createElement('button');
      confirmBtn.textContent = 'אישור';
      confirmBtn.className = 'btn-confirm';
      confirmBtn.onclick = () => {
        overlay.remove();
        resolve(true);
      };
      
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'ביטול';
      cancelBtn.className = 'btn-cancel';
      cancelBtn.onclick = () => {
        overlay.remove();
        resolve(false);
      };
      
      buttonsDiv.appendChild(confirmBtn);
      buttonsDiv.appendChild(cancelBtn);
      dialog.appendChild(messageEl);
      dialog.appendChild(buttonsDiv);
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
      
      setTimeout(() => overlay.classList.add('show'), 10);
    });
  }
}
