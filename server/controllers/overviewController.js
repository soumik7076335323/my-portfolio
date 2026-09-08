const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Project = require('../models/Project');
const Education = require('../models/Education');
const Certification = require('../models/Certification');
const ContactMessage = require('../models/ContactMessage');

// GET /api/overview (admin) — dashboard summary cards
exports.getOverview = async (req, res, next) => {
  try {
    const [
      projectCount,
      skillCount,
      experienceCount,
      certificationCount,
      educationCount,
      messageCount,
      unreadCount,
      profile,
    ] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Certification.countDocuments(),
      Education.countDocuments(),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: 'unread' }),
      Profile.getSingleton(),
    ]);

    const recentMessages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: {
        counts: {
          projects: projectCount,
          skills: skillCount,
          experience: experienceCount,
          certifications: certificationCount,
          education: educationCount,
          messages: messageCount,
          unreadMessages: unreadCount,
        },
        resume: {
          fileName: profile.resumeFileName,
          updatedAt: profile.resumeUpdatedAt,
          fileSize: profile.resumeFileSize,
        },
        photo: {
          url: profile.photoUrl,
          updatedAt: profile.photoUpdatedAt,
        },
        profileComplete: Boolean(
          profile.name && profile.title && profile.summary && profile.email
        ),
        recentMessages,
      },
    });
  } catch (err) {
    next(err);
  }
};
