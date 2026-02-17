
import { StaffTask, User, Organization, Brand } from './types';

export const ORGS: Organization[] = [
  { 
    id: 'org-cloudcrave', 
    name: 'CloudCrave Solutions', 
    slug: 'cloudcrave', 
    createdAt: '2024-11-20T00:00:00Z',
    tenantId: 'tenant-cc-001'
  }
];

export const BRANDS: Brand[] = [
  { 
    id: 'b-cloudcrave', 
    orgId: 'org-cloudcrave', 
    name: 'CloudCrave', 
    services: ['Social Media Management', 'General Operations'],
    leadId: 'u-ademuyiwa'
  },
  { 
    id: 'b-homeetal', 
    orgId: 'org-cloudcrave', 
    name: 'HomeEtal x Microdia', 
    services: ['Social Media Management', 'Digital Solutions'],
    leadId: 'u-ademuyiwa'
  },
  { 
    id: 'b-switch2tech', 
    orgId: 'org-cloudcrave', 
    name: 'Switch2Tech', 
    services: ['Switch2Tech Training', 'Digital Solutions'],
    leadId: 'u-ademuyiwa'
  },
  { 
    id: 'b-kingzy', 
    orgId: 'org-cloudcrave', 
    name: 'Kingzy', 
    services: ['Digital Solutions'],
    leadId: 'u-sheriff'
  },
  { 
    id: 'b-heritage', 
    orgId: 'org-cloudcrave', 
    name: 'Heritage Plate', 
    services: ['Digital Solutions'],
    leadId: 'u-sheriff'
  },
  { 
    id: 'b-sheedah', 
    orgId: 'org-cloudcrave', 
    name: 'Sheedah Fabrics', 
    services: ['Social Media Management'],
    leadId: 'u-adeola'
  },
  { 
    id: 'b-social-shield', 
    orgId: 'org-cloudcrave', 
    name: 'Social Shield', 
    services: ['Social Media Management'],
    leadId: 'u-adeola'
  },
  { 
    id: 'b-healthy-mind', 
    orgId: 'org-cloudcrave', 
    name: 'Healthy Mind', 
    services: ['Social Media Management', 'Digital Solutions'],
    leadId: 'u-healthymind-member'
  }
];

export const USERS: User[] = [
  { 
    id: 'u-root', 
    orgId: 'org-cloudcrave', 
    name: 'Platform Support', 
    email: 'support@cloudcraves.com', 
    role: 'Admin', 
    registrationStatus: 'approved' 
  },
  // Staff Leads
  { 
    id: 'u-ademuyiwa', 
    orgId: 'org-cloudcrave', 
    name: 'Ademuyiwa', 
    email: 'ademuyiwa.ogunnowo@cloudcraves.com', 
    role: 'Staff Lead', 
    registrationStatus: 'approved' 
  },
  { 
    id: 'u-adeola', 
    orgId: 'org-cloudcrave', 
    name: 'Adeola Lois', 
    email: 'adeola.lois@cloudcraves.com', 
    role: 'Staff Lead', 
    registrationStatus: 'approved' 
  },
  { 
    id: 'u-sheriff', 
    orgId: 'org-cloudcrave', 
    name: 'Sheriff Saka', 
    email: 'sheriff.saka@cloudcraves.com', 
    role: 'Staff Lead', 
    registrationStatus: 'approved' 
  },
  // Members
  { 
    id: 'u-blessing', 
    orgId: 'org-cloudcrave', 
    name: 'Blessing Bassey', 
    email: 'blessing.bassey@cloudcraves.com', 
    role: 'Staff Member', 
    registrationStatus: 'approved'
  },
  { 
    id: 'u-faramade', 
    orgId: 'org-cloudcrave', 
    name: 'Esther Afolayan', 
    email: 'afolayan.esther@cloudcraves.com', 
    role: 'Staff Member', 
    registrationStatus: 'approved'
  },
  { 
    id: 'u-adesewa', 
    orgId: 'org-cloudcrave', 
    name: 'Adesewa Alago', 
    email: 'alago.adeshewa@cloudcraves.com', 
    role: 'Staff Member', 
    registrationStatus: 'approved'
  },
  { 
    id: 'u-kingzy', 
    orgId: 'org-cloudcrave', 
    name: 'Kingzy', 
    email: 'kingzy@cloudcraves.com', 
    role: 'Staff Member', 
    registrationStatus: 'approved'
  },
  { 
    id: 'u-healthymind-member', 
    orgId: 'org-cloudcrave', 
    name: 'Healthy Mind Member', 
    email: 'healthymind@cloudcraves.com', 
    role: 'Staff Member', 
    registrationStatus: 'approved'
  },
  // Mentees
  { 
    id: 'u-aj', 
    orgId: 'org-cloudcrave', 
    name: 'AJ', 
    email: 'aj@gmail.com', 
    role: 'Mentee', 
    registrationStatus: 'approved' 
  }
];

