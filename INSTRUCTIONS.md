# הוראות הרצה

## התקנת json-server

```bash
npm install -g json-server
```

## הרצת השרת (בטרמינל נפרד)

```bash
json-server --watch db.json --port 3000
```

## הרצת האפליקציה

```bash
ng serve
```

## פתיחת הדפדפן

```
http://localhost:4200
```

## משתמשים לדוגמה

### אדמין:
- שם משתמש: admin
- סיסמה: admin123

### משתמש רגיל:
- שם משתמש: user1
- סיסמה: user123

## מבנה הפרויקט

```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   ├── register/
│   │   ├── home/
│   │   ├── trips-all/
│   │   ├── trip-detail/
│   │   └── my-trips/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── trips.service.ts
│   │   └── bookings.service.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── trip.model.ts
│   │   └── booking.model.ts
│   └── guards/
│       └── auth.guard.ts
└── db.json
```

## תכונות

1. **התחברות והרשמה** - עם ולידציה
2. **ניהול טיולים** - צפיה, הוספה, עריכה ומחיקה (אדמין בלבד)
3. **הרשמה לטיולים** - עם בדיקת רישום קיים
4. **הטיולים שלי** - רשימת הטיולים שהמשתמש רשום אליהם
5. **ביטול הרשמה** - מדף פרטי הטיול
