/**
 * Database seeder — populates the portfolio with the real resume content.
 *
 *   npm run seed          → seeds collections that are still empty (safe to re-run)
 *   npm run seed:fresh    → wipes content collections and reseeds (admin kept)
 *
 * The admin account is created from ADMIN_EMAIL / ADMIN_PASSWORD env vars
 * (defaults are used for local development only). The password is always
 * hashed with bcrypt before storage — plaintext is never persisted.
 *
 * Also installs the bundled seed assets (profile photo + resume PDF) into the
 * active storage provider (Cloudinary when configured, local disk otherwise).
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Project = require('../models/Project');
const Education = require('../models/Education');
const Certification = require('../models/Certification');
const ContactMessage = require('../models/ContactMessage');
const SiteSettings = require('../models/SiteSettings');
const { uploadBuffer } = require('../services/storageService');
const data = require('./seedData');

const SEED_ASSETS = path.join(__dirname, '..', 'seed-assets');

const seedAdmin = async () => {
  const existing = await Admin.countDocuments();
  if (existing > 0) {
    console.log('• Admin account already exists — skipped');
    return;
  }
  const email = (process.env.ADMIN_EMAIL || 'admin@soumik.dev').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
  await Admin.create({ name: 'Soumik Adhikary', email, password, role: 'admin' });
  console.log(`✓ Admin created: ${email}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log('⚠ Default dev password in use — set ADMIN_PASSWORD in .env and re-seed.');
  }
};

const seedAssets = async () => {
  const profile = await Profile.getSingleton();
  const photoPath = path.join(SEED_ASSETS, 'profile.jpg');
  const resumePath = path.join(SEED_ASSETS, 'Soumik_Adhikary_MERN_Stack_Resume.pdf');

  if (!profile.photoUrl && fs.existsSync(photoPath)) {
    const buffer = fs.readFileSync(photoPath);
    const result = await uploadBuffer(buffer, 'profile.jpg', 'image');
    profile.photoUrl = result.url;
    profile.photoPublicId = result.publicId;
    profile.photoProvider = result.provider;
    profile.photoUpdatedAt = new Date();
    console.log('✓ Profile photo installed');
  }
  if (!profile.resumePublicId && fs.existsSync(resumePath)) {
    const buffer = fs.readFileSync(resumePath);
    const result = await uploadBuffer(buffer, 'Soumik_Adhikary_MERN_Stack_Resume.pdf', 'raw');
    profile.resumeFileName = 'Soumik_Adhikary_MERN_Stack_Resume.pdf';
    profile.resumeUrl = '/api/resume/download';
    profile.resumePublicId = result.publicId;
    profile.resumeProvider = result.provider;
    profile.resumeFileSize = result.bytes;
    profile.resumeUpdatedAt = new Date();
    console.log('✓ Resume installed');
  }
  await profile.save();
};

const seedContent = async () => {
  const fresh = process.argv.includes('--fresh');

  if (fresh) {
    await Promise.all([
      Skill.deleteMany({}),
      Experience.deleteMany({}),
      Project.deleteMany({}),
      Education.deleteMany({}),
      Certification.deleteMany({}),
      ContactMessage.deleteMany({}),
    ]);
    console.log('• Content collections cleared (--fresh)');
  }

  const [skills, experience, projects, education, certifications] = await Promise.all([
    Skill.countDocuments(),
    Experience.countDocuments(),
    Project.countDocuments(),
    Education.countDocuments(),
    Certification.countDocuments(),
  ]);

  if (skills === 0) {
    await Skill.insertMany(data.skills);
    console.log(`✓ ${data.skills.length} skills seeded`);
  }
  if (experience === 0) {
    await Experience.insertMany(data.experience);
    console.log(`✓ ${data.experience.length} experience entries seeded`);
  }
  if (projects === 0) {
    await Project.insertMany(data.projects);
    console.log(`✓ ${data.projects.length} projects seeded`);
  }
  if (education === 0) {
    await Education.insertMany(data.education);
    console.log(`✓ ${data.education.length} education entries seeded`);
  }
  if (certifications === 0) {
    await Certification.insertMany(data.certifications);
    console.log(`✓ ${data.certifications.length} certifications seeded`);
  }

  // Profile & settings singletons — set defaults only when still blank
  const profile = await Profile.getSingleton();
  const s = data.profile;
  const blanks = !profile.name && !profile.title && !profile.summary;
  if (blanks) {
    Object.assign(profile, s);
    await profile.save();
    console.log('✓ Profile seeded');
  }
  await SiteSettings.getSingleton();
  console.log('✓ Site settings ready');
};

const run = async () => {
  try {
    await connectDB();
    await seedAdmin();
    await seedAssets();
    await seedContent();
    console.log('✔ Seeding complete');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('✗ Seeding failed:', err.message);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
};

run();
