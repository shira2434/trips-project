// ממשק המגדיר את מבנה הטיול במערכת
export interface Trip {
  id?: string;          // מזהה ייחודי של הטיול (אופציונלי)
  name: string;         // שם הטיול
  destination: string;  // יעד הטיול
  startDate: string;    // תאריך התחלה
  endDate: string;      // תאריך סיום
  price: number;        // מחיר הטיול
  description: string;  // תיאור הטיול
  image: string;        // קישור לתמונת הטיול
}
