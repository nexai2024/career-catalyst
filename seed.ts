/**
 * ! Executing this script will delete all data in your database and seed it with 10 subscription.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";

const main = async () => {
  const seed = await createSeedClient({connect: true})
    // The path to your database schema file)

  // Truncate all tables in the database
 // await seed.$resetDatabase();

  // Seed the database with 10 subscription
  //await seed.wrappers_fdw_stats((x) => x(10));
  //                                       await seed.user((x) => x(10));
   await seed.questions((x) => x(100));
  await seed.assessment((x) => x(10));
  await seed.assessmentQuestion((x) => x(100));
  await seed.userAssessment((x) => x(10));
  await seed.careerPlan((x) => x(10));
  await seed.milestone((x) => x(10));
  await seed.course((x) => x(10));
  await seed.courseModules((x) => x(10));
  await seed.learningProgress((x) => x(10));
 await seed.userCourseEnrollments((x) => x(10));
  await seed.userModuleProgress((x) => x(10));
  await seed.skill((x) => x(10));
  await seed.experience((x) => x(10));
  await seed.profile((x) => x(10));         
  await seed.userResponses((x) => x(100));
  await seed.document((x) => x(10));
  await seed.jobApplication((x) => x(10));  
  await seed.feature((x) => x(10));
  await seed.featureUsage((x) => x(10));


  await seed.subscription((x) => x(10));
  await seed.userSubscription((x) => x(10)); 

  // Type completion not working? You might want to reload your TypeScript Server to pick up the changes

  console.log("Database seeded successfully!");

  process.exit();
};

main();