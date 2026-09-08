/**
 * Initial portfolio content — sourced 100% from
 * Soumik_Adhikary_MERN_Stack_Resume.pdf. Nothing here is invented.
 * Fields the resume does not provide are left as empty strings and are
 * clearly marked as placeholders in the Admin Panel.
 */

const profile = {
  name: 'Soumik Adhikary',
  title: 'Full Stack MERN Developer',
  tagline:
    'Building scalable, secure and data-driven web applications with the MERN stack.',
  summary:
    'Full Stack MERN Developer with over 2 years of software development experience building scalable, secure and data-driven web applications. Proficient in JavaScript (ES6+), React.js, Node.js, Express.js, MongoDB, Mongoose and MySQL. Experienced in RESTful API development, JWT Authentication, Role-Based Access Control (RBAC), Stripe Payment Gateway integration, CRUD operations, responsive UI development and production deployment using Vercel, Render and MongoDB Atlas.',
  email: 'adhikarysoumik97@gmail.com',
  phone: '+91 8910525607',
  location: 'Tarakeswar, West Bengal, India',
  github: 'https://github.com/soumik7076335323',
  linkedin: 'https://www.linkedin.com/in/soumik-adhikary-5a4742192',
  website: '',
};

const skills = [
  // Frontend
  { name: 'React.js', category: 'Frontend', order: 0 },
  { name: 'React Hooks', category: 'Frontend', order: 1 },
  { name: 'React Router DOM', category: 'Frontend', order: 2 },
  { name: 'Context API', category: 'Frontend', order: 3 },
  { name: 'HTML5', category: 'Frontend', order: 4 },
  { name: 'CSS3', category: 'Frontend', order: 5 },
  { name: 'Axios', category: 'Frontend', order: 6 },
  { name: 'Responsive Web Design', category: 'Frontend', order: 7 },
  // Backend
  { name: 'Node.js', category: 'Backend', order: 0 },
  { name: 'Express.js', category: 'Backend', order: 1 },
  { name: 'RESTful APIs', category: 'Backend', order: 2 },
  { name: 'CRUD Operations', category: 'Backend', order: 3 },
  { name: 'API Integration', category: 'Backend', order: 4 },
  { name: 'JavaScript (ES6+)', category: 'Backend', order: 5 },
  { name: 'Asynchronous Programming', category: 'Backend', order: 6 },
  // Database
  { name: 'MongoDB', category: 'Database', order: 0 },
  { name: 'Mongoose', category: 'Database', order: 1 },
  { name: 'MongoDB Atlas', category: 'Database', order: 2 },
  { name: 'MySQL', category: 'Database', order: 3 },
  // Authentication & Security
  { name: 'JWT Authentication', category: 'Authentication & Security', order: 0 },
  { name: 'Bcrypt', category: 'Authentication & Security', order: 1 },
  { name: 'Role-Based Access Control (RBAC)', category: 'Authentication & Security', order: 2 },
  { name: 'Protected Routes', category: 'Authentication & Security', order: 3 },
  // Payment & Uploads
  { name: 'Stripe API', category: 'Payment & Uploads', order: 0 },
  { name: 'Stripe Checkout', category: 'Payment & Uploads', order: 1 },
  { name: 'Multer', category: 'Payment & Uploads', order: 2 },
  // Developer Tools
  { name: 'Git', category: 'Developer Tools', order: 0 },
  { name: 'GitHub', category: 'Developer Tools', order: 1 },
  { name: 'Postman', category: 'Developer Tools', order: 2 },
  { name: 'VS Code', category: 'Developer Tools', order: 3 },
  { name: 'MongoDB Compass', category: 'Developer Tools', order: 4 },
  { name: 'MySQL Workbench', category: 'Developer Tools', order: 5 },
  // Deployment
  { name: 'Vercel', category: 'Deployment', order: 0 },
  { name: 'Render', category: 'Deployment', order: 1 },
  { name: 'MongoDB Atlas', category: 'Deployment', order: 2 },
];

