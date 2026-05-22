export interface SeedCategory {
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  sortOrder: number;
}

export interface SeedVariant {
  name: string;
  flavor: string;
  size: string;
  mrp: number;
  salePrice: number;
  stock: number;
  isDefault: boolean;
}

export interface SeedProduct {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  isFeatured: boolean;
  themeColor: string;
  gallery: string[];
  categorySlug: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  variants: SeedVariant[];
}

export interface SeedCoupon {
  code: string;
  description: string;
  type: 'FLAT' | 'PERCENTAGE';
  value: number;
  minCartValue: number;
  maxDiscount?: number;
  usageLimit?: number;
}

export interface SeedBlog {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  readingTime: number;
}

export interface SeedReview {
  productSlug: string;
  customerName: string;
  customerPhone: string;
  rating: number;
  title: string;
  comment: string;
  isFeatured: boolean;
}

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    name: 'Mass Gainers',
    slug: 'mass-gainer',
    description: 'High-calorie formulas engineered for packing on serious size and strength.',
    icon: 'TrendingUp',
    image: '/images/backgrounds/category-bg.jpg',
    sortOrder: 1,
  },
];

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    name: 'HARD Mass Gainer',
    slug: 'hard-mass-gainer',
    shortDescription: 'Heavyweight anabolic mass gainer to pack on serious size fast.',
    description: 'HARD Mass Gainer features premium slow and fast-release proteins, complex carbohydrates, and essential nutrients. The ultimate high-density bulk formula designed to support muscle hypertrophy and heavy lifting recovery. Powered with 20g of protein, 340 kcal, and 60g carbs per serving (25 servings per pack).',
    isFeatured: true,
    themeColor: 'hard-blue',
    gallery: [
      '/images/placeholders/hard-mass-gainer.png'
    ],
    categorySlug: 'mass-gainer',
    seoTitle: 'HARD Mass Gainer | Heavyweight Size Gainer | Komando Labs',
    seoDescription: 'Boost your mass with HARD Mass Gainer by Komando Labs. Cookie with Cream flavor. 2.5 KG pack delivering 20g protein, 340 kcal, and 60g carbs per serving.',
    seoKeywords: 'hard mass gainer, mass gainer, weight gainer, bulk, muscle growth',
    variants: [
      {
        name: 'Cookie With Cream — 2.5 KG',
        flavor: 'Cookie With Cream',
        size: '2.5 KG',
        mrp: 3999,
        salePrice: 3999,
        stock: 60,
        isDefault: true,
      },
    ],
  },
  {
    name: 'SPARTAN Mass Gainer',
    slug: 'spartan-mass-gainer',
    shortDescription: 'High-calorie mass builder loaded with premium proteins and complex carbs.',
    description: 'Designed for hardgainers, SPARTAN Mass Gainer delivers a colossal 465 kcal per serving with a premium carb-to-protein ratio. Fuel intense training sessions, support rapid size gains, and achieve your bulking goals with clean ingredients. Loaded with 19g protein, 465 kcal, and 62g carbs per serving (25 servings per pack).',
    isFeatured: true,
    themeColor: 'spartan-red',
    gallery: [
      '/images/placeholders/spartan-mass-gainer.png'
    ],
    categorySlug: 'mass-gainer',
    seoTitle: 'SPARTAN Mass Gainer | Elite Bulking Formula | Komando Labs',
    seoDescription: 'Pack on size and muscle with SPARTAN Mass Gainer by Komando Labs. Chocolate Ice Cream flavor. 2.5 KG pack delivering 19g protein, 465 kcal, and 62g carbs per serving.',
    seoKeywords: 'spartan mass gainer, mass gainer, weight gainer, bulk, muscle growth',
    variants: [
      {
        name: 'Chocolate Ice Cream — 2.5 KG',
        flavor: 'Chocolate Ice Cream',
        size: '2.5 KG',
        mrp: 3999,
        salePrice: 3999,
        stock: 75,
        isDefault: true,
      },
    ],
  },
];