export const MOCK_TASKS: StaffTask[] = [
  // --- CLOUDCRAVE INTERNAL SMM ---
  {
    id: 't-cc-adem-1',
    orgId: 'org-cloudcrave',
    brandId: 'b-cloudcrave',
    serviceType: 'Social Media Management',
    staffName: 'Ademuyiwa',
    assignedBy: 'Platform Support',
    taskTitle: 'CloudCrave Brand Awareness',
    taskDescription: 'Execute primary social media strategy for CloudCrave ecosystem. Focus on LinkedIn and professional networking posts.',
    category: 'Content Optimisation',
    type: 'Recurring',
    frequency: 'Daily',
    status: 'In Progress',
    dueDate: '2024-12-30',
    progressUpdate: 'Consistent daily updates logged.',
    estimatedHours: 10,
    hoursSpent: 4,
    comments: [],
    reportingPeriod: 'Nov 2024'
  },
  {
    id: 't-cc-aj-1',
    orgId: 'org-cloudcrave',
    brandId: 'b-cloudcrave',
    serviceType: 'Social Media Management',
    staffName: 'AJ',
    assignedBy: 'Ademuyiwa',
    taskTitle: 'CloudCrave Engagement Coordination',
    taskDescription: 'Coordinating response strategy and engagement for CloudCrave social channels.',
    category: 'Engagement Optimisation',
    type: 'Recurring',
    frequency: 'Daily',
    status: 'In Progress',
    dueDate: '2024-12-30',
    progressUpdate: '',
    estimatedHours: 8,
    hoursSpent: 2,
    comments: [],
    reportingPeriod: 'Nov 2024'
  },

  // --- HOMEETAL X MICRODIA ---
  {
    id: 't-hm-adem-1',
    orgId: 'org-cloudcrave',
    brandId: 'b-homeetal',
    serviceType: 'Social Media Management',
    staffName: 'Ademuyiwa',
    assignedBy: 'Platform Support',
    taskTitle: 'HomeEtal x Microdia SMM Execution',
    taskDescription: 'Full social media lifecycle management for the HomeEtal collaboration.',
    category: 'Content Optimisation',
    type: 'Recurring',
    frequency: 'Weekly',
    status: 'In Progress',
    dueDate: '2024-12-15',
    progressUpdate: 'Campaign assets approved.',
    estimatedHours: 12,
    hoursSpent: 3,
    comments: [],
    reportingPeriod: 'Nov 2024'
  },
  {
    id: 't-hm-aj-1',
    orgId: 'org-cloudcrave',
    brandId: 'b-homeetal',
    serviceType: 'Social Media Management',
    staffName: 'AJ',
    assignedBy: 'Ademuyiwa',
    taskTitle: 'HomeEtal Engagement Watch',
    taskDescription: 'Monitoring community feedback and coordinating lead generation for HomeEtal.',
    category: 'Engagement Optimisation',
    type: 'Recurring',
    frequency: 'Daily',
    status: 'In Progress',
    dueDate: '2024-12-15',
    progressUpdate: '',
    estimatedHours: 10,
    hoursSpent: 2,
    comments: [],
    reportingPeriod: 'Nov 2024'
  },
  {
    id: 't-hm-faram-1',
    orgId: 'org-cloudcrave',
    brandId: 'b-homeetal',
    serviceType: 'Social Media Management',
    staffName: 'Esther Afolayan',
    assignedBy: 'Ademuyiwa',
    taskTitle: 'Visual Asset Curation',
    taskDescription: 'Curation and design support for HomeEtal social assets.',
    category: 'Asset Management',
    type: 'Recurring',
    frequency: 'Weekly',
    status: 'In Progress',
    dueDate: '2024-12-10',
    progressUpdate: '',
    estimatedHours: 6,
    hoursSpent: 1,
    comments: [],
    reportingPeriod: 'Nov 2024'
  },

  // --- SWITCH2TECH TRAINING PROTOCOLS ---
  {
    id: 't-s2t-adem-1',
    orgId: 'org-cloudcrave',
    brandId: 'b-switch2tech',
    serviceType: 'Switch2Tech Training',
    staffName: 'Ademuyiwa',
    assignedBy: 'Platform Support',
    taskTitle: 'Training Coordination & Canva Instruction',
    taskDescription: 'Overall coordination of instructor courses, schedule management, and teaching primary Canva design modules.',
    category: 'Strategic Planning',
    type: 'Recurring',
    frequency: 'Weekly',
    status: 'In Progress',
    dueDate: '2024-12-15',
    progressUpdate: 'Schedule finalized for next cohort.',
    estimatedHours: 25,
    hoursSpent: 5,
    comments: [],
    reportingPeriod: 'Nov 2024'
  },
  {
    id: 't-s2t-adeola-1',
    orgId: 'org-cloudcrave',
    brandId: 'b-switch2tech',
    serviceType: 'Switch2Tech Training',
    staffName: 'Adeola Lois',
    assignedBy: 'Ademuyiwa',
    taskTitle: 'SMM Class Instruction',
    taskDescription: 'Planning and delivering Social Media Management training sessions for students.',
    category: 'Internal Protocol',
    type: 'Recurring',
    frequency: 'Weekly',
    status: 'In Progress',
    dueDate: '2024-12-05',
    progressUpdate: '',
    estimatedHours: 12,
    hoursSpent: 2,
    comments: [],
    reportingPeriod: 'Nov 2024'
  },
  {
    id: 't-s2t-blessing-1',
    orgId: 'org-cloudcrave',
    brandId: 'b-switch2tech',
    serviceType: 'Switch2Tech Training',
    staffName: 'Blessing Bassey',
    assignedBy: 'Ademuyiwa',
    taskTitle: 'Video Editing Instruction',
    taskDescription: 'Developing curriculum and leading practical Video Editing sessions for students.',
    category: 'Internal Protocol',
    type: 'Recurring',
    frequency: 'Weekly',
    status: 'In Progress',
    dueDate: '2024-12-05',
    progressUpdate: '',
    estimatedHours: 12,
    hoursSpent: 3,
    comments: [],
    reportingPeriod: 'Nov 2024'
  },
  {
    id: 't-s2t-sheriff-1',
    orgId: 'org-cloudcrave',
    brandId: 'b-switch2tech',
    serviceType: 'Switch2Tech Training',
    staffName: 'Sheriff Saka',
    assignedBy: 'Ademuyiwa',
    taskTitle: 'Web Development Instruction',
    taskDescription: 'Teaching full-stack web development principles and guiding student projects.',
    category: 'Internal Protocol',
    type: 'Recurring',
    frequency: 'Weekly',
    status: 'In Progress',
    dueDate: '2024-12-05',
    progressUpdate: '',
    estimatedHours: 15,
    hoursSpent: 4,
    comments: [],
    reportingPeriod: 'Nov 2024'
  },
  {
    id: 't-s2t-aj-1',
    orgId: 'org-cloudcrave',
    brandId: 'b-switch2tech',
    serviceType: 'Switch2Tech Training',
    staffName: 'AJ',
    assignedBy: 'Ademuyiwa',
    taskTitle: 'WhatsApp Community & Engagement',
    taskDescription: 'Active moderation of the training WhatsApp groups and fostering student engagement.',
    category: 'Engagement Optimisation',
    type: 'Recurring',
    frequency: 'Daily',
    status: 'In Progress',
    dueDate: '2024-12-30',
    progressUpdate: 'Engagement levels high.',
    estimatedHours: 20,
    hoursSpent: 6,
    comments: [],
    reportingPeriod: 'Nov 2024'
  },
  {
    id: 't-s2t-adesewa-1',
    orgId: 'org-cloudcrave',
    brandId: 'b-switch2tech',
    serviceType: 'Switch2Tech Training',
    staffName: 'Adesewa Alago',
    assignedBy: 'Ademuyiwa',
    taskTitle: 'WhatsApp Community & Engagement',
    taskDescription: 'Active moderation of the training WhatsApp groups and fostering student engagement.',
    category: 'Engagement Optimisation',
    type: 'Recurring',
    frequency: 'Daily',
    status: 'In Progress',
    dueDate: '2024-12-30',
    progressUpdate: '',
    estimatedHours: 20,
    hoursSpent: 4,
    comments: [],
    reportingPeriod: 'Nov 2024'
  },

  // --- KINGZY BRAND PROTOCOLS ---
  {
    id: 't-kingzy-lead',
    orgId: 'org-cloudcrave',
    brandId: 'b-kingzy',
    serviceType: 'Digital Solutions',
    staffName: 'Sheriff Saka',
    assignedBy: 'Platform Support',
    taskTitle: 'Kingzy Project Management',
    taskDescription: 'Overseeing Kingzy brand deliverables, assigning sub-tasks, and quality assurance.',
    category: 'Strategic Planning',
    type: 'Recurring',
    frequency: 'Weekly',
    status: 'In Progress',
    dueDate: '2024-12-10',
    progressUpdate: 'Milestones tracked.',
    estimatedHours: 10,
    hoursSpent: 2,
    comments: [],
    reportingPeriod: 'Nov 2024'
  },
  {
    id: 't-kingzy-dev',
    orgId: 'org-cloudcrave',
    brandId: 'b-kingzy',
    serviceType: 'Digital Solutions',
    staffName: 'Kingzy',
    assignedBy: 'Sheriff Saka',
    taskTitle: 'Website Architecture Development',
    taskDescription: 'Primary development of the Kingzy brand web platform and digital ecosystem.',
    category: 'Software Development',
    type: 'One-time',
    frequency: 'N/A',
    status: 'In Progress',
    dueDate: '2024-12-20',
    progressUpdate: 'Frontend framework initiated.',
    estimatedHours: 60,
    hoursSpent: 12,
    comments: [],
    reportingPeriod: 'Nov 2024'
  },

  // --- HERITAGE PLATE PROTOCOLS ---
  {
    id: 't-heritage-1',
    orgId: 'org-cloudcrave',
    brandId: 'b-heritage',
    serviceType: 'Digital Solutions',
    staffName: 'Sheriff Saka',
    assignedBy: 'Platform Support',
    taskTitle: 'Heritage Plate Initial Setup',
    taskDescription: 'Provisioning digital solutions and setting up the initial brand infrastructure.',
    category: 'Cloud Infrastructure',
    type: 'One-time',
    frequency: 'N/A',
    status: 'Not Started',
    dueDate: '2024-12-05',
    progressUpdate: '',
    estimatedHours: 15,
    hoursSpent: 0,
    comments: [],
    reportingPeriod: 'Nov 2024'
  },

  // --- SHEEDAH FABRICS ---
  {
    id: 't-sheedah-1',
    orgId: 'org-cloudcrave',
    brandId: 'b-sheedah',
    serviceType: 'Social Media Management',
    staffName: 'Adesewa Alago',
    assignedBy: 'Adeola Lois',
    taskTitle: 'Sheedah Fabrics Content Calendar',
    taskDescription: 'Weekly posting schedule for Fabrics line - focusing on Instagram reels and high-quality static images.',
    category: 'Content Optimisation',
    type: 'Recurring',
    frequency: 'Weekly',
    status: 'In Progress',
    dueDate: '2024-11-28',
    progressUpdate: 'Content for Mon-Wed ready.',
    estimatedHours: 15,
    hoursSpent: 6,
    comments: [],
    reportingPeriod: 'Nov 2024'
  },
  {
    id: 't-sheedah-faramade-1',
    orgId: 'org-cloudcrave',
    brandId: 'b-sheedah',
    serviceType: 'Social Media Management',
    staffName: 'Esther Afolayan',
    assignedBy: 'Adeola Lois',
    taskTitle: 'Fabric Aesthetic Curation',
    taskDescription: 'Curating the visual moodboard and aesthetic themes for Sheedah Fabrics.',
    category: 'Asset Management',
    type: 'One-time',
    frequency: 'N/A',
    status: 'In Progress',
    dueDate: '2024-12-10',
    progressUpdate: '',
    estimatedHours: 8,
    hoursSpent: 2,
    comments: [],
    reportingPeriod: 'Nov 2024'
  }
];