const experience = [
  {
    company: 'Self-employed',
    position: 'Freelance Full Stack Developer',
    employmentType: 'Freelance',
    startDate: '02/2024',
    endDate: 'Present',
    order: 0,
    description: [
      'Delivered end-to-end MERN applications across 4 core technologies: React.js, Node.js, Express.js and MongoDB, with Mongoose for data modeling.',
      'Engineered RESTful APIs with 4 security controls: JWT authentication, Bcrypt credential hashing, route authorization and Role-Based Access Control (RBAC).',
      'Coordinated customer and admin workflows by integrating responsive React interfaces with CRUD operations, REST APIs and database-driven functionality.',
      'Deployed MERN applications across 3 production services — Vercel, Render and MongoDB Atlas — while owning MongoDB/Mongoose data modeling and production delivery.',
    ],
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'RBAC', 'Vercel', 'Render'],
  },
  {
    company: 'DHI.AI Private Limited',
    position: 'Software Developer',
    employmentType: 'Full-time',
    startDate: '10/2023',
    endDate: '02/2024',
    order: 1,
    description: [
      'Analyzed and maintained JavaScript/MySQL applications, troubleshooting SQL queries, joins and schema issues while supporting testing and feature delivery.',
      'Partnered with developers to diagnose application defects, validate fixes through testing and improve reliability of existing web features.',
    ],
    technologies: ['JavaScript', 'MySQL'],
  },
  {
    company: 'Interra Information Technologies',
    position: 'Software Developer',
    employmentType: 'Full-time',
    startDate: '08/2022',
    endDate: '10/2023',
    order: 2,
    description: [
      'Owned backend development across 4 core technologies — JavaScript, Node.js, Express.js and MongoDB — for an Online Shopping platform.',
      'Created RESTful backend workflows for 3 key commerce areas: user authentication, cart persistence and catalog management, alongside database debugging and API optimization.',
    ],
    technologies: ['JavaScript', 'Node.js', 'Express.js', 'MongoDB'],
  },
];

const projects = [
  {
    name: 'FoodyGo',
    shortDescription:
      'Full Stack MERN food delivery platform with a customer storefront, admin panel and a shared Node.js/Express REST API.',
    detailedDescription:
      'FoodyGo is a complete food delivery web application built on the MERN stack. It ships two React applications — a customer storefront and an admin panel — backed by a shared Node.js/Express API. Two application roles (customer and admin) are secured through JWT sessions, password encryption and role-specific access controls. Eight core food-delivery workflows are implemented: search, category filtering, persistent cart, image upload, checkout, order history, order management and status updates. Stripe Checkout is integrated with payment verification, and the solution is released across three deployment services: Vercel, Render and MongoDB Atlas.',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'RBAC', 'Stripe', 'Multer'],
    features: [
      'Customer app + admin panel (2 React applications)',
      'JWT authentication with password encryption (customer & admin roles)',
      'Role-based access control',
      'Food search & category filtering',
      'Persistent cart',
      'Image upload',
      'Checkout with Stripe & payment verification',
      'Order history, order management & status updates',
      'Deployed on Vercel, Render & MongoDB Atlas',
    ],
    links: {
      live: 'https://soumik-foodygo.vercel.app/',
      admin: 'https://food-delivery-soumik7.vercel.app/',
      github: 'https://github.com/soumik7076335323/food-delivery',
      backend: 'https://soumik-food.onrender.com/',
    },
    featured: true,
    order: 0,
    imageUrl: '',
    imagePublicId: '',
  },
  {
    name: 'Online Shopping Application',
    shortDescription:
      'E-commerce backend driving registration, persistent shopping carts and product administration through modular REST APIs.',
    detailedDescription:
      'An online shopping application covering core e-commerce workflows: user registration, persistent shopping carts and product administration, implemented through modular REST APIs on Node.js, Express and MongoDB.',
    techStack: ['JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'RESTful APIs'],
    features: [
      'User registration',
      'Persistent shopping carts',
      'Product administration',
      'Modular REST APIs',
    ],
    links: { live: '', github: '', admin: '', backend: '' },
    featured: false,
    order: 1,
    imageUrl: '',
    imagePublicId: '',
  },
];

const education = [
  {
    degree: 'Bachelor of Engineering (Information Technology)',
    field: 'Information Technology',
    institution: 'Jadavpur University',
    cgpa: '6.57',
    startYear: '2016',
    endYear: '2020',
    description: '',
    order: 0,
  },
];

const certifications = [
  { name: 'HTML Certification', issuer: '', year: '', url: '', order: 0 },
  { name: 'JavaScript Certification', issuer: '', year: '', url: '', order: 1 },
  { name: 'MySQL Certification', issuer: '', year: '', url: '', order: 2 },
  { name: 'Node.js Certification', issuer: '', year: '', url: '', order: 3 },
];

module.exports = { profile, skills, experience, projects, education, certifications };