export const SEED_COUPONS: SeedCoupon[] = [
  {
    code: 'WELCOME10',
    description: 'Get 10% off on your first order! (Min. Cart: ₹1,000, Max. Discount: ₹500)',
    type: 'PERCENTAGE',
    value: 10,
    minCartValue: 1000,
    maxDiscount: 500,
  },
  {
    code: 'KOMANDO500',
    description: 'Flat ₹500 off on premium supplements! (Min. Cart: ₹3,999)',
    type: 'FLAT',
    value: 500,
    minCartValue: 3999,
    usageLimit: 1000,
  },
];

export const SEED_HOMEPAGE_SETTINGS = {
  key: 'homepage_settings',
  description: 'Homepage content configuration for site details, hero text, and featured items.',
  value: {
    siteName: 'Komando Labs',
    tagline: 'Command Your Strength',
    hero: {
      title: 'COMMAND YOUR STRENGTH',
      subtitle: 'Premium, science-backed formulations engineered for elite physical performance. Shatter your plateaus and fuel your evolution.',
      primaryBtnText: 'Explore Products',
      primaryBtnUrl: '/shop',
      secondaryBtnText: 'Verify Authenticity',
      secondaryBtnUrl: '/verify-product',
      bgImage: '/images/backgrounds/hero-bg.jpg',
    },
    features: [
      {
        title: '100% Authentic',
        description: 'Every product comes with a unique scratch verification code.',
      },
      {
        title: 'Science-Backed',
        description: 'Formulated with clinically-dosed, premium ingredients.',
      },
      {
        title: 'Zero Fillers',
        description: 'Transparent labeling with absolute purity in every scoop.',
      },
    ],
  },
};

export const SEED_BLOGS: SeedBlog[] = [
  {
    title: 'The Ultimate Guide to Gaining Mass and Strength Safely',
    slug: 'guide-to-mass-gainers',
    excerpt: 'Learn how to utilize premium mass gainers alongside consistent training to safely build lean muscle volume.',
    content: `When it comes to building size, you must consume more calories than you burn. However, obtaining clean calories from whole foods alone can be incredibly difficult for hardgainers. This is where mass gainers play a pivotal role.

### What is a Mass Gainer?
A mass gainer is a supplement that provides protein, carbohydrates, and fats with the goal of helping you pack on muscle. It is designed to make it easier to hit your caloric surplus goals, especially after strenuous physical sessions when recovery demands are at their peak.

### How to Dose Properly
For optimal results, consume 1 serving (~100g) of either HARD Mass Gainer or SPARTAN Mass Gainer post-workout or in-between meals. This ensures a consistent supply of amino acids and complex carbs to replenish depleted glycogen levels and kickstart muscle repair.`,
    coverImage: '/images/placeholders/blog-placeholder.png',
    tags: ['mass gainer', 'bulking', 'nutrition', 'fitness'],
    readingTime: 4,
  },
];

export const SEED_REVIEWS: SeedReview[] = [
  {
    productSlug: 'hard-mass-gainer',
    customerName: 'Aarav Sharma',
    customerPhone: '9876543210',
    rating: 5,
    title: 'Premium Taste & Clean Calories!',
    comment: 'HARD Mass Gainer Cookie With Cream flavor is absolutely delicious and doesn\'t feel heavy on the stomach. The mixability is perfect. Highly recommended!',
    isFeatured: true,
  },
  {
    productSlug: 'spartan-mass-gainer',
    customerName: 'Vikram Singh',
    customerPhone: '9898989898',
    rating: 5,
    title: 'Finally Gaining Lean Mass!',
    comment: 'SPARTAN Chocolate Ice Cream flavor is rich and satisfying. Easy way to hit my daily caloric surplus. Love the authenticity scratch code feature too.',
    isFeatured: true,
  },
];
