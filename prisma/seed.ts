import { PrismaClient, AdminRole, ProductStatus, CouponType, BlogStatus, OrderStatus, PaymentMethod, ReviewStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_COUPONS,
  SEED_HOMEPAGE_SETTINGS,
  SEED_BLOGS,
  SEED_REVIEWS,
} from '../src/lib/seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean up existing catalog & transaction data
  console.log('Cleaning up existing database data...');
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.verificationCode.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.blog.deleteMany({});
  await prisma.coupon.deleteMany({});

  // 1. Seed Admin User
  const adminEmail = 'admin@komandolabs.com';
  console.log(`Seeding admin user: ${adminEmail}`);
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Admin@123', salt);

  let adminId: string;

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: 'Komando Admin',
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Komando Admin',
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  });
  adminId = admin.id;

  // 2. Seed Categories
  console.log('Seeding categories...');
  const categoriesMap = new Map<string, string>(); // slug -> id

  for (const cat of SEED_CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        image: cat.image,
        sortOrder: cat.sortOrder,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        image: cat.image,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
    categoriesMap.set(category.slug, category.id);
  }

  // 3. Seed Products and Variants
  console.log('Seeding products and variants...');
  const productsMap = new Map<string, string>(); // slug -> id
  const variantsMap = new Map<string, string>(); // variant name -> id

  for (const prod of SEED_PRODUCTS) {
    const categoryId = categoriesMap.get(prod.categorySlug);
    if (!categoryId) {
      console.warn(`Category slug "${prod.categorySlug}" not found. Skipping product "${prod.name}"`);
      continue;
    }

    // Upsert the product
    const product = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        description: prod.description,
        shortDescription: prod.shortDescription,
        categoryId: categoryId,
        status: ProductStatus.ACTIVE,
        isFeatured: prod.isFeatured,
        gallery: prod.gallery,
        themeColor: prod.themeColor,
        seoTitle: prod.seoTitle,
        seoDescription: prod.seoDescription,
        seoKeywords: prod.seoKeywords,
      },
      create: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        shortDescription: prod.shortDescription,
        categoryId: categoryId,
        status: ProductStatus.ACTIVE,
        isFeatured: prod.isFeatured,
        gallery: prod.gallery,
        themeColor: prod.themeColor,
        seoTitle: prod.seoTitle,
        seoDescription: prod.seoDescription,
        seoKeywords: prod.seoKeywords,
      },
    });

    productsMap.set(product.slug, product.id);

    // Delete existing variants to avoid duplicates/stale data, then recreate
    await prisma.productVariant.deleteMany({
      where: { productId: product.id },
    });

    for (const variant of prod.variants) {
      const discountPercent = variant.mrp > 0 
        ? ((variant.mrp - variant.salePrice) / variant.mrp) * 100 
        : 0;

      const createdVariant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: variant.name,
          flavor: variant.flavor,
          size: variant.size,
          mrp: variant.mrp,
          salePrice: variant.salePrice,
          discountPercent,
          stock: variant.stock,
          isDefault: variant.isDefault,
          isActive: true,
        },
      });
      variantsMap.set(`${product.slug}:${variant.name}`, createdVariant.id);
    }
  }

  // 4. Seed Coupons
  console.log('Seeding coupons...');
  const now = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(now.getFullYear() + 1);

  for (const cp of SEED_COUPONS) {
    await prisma.coupon.upsert({
      where: { code: cp.code },
      update: {
        description: cp.description,
        type: cp.type === 'FLAT' ? CouponType.FLAT : CouponType.PERCENTAGE,
        value: cp.value,
        minCartValue: cp.minCartValue,
        maxDiscount: cp.maxDiscount || null,
        usageLimit: cp.usageLimit || null,
        validFrom: now,
        validUntil: nextYear,
        isActive: true,
      },
      create: {
        code: cp.code,
        description: cp.description,
        type: cp.type === 'FLAT' ? CouponType.FLAT : CouponType.PERCENTAGE,
        value: cp.value,
        minCartValue: cp.minCartValue,
        maxDiscount: cp.maxDiscount || null,
        usageLimit: cp.usageLimit || null,
        validFrom: now,
        validUntil: nextYear,
        isActive: true,
      },
    });
  }

  // 5. Seed Homepage Settings
  console.log('Seeding homepage settings...');
  await prisma.setting.upsert({
    where: { key: SEED_HOMEPAGE_SETTINGS.key },
    update: {
      value: SEED_HOMEPAGE_SETTINGS.value,
      description: SEED_HOMEPAGE_SETTINGS.description,
    },
    create: {
      key: SEED_HOMEPAGE_SETTINGS.key,
      value: SEED_HOMEPAGE_SETTINGS.value,
      description: SEED_HOMEPAGE_SETTINGS.description,
    },
  });

  // 6. Seed Blog Posts
  console.log('Seeding blog posts...');
  for (const blog of SEED_BLOGS) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: {
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        coverImage: blog.coverImage,
        status: BlogStatus.PUBLISHED,
        authorId: adminId,
        authorName: 'Komando Admin',
        tags: blog.tags,
        readingTime: blog.readingTime,
        publishedAt: now,
      },
      create: {
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt,
        coverImage: blog.coverImage,
        status: BlogStatus.PUBLISHED,
        authorId: adminId,
        authorName: 'Komando Admin',
        tags: blog.tags,
        readingTime: blog.readingTime,
        publishedAt: now,
      },
    });
  }

  // 7. Seed Sample Order and Reviews (with verification constraints met)
  console.log('Seeding sample orders and reviews...');
  const seedOrderNumber = 'KMD-ORD-SEED01';
  let order = await prisma.order.findUnique({
    where: { orderNumber: seedOrderNumber },
  });

  const firstProductSlug = SEED_PRODUCTS[0].slug;
  const firstProductName = SEED_PRODUCTS[0].name;
  const firstVariantName = SEED_PRODUCTS[0].variants[0].name;
  
  const productId = productsMap.get(firstProductSlug);
  const variantId = variantsMap.get(`${firstProductSlug}:${firstVariantName}`);

  if (productId && variantId) {
    if (!order) {
      order = await prisma.order.create({
        data: {
          orderNumber: seedOrderNumber,
          customerName: 'Aarav Sharma',
          customerEmail: 'aarav@example.com',
          customerPhone: '9876543210',
          shippingAddress: {
            street: '123 Elite Fitness Lane',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
          },
          subtotal: 3799,
          shippingAmount: 0,
          discountAmount: 0,
          totalAmount: 3799,
          status: OrderStatus.DELIVERED,
          paymentMethod: PaymentMethod.COD,
          items: {
            create: {
              productId,
              variantId,
              productName: firstProductName,
              variantName: firstVariantName,
              quantity: 1,
              unitPrice: 3799,
              totalPrice: 3799,
            },
          },
        },
      });
    }

    // Now seed reviews using the created order
    for (const rev of SEED_REVIEWS) {
      const targetProductId = productsMap.get(rev.productSlug);
      if (!targetProductId) continue;

      // Clean up duplicate review if exists
      await prisma.review.deleteMany({
        where: {
          productId: targetProductId,
          customerPhone: rev.customerPhone,
        },
      });

      await prisma.review.create({
        data: {
          productId: targetProductId,
          orderId: order.id,
          customerName: rev.customerName,
          customerPhone: rev.customerPhone,
          rating: rev.rating,
          title: rev.title,
          comment: rev.comment,
          status: ReviewStatus.APPROVED,
          isFeatured: rev.isFeatured,
        },
      });
    }
  }

  // Calculate and update avgRating and totalReviews for products
  console.log('Calculating product rating aggregates...');
  for (const [slug, prodId] of productsMap.entries()) {
    const reviews = await prisma.review.findMany({
      where: {
        productId: prodId,
        status: ReviewStatus.APPROVED,
      },
    });

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    await prisma.product.update({
      where: { id: prodId },
      data: {
        totalReviews,
        avgRating,
      },
    });
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
