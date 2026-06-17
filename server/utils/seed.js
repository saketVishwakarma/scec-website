/**
 * Seed script — populates MongoDB with:
 *  - 1 superadmin user
 *  - Sample notices, courses, universities, centers, site settings
 *
 * Run with: npm run seed
 * (Make sure MONGODB_URI is set in .env first)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Notice = require('../models/Notice');
const Course = require('../models/Course');
const University = require('../models/University');
const Center = require('../models/Center');
const SiteSettings = require('../models/SiteSettings');

const seed = async () => {
  await connectDB();
  console.log('🌱 Seeding database...\n');

  // ── Superadmin user ─────────────────────────────────────────
  const existingAdmin = await User.findOne({ email: 'admin@scecallahabad.com' });
  if (!existingAdmin) {
    await User.create({
      name: 'Super Admin',
      email: 'admin@scecallahabad.com',
      password: 'Admin@12345',  // CHANGE THIS after first login!
      role: 'superadmin',
    });
    console.log('✅ Superadmin created: admin@scecallahabad.com / Admin@12345');
    console.log('   ⚠️  Please log in and change this password immediately.\n');
  } else {
    console.log('ℹ️  Superadmin already exists, skipping.\n');
  }

  // ── Site settings ────────────────────────────────────────────
  await SiteSettings.findOneAndUpdate(
    { key: 'global' },
    {
      siteName: 'SCEC Allahabad',
      tagline: 'SCEC Allahabad',
      established: '08-May-2009',
      companyAct: 'Companies Act 1956, Government of India',
      phone: '+91-XXXXXXXXXX',
      email: 'info@scecallahabad.com',
      address: 'Allahabad, Uttar Pradesh, India',
      admissionBanner: 'Admissions Open 2025–26',
      directorName: 'Director Name',
      directorRole: 'Director, SCEC Allahabad',
      directorMessage: "I am glad to invite all students, parents, professionals and people in my quest for excellence in education. I firmly believe that knowledge of the world is to be acquired only in the open world and not in closed classrooms.",
      mission: 'Educated, Empowered, Employed YOUTH to Provide LEADERSHIP',
      vision: 'To be a unified, well focused Institute, universally acknowledged as the leader in education and training contributing to the sustainable development of the youth, community and region.',
    },
    { upsert: true, new: true }
  );
  console.log('✅ Site settings configured\n');

  // ── Notices ──────────────────────────────────────────────────
  await Notice.deleteMany({});
  await Notice.insertMany([
    { title: 'Result declared — Subharti University', body: 'The semester results have been declared. Students can check their results on the university portal.', category: 'Subharti University', pinned: true, isActive: true },
    { title: 'O Level July 2025 registration open', body: 'Registrations for O Level July 2025 examination cycle are now open. Last date to apply is April 20, 2025.', category: 'O Level', isActive: true },
    { title: 'CCC April 2025 exam scheduled', body: 'CCC examinations for the April 2025 cycle will be conducted starting April 27, 2025.', category: 'CCC', isActive: true },
    { title: 'LLB 2nd/4th/6th semester exams from May 2', body: 'Allahabad University has scheduled LLB semester examinations starting May 2, 2025.', category: 'Allahabad University', isActive: true },
  ]);
  console.log('✅ Sample notices created (4)\n');

  // ── Courses ──────────────────────────────────────────────────
  await Course.deleteMany({});
  await Course.insertMany([
    { name: 'BCA', category: 'Computer', duration: '3 Years', level: 'Bachelor', university: 'Multiple', description: 'Bachelor of Computer Applications' },
    { name: 'MCA', category: 'Computer', duration: '2 Years', level: 'Master', university: 'Multiple', description: 'Master of Computer Applications' },
    { name: 'O Level', category: 'Computer', duration: '1 Year', level: 'Diploma', university: 'NIELIT', description: 'NIELIT O Level Computer Course' },
    { name: 'MBA', category: 'Management', duration: '2 Years', level: 'Master', university: 'Subharti University', description: 'Master of Business Administration' },
    { name: 'BBA', category: 'Management', duration: '3 Years', level: 'Bachelor', university: 'Multiple', description: 'Bachelor of Business Administration' },
    { name: 'LLB', category: 'Law', duration: '3 Years', level: 'Bachelor', university: 'Allahabad University', description: 'Bachelor of Laws' },
    { name: 'B.Ed', category: 'Education', duration: '2 Years', level: 'Bachelor', university: 'Prayagraj University', description: 'Bachelor of Education' },
    { name: 'D.El.Ed (BTC)', category: 'Education', duration: '2 Years', level: 'Diploma', university: 'Multiple', description: 'Diploma in Elementary Education' },
    { name: 'GNM', category: 'Medical', duration: '3 Years', level: 'Diploma', university: 'Multiple', description: 'General Nursing and Midwifery' },
  ]);
  console.log('✅ Sample courses created (9)\n');

  // ── Universities ─────────────────────────────────────────────
  await University.deleteMany({});
  await University.insertMany([
    { name: 'Swami Vivekanand Subharti University', shortName: 'SVSU', location: 'Meerut, Uttar Pradesh', affiliationType: 'Private', programs: ['MBA', 'BBA', 'BCA', 'MCA'] },
    { name: 'Allahabad State University', shortName: 'ASU', location: 'Prayagraj, Uttar Pradesh', affiliationType: 'State', programs: ['LLB', 'BA', 'B.Sc'] },
    { name: 'NIELIT', shortName: 'NIELIT', location: 'New Delhi', affiliationType: 'Central', programs: ['O Level', 'A Level', 'B Level', 'C Level'] },
    { name: 'NIOS', shortName: 'NIOS', location: 'Noida, Uttar Pradesh', affiliationType: 'Central', programs: ['10th', '12th'] },
  ]);
  console.log('✅ Sample universities created (4)\n');

  // ── Centers ──────────────────────────────────────────────────
  await Center.deleteMany({});
  await Center.insertMany([
    { name: 'SCEC Allahabad — Main Campus', address: 'Civil Lines, Prayagraj, Uttar Pradesh', city: 'Prayagraj', phone: '+91-XXXXXXXXXX', email: 'info@scecallahabad.com' },
  ]);
  console.log('✅ Sample centers created (1)\n');

  console.log('🎉 Seeding complete!\n');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
