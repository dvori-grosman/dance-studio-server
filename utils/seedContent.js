const Lesson = require('../models/Lesson');
const Product = require('../models/Product');
const Performance = require('../models/Performance');

async function seedIfEmpty(Model, items) {
  const count = await Model.countDocuments();
  if (count === 0) await Model.insertMany(items);
}

async function seedContent() {
  await seedIfEmpty(Lesson, [
    { title: 'בלט קלאסי', subtitle: 'עשירה, רכה, חכמה, אומנותית ואצילית', description: 'שפת התנועה של הבלט הקלאסי בנויה על דיוק, יציבה, קווים נקיים ותחושת ריחוף.', features: ['תרגילי בר', 'תרגילי אמצע ופינה', 'וריאציות', 'פוינט למתקדמות'], duration: '60 דקות', ages: 'יסודי, תיכון, נשים', levels: ['מתחילות', 'ממשיכות', 'מתקדמות'], imageUrl: '/02.png', sortOrder: 1 },
    { title: 'מחול מודרני', subtitle: 'תנועה, הבעה, יצירתיות וזרימה', description: 'מחול מודרני נותן מקום לגוף לזוז, ליצור ולהביע בתוך שיעור זורם ודינמי.', features: ['טכניקה', 'עבודת רצפה', 'קומבינציות', 'אימפרוביזציה'], duration: '60 דקות', ages: 'יסודי, תיכון, נשים', levels: ['מתחילות', 'ממשיכות', 'מתקדמות'], imageUrl: '/01.png', sortOrder: 2 },
    { title: 'מחול לגיל הרך', subtitle: 'התחלה רכה לעולם התנועה', description: 'שעה של תנועה, משחק ודמיון עם צעדי בסיס, פוזיציות וקואורדינציה.', features: ['מוטוריקה', 'קואורדינציה', 'חיזוק', 'ביטוי וביטחון'], duration: '45 דקות', ages: '3–6 שנים', levels: ['גיל הרך'], imageUrl: '/04.png', sortOrder: 3 },
    { title: 'אקרודאנס', subtitle: 'מחול ואקרובטיקה בתנועה אחת', description: 'שילוב בין טכניקות מחול לבין אלמנטים אקרובטיים בשיעור מאתגר וייחודי.', features: ['גלגלונים', 'עמידות ידיים', 'עבודת רצפה', 'אלמנטים מתקדמים'], duration: '60 דקות', ages: 'יסודי, תיכון, נשים', levels: ['בסיס', 'מתקדמות'], imageUrl: '/03.png', sortOrder: 4 },
    { title: 'התעמלות קרקע', subtitle: 'כוח, גמישות, אומץ ואנרגיה', description: 'שיעור אנרגטי שמפתח שיווי משקל, כוח, התמצאות במרחב, גמישות ומהירות.', features: ['עמידות ידיים', 'גלגלונים וגשרים', 'פליק פלאקים', 'סלטות'], duration: '60 דקות', ages: 'מקטנטנות ועד נשים', levels: ['מתחילות', 'ממשיכות', 'מתקדמות', 'נבחרת'], imageUrl: '/01.png', sortOrder: 5 }
  ]);

  await seedIfEmpty(Product, [
    { name: 'נעלי בלט', purchaseUrl: 'https://forms.fillout.com/t/5UoM23NsYNus', sortOrder: 1 },
    { name: 'חצאית בלט', purchaseUrl: 'https://forms.fillout.com/t/5UoM23NsYNus', sortOrder: 2 },
    { name: 'גרבי אקרובטיקה', purchaseUrl: 'https://forms.fillout.com/t/5UoM23NsYNus', sortOrder: 3 },
    { name: 'חולצת ספורט', purchaseUrl: 'https://forms.fillout.com/t/5UoM23NsYNus', sortOrder: 4 },
    { name: 'תיק', purchaseUrl: 'https://forms.fillout.com/t/5UoM23NsYNus', sortOrder: 5 }
  ]);

  await seedIfEmpty(Performance, [
    { title: 'הנבחרת - מסע אמנותי מסביב לעולם', subtitle: 'מופע שנתי', description: 'קבוצות המחול בביצועים וכוריאוגרפיות מגוונות.', imageUrl: '/הנבחרת.png', price: 25, sortOrder: 1 },
    { title: 'לרקוד את הדמעות', subtitle: 'מופע זמר', description: 'מופע זמר ייחודי בשילוב להקת הרקדניות של הסטודיו.', imageUrl: '/לרקוד את הדמעות.png', price: 25, sortOrder: 2 },
    { title: 'אהבת עולם', subtitle: 'הפקה שנתית', description: 'הפקת מחול אומנותית עם מאות מופיעות בביצוע חי על הבמה.', imageUrl: '/אהבת עולם תשפד.png', price: 25, sortOrder: 3 },
    { title: 'אהבת עולם', subtitle: 'הפקה שנתית', description: 'הפקת מחול אומנותית עם מאות מופיעות בביצוע חי על הבמה.', imageUrl: '/אהבת עולם תשפה.png', price: 25, sortOrder: 4 }
  ]);
}

module.exports = { seedContent };
