// ממשק המגדיר את מבנה המשתמש במערכת
export interface User {
  id?: string;          // מזהה ייחודי של המשתמש (אופציונלי)
  name: string;         // שם המשתמש
  email?: string;       // כתובת אימייל (אופציונלי)
  password: string;     // סיסמת המשתמש
  isAdmin: boolean;     // האם המשתמש הוא מנהל מערכת
}
