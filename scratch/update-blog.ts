import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const posts = [
  {
    title: "10 Hidden Gems in Southeast Asia You Must Visit",
    content: "<p>Southeast Asia is a treasure trove of stunning landscapes, rich history, and vibrant cultures. While places like Bali and Phuket are well-known, there are numerous hidden gems waiting to be explored.</p><br/><p>From the secluded beaches of Koh Rong in Cambodia to the ancient temples of Bagan in Myanmar, this guide takes you off the beaten path. Discover local cuisines, untouched natural wonders, and experience the true essence of Southeast Asia without the crowds.</p>",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    author: "Jane Doe"
  },
  {
    title: "The Ultimate Guide to Backpacking Through Europe",
    content: "<p>Backpacking through Europe is a rite of passage for many travelers. With its diverse cultures, historic cities, and excellent train connectivity, it offers an adventure of a lifetime.</p><br/><p>In this comprehensive guide, we cover everything from budgeting and packing essentials to navigating the Eurail system. Learn how to find the best hostels, avoid tourist traps, and make the most of your European journey whether you have two weeks or two months.</p>",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    author: "John Smith"
  },
  {
    title: "Eco-Friendly Travel: How to Explore Responsibly",
    content: "<p>As we travel to beautiful destinations, it is crucial to consider our impact on the environment and local communities. Sustainable travel is no longer just a trend; it's a necessity.</p><br/><p>Discover practical tips on how to reduce your carbon footprint while traveling. Learn about choosing eco-friendly accommodations, supporting local artisans, and participating in ethical wildlife tours. Together, we can ensure that the world's wonders are preserved for future generations.</p>",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1474&q=80",
    author: "Alice Johnson"
  },
  {
    title: "Top 5 Culinary Destinations for Food Lovers",
    content: "<p>For many, travel is synonymous with food. Exploring a new culture through its cuisine is an incredibly rewarding experience that tantalizes the taste buds and warms the soul.</p><br/><p>Join us as we explore the top 5 culinary destinations around the globe. From the bustling street food markets of Bangkok to the Michelin-starred restaurants of Paris, get ready for a mouth-watering journey that will inspire your next foodie adventure.</p>",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    author: "Michael Brown"
  }
];

async function main() {
  console.log('Seeding blog posts...');
  for (const post of posts) {
    const created = await prisma.post.create({
      data: post,
    });
    console.log(`Created post: ${created.title}`);
  }
  console.log('Blog posts seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
