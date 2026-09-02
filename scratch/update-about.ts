import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.pageContent.upsert({
    where: { pageName: 'about' },
    update: {
      title: 'About Us',
      content: `<h2>Our Journey</h2>
<p>Welcome to our travel agency, your premier partner in exploring the breathtaking beauty of the world. Founded with a passion for discovery, we believe that traveling is more than just visiting a place—it is about creating memories that last a lifetime.</p>
<br/>
<h2>Our Mission</h2>
<p>Our mission is to provide unforgettable travel experiences tailored to your unique desires. Whether you are seeking a serene beach getaway, an adventurous mountain trek, or a deep dive into diverse cultures, we meticulously plan every detail so you can focus on the journey.</p>
<br/>
<h2>Why Choose Us?</h2>
<ul>
<li><strong>Expert Guides:</strong> Our team consists of seasoned travelers and local experts who know the hidden gems of every destination.</li>
<li><strong>Personalized Itineraries:</strong> We craft custom packages that suit your budget, preferences, and pace.</li>
<li><strong>24/7 Support:</strong> From the moment you book until you return home, our dedicated support team is always just a call away.</li>
</ul>
<br/>
<p>Join us on a journey to explore the unseen, experience the extraordinary, and embrace the wanderlust within you!</p>`,
    },
    create: {
      pageName: 'about',
      title: 'About Us',
      content: `<h2>Our Journey</h2>
<p>Welcome to our travel agency, your premier partner in exploring the breathtaking beauty of the world. Founded with a passion for discovery, we believe that traveling is more than just visiting a place—it is about creating memories that last a lifetime.</p>
<br/>
<h2>Our Mission</h2>
<p>Our mission is to provide unforgettable travel experiences tailored to your unique desires. Whether you are seeking a serene beach getaway, an adventurous mountain trek, or a deep dive into diverse cultures, we meticulously plan every detail so you can focus on the journey.</p>
<br/>
<h2>Why Choose Us?</h2>
<ul>
<li><strong>Expert Guides:</strong> Our team consists of seasoned travelers and local experts who know the hidden gems of every destination.</li>
<li><strong>Personalized Itineraries:</strong> We craft custom packages that suit your budget, preferences, and pace.</li>
<li><strong>24/7 Support:</strong> From the moment you book until you return home, our dedicated support team is always just a call away.</li>
</ul>
<br/>
<p>Join us on a journey to explore the unseen, experience the extraordinary, and embrace the wanderlust within you!</p>`,
    },
  });
  console.log('About page updated successfully');
}
main().finally(() => prisma.$disconnect());
