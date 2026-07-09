import project1 from '../assets/holdata.png';
import project2 from '../assets/fylo.png';
import project3 from '../assets/surveybuilder.png';
import project5_1 from '../assets/golf.png';
import react1 from '../assets/seva.png';
import react2 from '../assets/aba.png';

const WorkCardData = [
  {
    imgsrc: project5_1,
    title: "Golf",
    description: "Full-stack ownership of a golf management platform including a React admin dashboard and kiosk application. Built reservation and booking workflows, integrated hardware communication APIs, implemented JWT authentication with role-based access, and enhanced payment processing with Stripe. Deployed Twilio OTP verification, SendGrid email onboarding, and PDF receipt generation. Optimized MSSQL database queries with Sequelize and managed Azure CI/CD deployments. Resolved production issues including token refresh failures, payment handling bugs, and email delivery troubleshooting.",
    tags: ["React", "Node.js", "Azure", "MSSQL", "Sequelize"],
    featured: true
  },
  {
    imgsrc: project2,
    title: "Fylo",
    description: "AI-assisted workflow visualization platform featuring real-time collaboration via Socket.IO and complex graph rendering with React Flow. Built an event-driven architecture for live updates and optimized rendering performance for large, interactive graphs. Modern React development with reusable component patterns and responsive layouts.",
    tags: ["React", "Node.js", "Socket.IO", "Supabase", "React Flow"],
    featured: true
  },
  {
    imgsrc: project1,
    title: "HolaData",
    description: "Broadband management platform built with Next.js featuring Google Maps integration for service area visualization, invoice generation workflows, and enhanced authentication flows. Used React Query for efficient server state management and data fetching patterns.",
    tags: ["Next.js", "React Query", "Google Maps"],
    featured: true
  },
  {
    imgsrc: project3,
    title: "Survey Builder",
    description: "Dynamic survey creation platform with Angular and TypeScript on the frontend and a Node.js/MongoDB backend. Implemented a flexible form builder with drag-and-drop question types, survey logic, response analytics, and comprehensive data export capabilities.",
    tags: ["Angular", "TypeScript", "Node.js", "MongoDB", "AWS", "SQS", "Lambda"],
    featured: false
  },
  {
    imgsrc: react1,
    title: "Seva",
    description: "Mental health counselling platform for program and appointment management. Built backend APIs with Node.js and MongoDB for counsellor scheduling, booking workflows, dynamic questionnaire management, and secure handling of user information. Developed an admin portal for managing practitioners and sessions.",
    tags: ["Node.js", "MongoDB", "AWS"],
    featured: false
  },
  {
    imgsrc: react2,
    title: "ABA Vehicle Platform",
    description: "Vehicle autobiography platform built with Node.js and MongoDB on AWS. Designed backend APIs for vehicle profiles, media management, and social interaction features. Architected MongoDB schemas for efficient data retrieval and set up AWS deployment pipelines for production hosting.",
    tags: ["Node.js", "MongoDB", "AWS"],
    featured: false
  }
];

export default WorkCardData;
