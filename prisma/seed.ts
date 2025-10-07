import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Create default settings if they don't exist
  const existingSettings = await prisma.settings.findFirst();
  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        siteName: "Forge & Steel",
        siteDescription: "Premium Men's Jewelry",
        contactEmail: "contact@forgesteel.com",
        contactPhone: "+972-50-123-4567",
        address: "123 Main Street, Tel Aviv, Israel",
        currency: "ILS",
        currencySymbol: "₪",
        taxRate: 17,
      },
    });
    console.log("Default settings created");
  }

  // Create Categories with multilingual support
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "signature-rings" },
      update: {},
      create: {
        name: "Signature Rings",
        nameEn: "Signature Rings",
        nameHe: "טבעות חתימה",
        slug: "signature-rings",
        description: "Bold statement pieces for the modern gentleman",
        image: "/images/ring-1.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "wedding-bands" },
      update: {},
      create: {
        name: "Wedding Bands",
        nameEn: "Wedding Bands",
        nameHe: "טבעות נישואין",
        slug: "wedding-bands",
        description: "Timeless symbols of commitment",
        image: "/images/ring-2.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "custom-pieces" },
      update: {},
      create: {
        name: "Custom Pieces",
        nameEn: "Custom Pieces",
        nameHe: "יצירות מותאמות אישית",
        slug: "custom-pieces",
        description: "Bespoke jewelry crafted to your vision",
        image: "/images/ring-3.jpg",
      },
    }),
  ]);

  console.log("Categories created:", categories.length);

  // Create Products with multilingual support and 5 images each
  const products = [
    {
      name: "Obsidian Steel Ring",
      nameEn: "Obsidian Steel Ring",
      nameHe: "טבעת פלדת אובסידיאן",
      slug: "obsidian-steel-ring",
      description:
        "A bold statement piece crafted from premium tungsten carbide with a brushed matte finish. Perfect for the modern gentleman.",
      descriptionEn:
        "A bold statement piece crafted from premium tungsten carbide with a brushed matte finish. Perfect for the modern gentleman who values durability and style. This ring features exceptional scratch resistance and a contemporary design.",
      descriptionHe:
        "יצירת אמנות נועזת המיוצרת מקרביד טונגסטן פרימיום עם גימור מט מוברש. מושלם לג'נטלמן המודרני המעריך עמידות וסטייל. הטבעת מציגה עמידות יוצאת דופן בפני שריטות ועיצוב עכשווי.",
      price: 899,
      comparePrice: 1299,
      image: "/images/ring-1.jpg",
      images: [
        "/images/ring-1.jpg",
        "/images/ring-1-alt1.jpg",
        "/images/ring-1-alt2.jpg",
        "/images/ring-1-detail.jpg",
        "/images/ring-1-lifestyle.jpg",
      ],
      inStock: true,
      featured: true,
      freeShipping: true,
      inventory: 15,
      categoryId: categories[0].id,
    },
    {
      name: "Damascus Steel Band",
      nameEn: "Damascus Steel Band",
      nameHe: "טבעת פלדת דמשק",
      slug: "damascus-steel-band",
      description:
        "Hand-forged Damascus steel ring with unique pattern. Each piece is one-of-a-kind.",
      descriptionEn:
        "Hand-forged Damascus steel ring featuring a mesmerizing wave pattern created through ancient metalworking techniques. Each piece is truly one-of-a-kind with its own unique pattern. The ring combines traditional craftsmanship with modern comfort.",
      descriptionHe:
        "טבעת פלדת דמשק מחושלת ידנית עם דוגמת גלים מהפנטת שנוצרה באמצעות טכניקות עתיקות של עיבוד מתכת. כל יצירה היא באמת ייחודית עם דוגמה משלה. הטבעת משלבת אומנות מסורתית עם נוחות מודרנית.",
      price: 1299,
      comparePrice: 1799,
      image: "/images/ring-2.jpg",
      images: [
        "/images/ring-2.jpg",
        "/images/ring-2-pattern.jpg",
        "/images/ring-2-side.jpg",
        "/images/ring-2-detail.jpg",
        "/images/ring-2-hand.jpg",
      ],
      inStock: true,
      featured: true,
      freeShipping: true,
      inventory: 8,
      categoryId: categories[0].id,
    },
    {
      name: "Eternal Gold Band",
      nameEn: "Eternal Gold Band",
      nameHe: "טבעת זהב נצחית",
      slug: "eternal-gold-band",
      description:
        "Classic 18k gold wedding band with polished finish. Timeless elegance.",
      descriptionEn:
        "Classic 18k gold wedding band with mirror polished finish. A symbol of timeless elegance and eternal commitment. Crafted from solid gold with comfort-fit interior for all-day wear. Perfect for those who appreciate traditional luxury.",
      descriptionHe:
        "טבעת נישואין קלאסית מזהב 18 קראט עם גימור מלוטש למראה מראה. סמל של אלגנטיות נצחית ומחויבות נצחית. מעוצבת מזהב מלא עם פנים מתאים לנוחות למשך כל היום. מושלמת למי שמעריך יוקרה מסורתית.",
      price: 2499,
      comparePrice: 2999,
      image: "/images/ring-3.jpg",
      images: [
        "/images/ring-3.jpg",
        "/images/ring-3-shine.jpg",
        "/images/ring-3-angle.jpg",
        "/images/ring-3-pair.jpg",
        "/images/ring-3-box.jpg",
      ],
      inStock: true,
      featured: true,
      freeShipping: true,
      inventory: 12,
      categoryId: categories[1].id,
    },
    {
      name: "Carbon Fiber Ring",
      nameEn: "Carbon Fiber Ring",
      nameHe: "טבעת סיבי פחמן",
      slug: "carbon-fiber-ring",
      description:
        "Modern design combining aerospace-grade carbon fiber with titanium.",
      descriptionEn:
        "Ultra-modern design combining aerospace-grade carbon fiber with surgical titanium. Incredibly lightweight yet extremely durable. The unique weave pattern creates a sophisticated tech-inspired aesthetic. Perfect for those who live on the cutting edge.",
      descriptionHe:
        "עיצוב אולטרה-מודרני המשלב סיבי פחמן בדרגה אווירית עם טיטניום כירורגי. קל במשקל להפליא אך עמיד במיוחד. דוגמת האריגה הייחודית יוצרת אסתטיקה מתוחכמת בהשראת טכנולוגיה. מושלם למי שחי בקצה החדשני.",
      price: 699,
      image: "/images/ring-1.jpg",
      images: [
        "/images/ring-1.jpg",
        "/images/ring-1-carbon.jpg",
        "/images/ring-1-tech.jpg",
        "/images/ring-1-weave.jpg",
        "/images/ring-1-modern.jpg",
      ],
      inStock: true,
      featured: false,
      freeShipping: true,
      inventory: 20,
      categoryId: categories[0].id,
    },
    {
      name: "Platinum Classic",
      nameEn: "Platinum Classic",
      nameHe: "פלטינה קלאסית",
      slug: "platinum-classic",
      description: "Sophisticated platinum band with comfort fit interior.",
      descriptionEn:
        "Sophisticated platinum band with comfort fit interior and refined brushed finish. Platinum's natural white luster and exceptional durability make it the ultimate choice for wedding bands. Hypoallergenic and tarnish-resistant for lifetime wear.",
      descriptionHe:
        "טבעת פלטינה מתוחכמת עם פנים נוחים וגימור מוברש מעודן. הברק הלבן הטבעי והעמידות היוצאת מן הכלל של הפלטינה הופכים אותה לבחירה האולטימטיבית לטבעות נישואין. היפואלרגנית ועמידה בפני השחתה ללבישה כל החיים.",
      price: 3299,
      comparePrice: 3799,
      image: "/images/ring-2.jpg",
      images: [
        "/images/ring-2.jpg",
        "/images/ring-2-platinum.jpg",
        "/images/ring-2-white.jpg",
        "/images/ring-2-elegant.jpg",
        "/images/ring-2-luxury.jpg",
      ],
      inStock: true,
      featured: false,
      freeShipping: true,
      inventory: 6,
      categoryId: categories[1].id,
    },
    {
      name: "Meteorite Inlay Ring",
      nameEn: "Meteorite Inlay Ring",
      nameHe: "טבעת עם שיבוץ מטאוריט",
      slug: "meteorite-inlay-ring",
      description:
        "Unique titanium ring with authentic Gibeon meteorite inlay.",
      descriptionEn:
        "Extraordinary titanium ring featuring authentic Gibeon meteorite inlay with stunning Widmanstätten patterns. This meteorite formed over 4 billion years ago and traveled through space before landing in Namibia. Each ring contains a genuine piece of space history with its own unique crystalline structure.",
      descriptionHe:
        "טבעת טיטניום יוצאת דופן עם שיבוץ מטאוריט גיבאון אותנטי עם דוגמאות וידמנשטטן מהממות. מטאוריט זה נוצר לפני למעלה מ-4 מיליארד שנה ועבר במרחבי החלל לפני שנחת בנמיביה. כל טבעת מכילה חתיכה אמיתית של היסטוריה חללית עם מבנה גבישי ייחודי משלה.",
      price: 1599,
      image: "/images/ring-3.jpg",
      images: [
        "/images/ring-3.jpg",
        "/images/ring-3-space.jpg",
        "/images/ring-3-pattern-detail.jpg",
        "/images/ring-3-meteorite.jpg",
        "/images/ring-3-cosmic.jpg",
      ],
      inStock: true,
      featured: true,
      freeShipping: true,
      inventory: 5,
      categoryId: categories[2].id,
    },
    {
      name: "Black Zirconium Band",
      nameEn: "Black Zirconium Band",
      nameHe: "טבעת זירקוניום שחור",
      slug: "black-zirconium-band",
      description:
        "Sleek black zirconium ring with natural ceramic oxide finish.",
      descriptionEn:
        "Sleek black zirconium band with permanent black ceramic oxide finish. Created through a specialized heating process that transforms the metal's surface into ultra-hard black ceramic. Scratch-resistant, hypoallergenic, and maintains its deep black color for life. Modern sophistication meets durability.",
      descriptionHe:
        "טבעת זירקוניום שחורה מלוטשה עם גימור תחמוצת קרמית שחורה קבועה. נוצרת באמצעות תהליך חימום מיוחד שהופך את פני השטח של המתכת לקרמיקה שחורה קשה במיוחד. עמידה בפני שריטות, היפואלרגנית ושומרת על הצבע השחור העמוק שלה לכל החיים. תחכום מודרני פוגש עמידות.",
      price: 799,
      comparePrice: 999,
      image: "/images/ring-1.jpg",
      images: [
        "/images/ring-1.jpg",
        "/images/ring-1-black.jpg",
        "/images/ring-1-dark.jpg",
        "/images/ring-1-ceramic.jpg",
        "/images/ring-1-sleek.jpg",
      ],
      inStock: true,
      featured: true,
      freeShipping: true,
      inventory: 18,
      categoryId: categories[0].id,
    },
    {
      name: "Rose Gold Elegance",
      nameEn: "Rose Gold Elegance",
      nameHe: "אלגנטיות זהב ורוד",
      slug: "rose-gold-elegance",
      description: "Romantic 14k rose gold band with brushed finish.",
      descriptionEn:
        "Romantic 14k rose gold band with brushed finish and beveled edges. The warm pink hue of rose gold creates a unique and contemporary look. The copper alloy gives it exceptional durability while maintaining its distinctive color. A perfect blend of modern style and classic romance.",
      descriptionHe:
        "טבעת זהב ורוד רומנטית 14 קראט עם גימור מוברש וקצוות משופעים. הגוון הוורוד החם של זהב ורוד יוצר מראה ייחודי ועכשווי. סגסוגת הנחושת מעניקה לה עמידות יוצאת מן הכלל תוך שמירה על הצבע הייחודי שלה. שילוב מושלם של סטייל מודרני ורומנטיקה קלאסית.",
      price: 1899,
      comparePrice: 2299,
      image: "/images/ring-2.jpg",
      images: [
        "/images/ring-2.jpg",
        "/images/ring-2-rose.jpg",
        "/images/ring-2-pink.jpg",
        "/images/ring-2-warm.jpg",
        "/images/ring-2-romantic.jpg",
      ],
      inStock: true,
      featured: false,
      freeShipping: true,
      inventory: 10,
      categoryId: categories[1].id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log("Products created:", products.length);
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
