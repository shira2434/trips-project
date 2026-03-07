// ממשק המגדיר את מבנה ההזמנה לטיול
export interface Booking {
  id?: string;      // מזהה ייחודי של ההזמנה (אופציונלי)
  userId: string;   // מזהה המשתמש שביצע את ההזמנה
  tripId: string;   // מזהה הטיול שהוזמן
  people: number;   // מספר המשתתפים בהזמנה
}
