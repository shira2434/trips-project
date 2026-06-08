import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // השירות זמין לכל האפליקציה כ-Singleton
})
export class NotificationService {

  // פונקציה להצגת הודעה קופצת (Toast) שנסגרת לבד
  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    // יצירת אלמנט DIV חדש ישירות בזיכרון של הדפדפן
    const notification = document.createElement('div');
    // הוספת קלאסים לעיצוב לפי סוג ההודעה (למשל: notification-success)
    notification.className = `notification notification-${type}`;
    notification.textContent = message; // הכנסת הטקסט להודעה
    
    // הזרקת האלמנט לתוך ה-Body של דף ה-HTML כדי שיופיע על המסך
    document.body.appendChild(notification);
    
    // שימוש ב-setTimeout קצר כדי לאפשר לדפדפן לרנדר את האלמנט לפני הוספת האנימציה (show)
    setTimeout(() => notification.classList.add('show'), 10);
    
    // סגירה אוטומטית של ההודעה אחרי 3 שניות (3000 מילישניות)
    setTimeout(() => {
      notification.classList.remove('show'); // הסרת אנימציה
      // המתנה של עוד 300 מילישניות לסיום אנימציית היציאה לפני מחיקת האלמנט לגמרי
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // פונקציה ליצירת חלון אישור (Modal) שמחזירה "הבטחה" (Promise)
  confirm(message: string): Promise<boolean> {
    // אנחנו יוצרים ומחזירים Promise חדש. 
    // ה-resolve הוא ה"כפתור" שמסיים את ההבטחה ומחזיר את התשובה (true/false)
    return new Promise((resolve) => {
      // יצירת הרקע הכהה (Overlay) שחוסם את שאר האתר
      const overlay = document.createElement('div');
      overlay.className = 'confirm-overlay';
      
      // יצירת חלונית הדיאלוג עצמה
      const dialog = document.createElement('div');
      dialog.className = 'confirm-dialog';
      
      const messageEl = document.createElement('p');
      messageEl.textContent = message;
      
      const buttonsDiv = document.createElement('div');
      buttonsDiv.className = 'confirm-buttons';
      
      // יצירת כפתור אישור
      const confirmBtn = document.createElement('button');
      confirmBtn.textContent = 'אישור';
      confirmBtn.className = 'btn-confirm';
      confirmBtn.onclick = () => {
        overlay.remove(); // הסרת החלון מהמסך
        resolve(true);    // "קיום ההבטחה" עם הערך אמת
      };
      
      // יצירת כפתור ביטול
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'ביטול';
      cancelBtn.className = 'btn-cancel';
      cancelBtn.onclick = () => {
        overlay.remove(); // הסרת החלון מהמסך
        resolve(false);   // "קיום ההבטחה" עם הערך שקר
      };
      
      // חיבור כל האלמנטים אחד לשני (יצירת היררכיה)
      buttonsDiv.appendChild(confirmBtn);
      buttonsDiv.appendChild(cancelBtn);
      dialog.appendChild(messageEl);
      dialog.appendChild(buttonsDiv);
      overlay.appendChild(dialog);
      document.body.appendChild(overlay); // הצגת הכל על המסך
      
      setTimeout(() => overlay.classList.add('show'), 10);
    });
  }
}