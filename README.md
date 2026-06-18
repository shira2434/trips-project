# 🌍 אפליקציית ניהול טיולים – Angular תשפ"ו

אפליקציית Angular לניהול וצפייה בטיולים, כולל הרשמה לטיולים, ניהול הזמנות ויכולות אדמין.

---

## 🚀 הרצת הפרויקט

### דרישות מקדימות
- Node.js מותקן
- npm מותקן

### התקנת תלויות
```bash
npm install
```

### הרצת הבקאנד (JSON Server)
```bash
npm run server
```
השרת יעלה על: `http://localhost:3000`

### הרצת האפליקציה
```bash
npm start
```
האפליקציה תעלה על: `http://localhost:4200`

> ניתן גם להריץ את `start.bat` שמפעיל את שני השרתים יחד.

---

## 📁 מבנה הפרויקט

```
src/app/
├── components/
│   ├── login/          – דף התחברות
│   ├── register/       – דף הרשמה
│   ├── nav-bar/        – תפריט ניווט עליון (Layout לעמוד Home)
│   ├── welcome/        – דף ברוכים הבאים
│   ├── trips-all/      – רשימת כל הטיולים
│   ├── trip-detail/    – פרטי טיול + הרשמה / ביטול
│   ├── trip-edit/      – עריכת טיול (אדמין בלבד)
│   └── my-trips/       – הטיולים שלי
├── guards/
│   └── auth.guard.ts   – הגנה על נתיבים (Guard)
├── models/
│   ├── user.model.ts   – ממשק User
│   ├── trip.model.ts   – ממשק Trip
│   └── booking.model.ts – ממשק Booking
├── services/
│   ├── auth.service.ts      – ניהול התחברות והרשמה
│   ├── trips.service.ts     – CRUD טיולים
│   ├── bookings.service.ts  – ניהול הזמנות
│   └── notification.service.ts – הודעות ואישורים
└── app.routes.ts       – הגדרת נתיבי הניווט
```

---

## 🗺️ נתיבי ניווט

| נתיב | קומפוננטה | תיאור |
|------|-----------|-------|
| `/` | redirect | מפנה אוטומטית ל-`/login` |
| `/login` | LoginComponent | דף התחברות |
| `/register` | RegisterComponent | דף הרשמה |
| `/home` | NavBarComponent | עמוד הבית (Layout) |
| `/home/trips-all` | TripsAllComponent | כל הטיולים |
| `/home/my-trips` | MyTripsComponent | הטיולים שלי |
| `/home/trip/:id` | TripDetailComponent | פרטי טיול |
| `/home/trip-edit/:id` | TripEditComponent | עריכת טיול |

---

## 🧩 רכיבים ופונקציונליות

### LoginComponent
- טופס עם שדות `username` ו-`password`
- אימות מול השרת לפי שם וסיסמה
- הצגת שגיאה במקרה של פרטים שגויים
- ניווט לעמוד Home בהצלחה

### RegisterComponent
- טופס עם `username`, `password`, `verify-password`
- בדיקת חוזרת על סיסמה
- בדיקה שהשם לא קיים כבר בשרת
- ניווט ל-Home בהרשמה מוצלחת

### NavBarComponent (Home Layout)
- כותרת עם שם המשתמש המחובר
- כפתורי ניווט: All Trips | My Trips | Logout
- `<router-outlet>` לתצוגת תוכן משתנה

### TripsAllComponent
- הצגת כל הטיולים (שם, יעד, תמונה)
- לחיצה על טיול → מעבר לדף פרטים
- **אדמין בלבד:** הוספת טיול חדש (טופס)
- **אדמין בלבד:** עריכה ומחיקה של טיולים ללא נרשמים
- מחיקה כוללת הודעת אישור

### TripDetailComponent
- הצגת כל פרטי הטיול: שם, יעד, תאריך, מחיר, תיאור, תמונה
- הצגת סך הנרשמים לטיול
- **הרשמה:** שדה מספר אנשים + כפתור "הרשם"
- אם המשתמש כבר רשום – כפתור "בטל הרשמה" במקום
- ביטול הרשמה עם הודעת אישור + חזרה ל-My Trips

### MyTripsComponent
- הצגת הטיולים שהמשתמש נרשם אליהם
- לחיצה על טיול → דף פרטים עם אפשרות ביטול

### TripEditComponent
- טופס עדכון לכל שדות הטיול
- שמירה מעדכנת את השרת וחוזרת לרשימה

---

## 🔧 שירותים

### AuthService
- `login(name, password)` – התחברות מול השרת
- `register(name, password)` – הרשמת משתמש חדש
- `logout()` – התנתקות
- `getCurrentUser()` – קבלת המשתמש הנוכחי
- `checkUserExists(name)` – בדיקת כפילות שם
- שמירת המשתמש ב-`localStorage` לשמירת מצב

### TripsService
- `getTrips()` – שליפת כל הטיולים
- `getTrip(id)` – טיול בודד
- `addTrip(trip)` – הוספת טיול
- `updateTrip(id, trip)` – עדכון טיול
- `deleteTrip(id)` – מחיקת טיול

### BookingsService
- `getBookings()` – כל ההזמנות
- `getUserBookings(userId)` – הזמנות לפי משתמש
- `addBooking(booking)` – הוספת הזמנה עם ID רנדומלי
- `deleteBooking(id)` – מחיקת הזמנה
- `getBookingByUserAndTrip(userId, tripId)` – בדיקת הזמנה ספציפית

### NotificationService
- `show(message, type)` – הצגת הודעה (שגיאה / הצלחה)
- `confirm(message)` – חלון אישור אסינכרוני, מחזיר `Promise<boolean>`

---

## 🗄️ מבנה הדאטה (db.json)

### User
```json
{
  "id": "1",
  "name": "Bob Smith",
  "password": "bobpass",
  "isAdmin": true
}
```

### Trip
```json
{
  "id": "1",
  "name": "Paris City Tour",
  "destination": "Paris, France",
  "startDate": "2026-03-15",
  "endDate": "2026-03-20",
  "price": 1500,
  "description": "...",
  "image": "https://..."
}
```

### Booking
```json
{
  "id": "f838",
  "userId": "1",
  "tripId": "3",
  "people": 2
}
```

---

## 👤 משתמשים לבדיקה

| שם | סיסמה | אדמין |
|----|--------|-------|
| Alice Johnson | alice123 | ❌ |
| Bob Smith | bobpass | ✅ |
| Clara Brown | clara321 | ❌ |

---

## 🔌 API Endpoints (JSON Server)

| Method | Endpoint | תיאור |
|--------|----------|-------|
| GET | `/trips` | כל הטיולים |
| GET | `/trips/:id` | טיול בודד |
| POST | `/trips` | הוספת טיול |
| PUT | `/trips/:id` | עדכון טיול |
| DELETE | `/trips/:id` | מחיקת טיול |
| GET | `/bookings` | כל ההזמנות |
| POST | `/bookings` | הזמנה חדשה |
| DELETE | `/bookings/:id` | ביטול הזמנה |
| GET | `/users` | כל המשתמשים |
| GET | `/users/:id` | משתמש בודד |
| POST | `/users` | הוספת משתמש |

---

## 🛠️ טכנולוגיות

| טכנולוגיה | גרסה |
|-----------|------|
| Angular | 21.x |
| TypeScript | 5.9.x |
| JSON Server | 1.0.0-beta |
| RxJS | 7.8.x |

---

## 👩‍💻 פותח על ידי

פרויקט לקורס Angular – תשפ"ו
