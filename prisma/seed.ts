import { PrismaClient } from '@prisma/client';
import { destinationData, hotelsData, toursData, reviewData } from '../data/data';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Destinations
  for (const dest of destinationData) {
    const created = await prisma.destination.create({
      data: {
        image: dest.image,
        country: dest.country,
        travelers: dest.travelers,
      },
    });
    console.log(`Created destination with id: ${created.id}`);
  }

  // Hotels
  for (const hotel of hotelsData) {
    const created = await prisma.hotel.create({
      data: {
        image: hotel.image,
        name: hotel.name,
        location: hotel.location,
        rating: hotel.rating,
        reviews: hotel.reviews,
        price: hotel.price,
      },
    });
    console.log(`Created hotel with id: ${created.id}`);
  }

  // Tours
  for (const tour of toursData) {
    const created = await prisma.tour.create({
      data: {
        image: tour.image,
        title: tour.title,
        location: tour.location,
        time: tour.time,
        type: tour.type,
        rating: tour.rating,
        reviews: tour.reviews,
        price: tour.price,
      },
    });
    console.log(`Created tour with id: ${created.id}`);
  }

  // Reviews
  for (const review of reviewData) {
    const created = await prisma.review.create({
      data: {
        name: review.name,
        review: review.review,
        image: review.image,
      },
    });
    console.log(`Created review with id: ${created.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
