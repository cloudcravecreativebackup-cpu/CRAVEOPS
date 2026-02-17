
import React, { useState, useCallback, useEffect, useMemo } from 'react';
// Added TaskStatus to the imports
import { StaffTask, ManagementSummary, User, TaskComment, Notification, Organization, Brand, ServiceType, TaskCategory, Frequency, TaskType, TaskStatus, ContentCalendar, CalendarEntry } from './types';
import { MOCK_TASKS, USERS, ORGS, BRANDS } from './constants';
import { analyzeTasks } from './services/geminiService';
import Dashboard from './components/Dashboard';
import TaskEntryForm from './components/TaskEntryForm';
import TaskBoard from './components/TaskBoard';
import Auth from './components/Auth';
import AdminUserManagement from './components/AdminUserManagement';
import BrandManagement from './components/BrandManagement';
import BrandDetailView from './components/BrandDetailView';
import Logo from './components/Logo';
import NotificationsPanel from './components/NotificationsPanel';
import MentorshipHub from './components/MentorshipHub';
import PersonnelProtocolView from './components/PersonnelProtocolView';
import ContentCalendarView from './components/ContentCalendarView';

type AppView = 'board' | 'analysis' | 'users' | 'squad' | 'personnel-detail' | 'brands' | 'brand-detail' | 'calendar';

const STORAGE_KEY_ORGS = 'craveops_cloudcraves_orgs_v1';
const STORAGE_KEY_USERS = 'craveops_cloudcraves_users_v1';
const STORAGE_KEY_BRANDS = 'craveops_cloudcraves_brands_v1';
const STORAGE_KEY_USER = 'craveops_cloudcraves_current_v1';
const STORAGE_KEY_TASKS = 'craveops_cloudcraves_tasks_v1';
const STORAGE_KEY_CALENDARS = 'craveops_cloudcraves_calendars_v1';
const STORAGE_KEY_NOTIFS = 'craveops_cloudcraves_notifs_v1';

const WHITELISTED_ADMINS = [
  'support@cloudcraves.com', 
  'support@craveops.com', 
  'adeola.lois@cloudcraves.com', 
  'sheriff.saka@cloudcraves.com',
  'ademuyiwa.ogunnowo@cloudcraves.com'
];

const SERVICE_TEMPLATES: Record<ServiceType, { taskTitle: string, category: TaskCategory, type: TaskType, frequency: Frequency }[]> = {
  'Social Media Management': [
    { taskTitle: 'Initial Profile Audit', category: 'Profile Optimisation', type: 'One-time', frequency: 'N/A' },
    { taskTitle: 'Weekly Content Planning', category: 'Content Optimisation', type: 'Recurring', frequency: 'Weekly' },
    { taskTitle: 'Daily Engagement Monitor', category: 'Engagement Optimisation', type: 'Recurring', frequency: 'Daily' }
  ],
  'Cloud Support': [
    { taskTitle: 'Security Patch Audit', category: 'Cloud Infrastructure', type: 'Recurring', frequency: 'Monthly' },
    { taskTitle: 'Resource Optimization Check', category: 'Cloud Infrastructure', type: 'Recurring', frequency: 'Weekly' }
  ],
  'Digital Solutions': [
    { taskTitle: 'Frontend Component Audit', category: 'Software Development', type: 'One-time', frequency: 'N/A' },
    { taskTitle: 'Sprint Backlog Review', category: 'Software Development', type: 'Recurring', frequency: 'Weekly' }
  ],
  'General Operations': [
    { taskTitle: 'Standard Operating Procedure Review', category: 'Internal Protocol', type: 'Recurring', frequency: 'Monthly' }
  ],
  'Switch2Tech Training': [
    { taskTitle: 'Curriculum Review', category: 'Strategic Planning', type: 'Recurring', frequency: 'Monthly' },
    { taskTitle: 'Instructor Onboarding', category: 'Internal Protocol', type: 'One-time', frequency: 'N/A' },
    { taskTitle: 'Class Schedule Management', category: 'Internal Protocol', type: 'Recurring', frequency: 'Weekly' }
  ]
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [showRegSuccess, setShowRegSuccess] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ORGS);
    return saved ? JSON.parse(saved) : ORGS;
  });

  const [brands, setBrands] = useState<Brand[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BRANDS);
    return saved ? JSON.parse(saved) : BRANDS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    return saved ? JSON.parse(saved) : USERS;
  });

  const [calendars, setCalendars] = useState<ContentCalendar[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CALENDARS);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    return saved ? JSON.parse(saved) : null;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser);
  
  const [tasks, setTasks] = useState<StaffTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TASKS);
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });

  const [view, setView] = useState<AppView>('board');
  const [selectedPersonnelId, setSelectedPersonnelId] = useState<string | null>(null);
  const [selectedBrandDetailId, setSelectedBrandDetailId] = useState<string | null>(null);
  const [summary, setSummary] = useState<ManagementSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<StaffTask | null>(null);
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);

  const currentOrg = useMemo(() => 
    organizations.find(o => o.id === currentUser?.orgId), 
    [organizations, currentUser?.orgId]
  );

  const tenantUsers = useMemo(() => 
    users.filter(u => u.orgId === currentUser?.orgId),
    [users, currentUser?.orgId]
  );

  const visibleUsers = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'Admin') return users.filter(u => u.orgId === currentUser.orgId);
    if (currentUser.role === 'Staff Lead') {
      return users.filter(u => 
        u.orgId === currentUser.orgId && 
        (u.id === currentUser.id || u.mentorId === currentUser.id || !u.mentorId)
      );
    }
    return users.filter(u => u.id === currentUser.id);
  }, [users, currentUser]);

  const visibleBrands = useMemo(() => {
    if (!currentUser) return [];
    const orgBrands = brands.filter(b => b.orgId === currentUser.orgId);
    if (currentUser.role === 'Admin') return orgBrands;
    if (currentUser.role === 'Staff Lead') return orgBrands.filter(b => b.leadId === currentUser.id);
    const brandIds = new Set(tasks.filter(t => t.staffName === currentUser.name).map(t => t.brandId));
    return orgBrands.filter(b => brandIds.has(b.id));
  }, [brands, currentUser, tasks]);

  const tenantBrands = visibleBrands;

  const tenantTasks = useMemo(() => 
    tasks.filter(t => t.orgId === currentUser?.orgId),
    [tasks, currentUser?.orgId]
  );

  const visibleTasks = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'Admin') return tenantTasks;
    if (currentUser.role === 'Staff Lead') {
      const myTeamNames = new Set(tenantUsers.filter(u => u.mentorId === currentUser.id || u.id === currentUser.id).map(u => u.name));
      return tenantTasks.filter(t => myTeamNames.has(t.staffName));
    }
    return tenantTasks.filter(t => t.staffName === currentUser.name);
  }, [tenantTasks, currentUser, tenantUsers]);

  const tenantCalendars = useMemo(() => {
    if (!currentUser) return [];
    const orgCals = calendars.filter(c => c.orgId === currentUser.orgId);
    if (currentUser.role === 'Admin') return orgCals;
    const brandIds = new Set(visibleBrands.map(b => b.id));
    return orgCals.filter(c => brandIds.has(c.brandId));
  }, [calendars, currentUser, visibleBrands]);

  const tenantNotifications = useMemo(() => 
    notifications.filter(n => n.orgId === currentUser?.orgId && n.userId === currentUser?.id),
    [notifications, currentUser?.orgId, currentUser?.id]
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORGS, JSON.stringify(organizations));
    localStorage.setItem(STORAGE_KEY_BRANDS, JSON.stringify(brands));
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    localStorage.setItem(STORAGE_KEY_CALENDARS, JSON.stringify(calendars));
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
  }, [organizations, brands, tasks, calendars, users, notifications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  const createNotification = (userId: string, type: Notification['type'], message: string, relatedTaskId?: string, relatedUserId?: string) => {
    if (!currentUser) return;
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      orgId: currentUser.orgId,
      userId,
      type,
      message,
      read: false,
      timestamp: new Date().toISOString(),
      relatedTaskId,
      relatedUserId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const notifyAdmins = (type: Notification['type'], message: string, relatedTaskId?: string, relatedUserId?: string) => {
    tenantUsers.filter(u => u.role === 'Admin' || u.role === 'Staff Lead').forEach(admin => {
      if (admin.id !== currentUser?.id) {
        createNotification(admin.id, type, message, relatedTaskId, relatedUserId);
      }
    });
  };

  const navigateTo = (newView: AppView) => {
    setView(newView);
    setIsAddingTask(false);
    setEditingTask(null);
    setShowProfileModal(false);
    setShowNotifs(false);
    if (newView !== 'personnel-detail') setSelectedPersonnelId(null);
    if (newView !== 'brand-detail') setSelectedBrandDetailId(null);
  };

  const handleLogin = (email: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  };

  const handleRegister = (name: string, email: string, companyName?: string) => {
    const emailLower = email.toLowerCase();
    const isWhitelisted = WHITELISTED_ADMINS.includes(emailLower);
    let orgId = '';
    if (companyName) {
      const newOrg: Organization = {
        id: `org-${Math.random().toString(36).substr(2, 9)}`,
        name: companyName,
        slug: companyName.toLowerCase().replace(/\s+/g, '-'),
        createdAt: new Date().toISOString(),
        tenantId: `tenant-${Math.random().toString(36).substr(2, 6)}`
      };
      setOrganizations(prev => [...prev, newOrg]);
      orgId = newOrg.id;
    } else {
      orgId = organizations[0]?.id || 'org-cloudcrave'; 
    }
    const role = isWhitelisted ? 'Staff Lead' : (companyName ? 'Staff Lead' : 'Staff Member');
    const registrationStatus = (isWhitelisted || role === 'Staff Lead') ? 'approved' : 'pending';
    const newUser: User = { id: Math.random().toString(36).substr(2, 9), orgId, name, email, role, registrationStatus };
    setUsers([...users, newUser]);
    
    if (registrationStatus === 'pending') {
      notifyAdmins('warning', `New Access Request: ${name} is waiting for authorization.`, undefined, newUser.id);
      setShowRegSuccess(true);
    } else {
      setCurrentUser(newUser);
      setIsLoggedIn(true);
    }
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;
    
    if (userToDelete.email === 'support@cloudcraves.com') {
      alert("System Root account cannot be deleted.");
      return;
    }

    if (window.confirm(`CRITICAL: Are you sure you want to delete ${userToDelete.name}'s profile? Historical protocol logs and tasks will be preserved for audit reference.`)) {
      setUsers(prev => prev
        .filter(u => u.id !== userId)
        .map(u => u.mentorId === userId ? { ...u, mentorId: undefined } : u)
      );
      notifyAdmins('warning', `Profile Decommissioned: ${userToDelete.name} removed from roster.`);
      if (view === 'personnel-detail' && selectedPersonnelId === userId) {
        navigateTo('users');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setView('board');
    setSelectedPersonnelId(null);
    setShowProfileModal(false);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  const handleAnalyze = useCallback(async () => {
    setLoading(true);
    setSummary(null);
    try {
      const result = await analyzeTasks(visibleTasks);
      setSummary(result);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [visibleTasks]);

  const handleAddComment = useCallback((taskId: string, commentText: string) => {
    if (!currentUser) return;
    const task = tenantTasks.find(t => t.id === taskId);
    if (!task) return;
    const newComment: TaskComment = {
      id: Math.random().toString(36).substr(2, 9),
      authorName: currentUser.name,
      authorRole: currentUser.role,
      text: commentText,
      timestamp: new Date().toISOString()
    };
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, comments: [...t.comments, newComment] } : t));
    
    const taskOwner = tenantUsers.find(u => u.name === task.staffName);
    if (taskOwner && taskOwner.id !== currentUser.id) {
      createNotification(taskOwner.id, 'info', `${currentUser.name} logged a comment on your task: "${task.taskTitle}"`, taskId);
    }

    tenantUsers.forEach(u => {
      if (commentText.includes(`@${u.name}`) && u.id !== currentUser.id) {
        createNotification(u.id, 'success', `${currentUser.name} mentioned you in a log for "${task.taskTitle}"`, taskId);
      }
    });

    notifyAdmins('info', `Log Update: ${currentUser.name} on "${task.taskTitle}"`, taskId);
  }, [currentUser, tenantTasks, tenantUsers]);

  const handleTaskSubmit = (taskData: Partial<StaffTask>) => {
    if (!currentUser) return;
    
    let targetStatus = taskData.status || 'Not Started';
    const isAdmin = currentUser.role === 'Admin';
    const isCompletedAttempt = targetStatus === 'Completed';

    // INTERCEPT: If a non-admin sets a task to Completed, force it to 'Pending Approval'
    if (isCompletedAttempt && !isAdmin) {
      targetStatus = 'Pending Approval';
    }

    if (editingTask) {
      const wasPending = editingTask.status === 'Pending Approval';
      const isNowPending = targetStatus === 'Pending Approval';
      const isBlocked = targetStatus === 'Blocked';

      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskData, status: targetStatus } as StaffTask : t));
      
      if (!wasPending && isNowPending) {
        notifyAdmins('warning', `Review Required: ${editingTask.staffName} marked "${editingTask.taskTitle}" as ready for completion.`, editingTask.id);
      }
      
      if (isBlocked) {
        notifyAdmins('alert', `Blocker Alert: ${editingTask.taskTitle} is blocked by ${editingTask.staffName}`, editingTask.id);
      }

      setEditingTask(null);
    } else {
      const newTask: StaffTask = {
        id: Math.random().toString(36).substr(2, 9),
        orgId: currentUser.orgId,
        brandId: taskData.brandId || '',
        serviceType: taskData.serviceType || 'General Operations',
        staffName: taskData.staffName || currentUser.name,
        assignedBy: taskData.assignedBy || currentUser.name,
        taskTitle: taskData.taskTitle || 'Untitled Task',
        taskDescription: taskData.taskDescription || '',
        category: taskData.category || 'Internal Protocol',
        type: taskData.type || 'One-time',
        frequency: taskData.frequency || 'N/A',
        status: targetStatus,
        dueDate: taskData.dueDate || '',
        progressUpdate: '',
        estimatedHours: taskData.estimatedHours || 0,
        hoursSpent: taskData.hoursSpent || 0,
        comments: [],
        reportingPeriod: 'Nov 2024'
      };
      setTasks([newTask, ...tasks]);
      setIsAddingTask(false);

      const assignedUser = tenantUsers.find(u => u.name === newTask.staffName);
      if (assignedUser && assignedUser.id !== currentUser.id) {
        createNotification(assignedUser.id, 'success', `New Protocol Assigned: "${newTask.taskTitle}" by ${currentUser.name}`, newTask.id);
      }

      notifyAdmins('info', `New task provisioned for ${newTask.staffName}: ${newTask.taskTitle}`, newTask.id);
    }
  };

  const handleReviewTask = useCallback((taskId: string, decision: 'approve' | 'reject' | 'block', comment?: string) => {
    if (!currentUser) return;
    const task = tenantTasks.find(t => t.id === taskId);
    if (!task) return;

    let newStatus: TaskStatus = 'Completed';
    let message = '';

    if (decision === 'approve') {
      newStatus = 'Completed';
      message = `Protocol Validated: Admin approved completion for "${task.taskTitle}"`;
    } else if (decision === 'reject') {
      newStatus = 'In Progress';
      message = `Revision Requested: Admin returned "${task.taskTitle}" to active status.`;
    } else if (decision === 'block') {
      newStatus = 'Blocked';
      message = `Execution Blocked: Admin flagged "${task.taskTitle}" for review.`;
    }

    if (comment) {
      handleAddComment(taskId, `[REVIEW DECISION: ${decision.toUpperCase()}] ${comment}`);
    }

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    
    const taskOwner = tenantUsers.find(u => u.name === task.staffName);
    if (taskOwner) {
      createNotification(taskOwner.id, decision === 'approve' ? 'success' : 'alert', message, taskId);
    }
  }, [currentUser, tenantTasks, tenantUsers, handleAddComment]);

  const handleSaveCalendar = (cal: ContentCalendar) => {
    if (!currentUser) return;
    const existing = calendars.find(c => c.id === cal.id);
    if (existing) {
      setCalendars(prev => prev.map(c => c.id === cal.id ? cal : c));
    } else {
      setCalendars(prev => [...prev, cal]);
    }

    const newTasksFromCal: StaffTask[] = [];
    cal.entries.forEach(entry => {
      const existingTask = tasks.find(t => t.relatedCalendarEntryId === entry.id);
      const assignedUser = tenantUsers.find(u => u.id === entry.assignedToId);
      
      if (existingTask) {
        setTasks(prev => prev.map(t => t.id === existingTask.id ? {
          ...t,
          staffName: assignedUser?.name || t.staffName,
          taskTitle: `Calendar: ${entry.topic}`,
          taskDescription: `Platforms: ${entry.platforms.join(', ')}\nType: ${entry.contentType}\n\nVisual Instructions: ${entry.visualRef}\n\nCaption/CTA: ${entry.caption}`,
          dueDate: entry.date
        } : t));
      } else {
        const newTask = {
          id: `t-${Math.random().toString(36).substr(2, 9)}`,
          orgId: currentUser.orgId,
          brandId: cal.brandId,
          serviceType: 'Social Media Management' as ServiceType,
          staffName: assignedUser?.name || currentUser.name,
          assignedBy: currentUser.name,
          taskTitle: `Calendar: ${entry.topic}`,
          taskDescription: `Platforms: ${entry.platforms.join(', ')}\nType: ${entry.contentType}\n\nVisual Instructions: ${entry.visualRef}\n\nCaption/CTA: ${entry.caption}`,
          category: 'Content Optimisation' as TaskCategory,
          type: 'One-time' as TaskType,
          frequency: 'N/A' as Frequency,
          status: 'Not Started' as TaskStatus,
          dueDate: entry.date,
          progressUpdate: '',
          estimatedHours: 2, 
          hoursSpent: 0,
          comments: [],
          reportingPeriod: 'Nov 2024',
          relatedCalendarId: cal.id,
          relatedCalendarEntryId: entry.id
        };
        newTasksFromCal.push(newTask);
        
        if (assignedUser && assignedUser.id !== currentUser.id) {
          createNotification(assignedUser.id, 'info', `Strategy Update: You have a new content slot assigned for "${entry.topic}"`, newTask.id);
        }
      }
    });

    if (newTasksFromCal.length > 0) {
      setTasks(prev => [...newTasksFromCal, ...prev]);
    }
    notifyAdmins('success', `Strategy Calendar synchronized: ${cal.name}`);
  };

  const handleCreateBrand = (brandName: string, selectedServices: ServiceType[]) => {
    if (!currentUser) return;
    const newBrand: Brand = {
      id: `b-${Math.random().toString(36).substr(2, 9)}`,
      orgId: currentUser.orgId,
      name: brandName,
      services: selectedServices,
      leadId: currentUser.role === 'Staff Lead' ? currentUser.id : undefined
    };
    setBrands(prev => [...prev, newBrand]);

    const autoTasks: StaffTask[] = [];
    selectedServices.forEach(service => {
      const templates = SERVICE_TEMPLATES[service] || [];
      templates.forEach(tpl => {
        autoTasks.push({
          id: `t-${Math.random().toString(36).substr(2, 9)}`,
          orgId: currentUser.orgId,
          brandId: newBrand.id,
          serviceType: service,
          staffName: currentUser.name,
          assignedBy: currentUser.name,
          taskTitle: tpl.taskTitle,
          taskDescription: `Automatic protocol initialization for ${service}.`,
          category: tpl.category,
          type: tpl.type,
          frequency: tpl.frequency,
          status: 'Not Started',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          progressUpdate: '',
          estimatedHours: 1,
          hoursSpent: 0,
          comments: [],
          reportingPeriod: 'Nov 2024'
        });
      });
    });
    setTasks(prev => [...autoTasks, ...prev]);
    notifyAdmins('success', `New brand pipeline provisioned: ${brandName}`);
  };

  const handleUpdateBrand = (brandId: string, updates: Partial<Brand>) => {
    setBrands(prev => prev.map(b => b.id === brandId ? { ...b, ...updates } : b));
    notifyAdmins('info', `Brand configuration modified: ${brandId}`);
  };

  const markNotifRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleAdminDrillDown = (userId: string) => {
    setSelectedPersonnelId(userId);
    navigateTo('personnel-detail');
  };

  const handleBrandDrillDown = (brandId: string) => {
    setSelectedBrandDetailId(brandId);
    navigateTo('brand-detail');
  };

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} onRegister={handleRegister} users={users} showRegSuccess={showRegSuccess} onBackToLogin={() => setShowRegSuccess(false)} />;
  }

  const isAdminOrLead = currentUser?.role === 'Admin' || currentUser?.role === 'Staff Lead';

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <header className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-slate-200/50 dark:border-white/10 sticky top-0 z-[100] shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Logo className="h-8 sm:h-10" />
              <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="hidden sm:block text-[11px] font-black uppercase tracking-[0.2em] text-brand-blue dark:text-brand-cyan">{currentOrg?.name}</span>
                <span className="hidden sm:block text-[8px] font-bold text-slate-400 uppercase tracking-widest">{currentOrg?.tenantId}</span>
              </div>
            </div>
            
            <nav className="hidden lg:flex items-center bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200/50 dark:border-white/10">
              <button onClick={() => navigateTo('board')} className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${view === 'board' ? 'bg-white dark:bg-white/10 text-brand-blue shadow-sm' : 'text-slate-500'}`}>Protocol Board</button>
              {(isAdminOrLead || currentUser?.role === 'Staff Member' || currentUser?.role === 'Mentee') && (
                <button onClick={() => navigateTo('calendar')} className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${view === 'calendar' ? 'bg-white dark:bg-white/10 text-brand-blue shadow-sm' : 'text-slate-500'}`}>Calendars</button>
              )}
              {isAdminOrLead && (
                <button onClick={() => navigateTo('brands')} className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${view === 'brands' || view === 'brand-detail' ? 'bg-white dark:bg-white/10 text-brand-blue shadow-sm' : 'text-slate-500'}`}>Brands</button>
              )}
              {isAdminOrLead && (
                <button onClick={() => navigateTo('squad')} className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${view === 'squad' ? 'bg-white dark:bg-white/10 text-brand-blue shadow-sm' : 'text-slate-500'}`}>Squad Units</button>
              )}
              {isAdminOrLead && (
                <>
                  <button onClick={() => { navigateTo('analysis'); handleAnalyze(); }} className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${view === 'analysis' ? 'bg-brand-blue text-white shadow-lg' : 'text-slate-500'}`}>Intelligence</button>
                  <button onClick={() => navigateTo('users')} className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${view === 'users' || view === 'personnel-detail' ? 'bg-white dark:bg-white/10 text-brand-blue shadow-sm' : 'text-slate-500'}`}>Moderation</button>
                </>
              )}
            </nav>
            
            <div className="flex items-center gap-4">
              {isAdminOrLead && (
                <button 
                  onClick={() => { setEditingTask(null); setIsAddingTask(true); }}
                  className="bg-brand-blue hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
                >
                  + Generate Task
                </button>
              )}

              <div className="relative">
                <button onClick={() => { setShowNotifs(!showNotifs); setShowProfileModal(false); }} className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 relative">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  {tenantNotifications.filter(n => !n.read).length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-bounce">{tenantNotifications.filter(n => !n.read).length}</span>}
                </button>
                {showNotifs && <NotificationsPanel notifications={tenantNotifications} onNotificationClick={(n) => { markNotifRead(n.id); setShowNotifs(false); }} onMarkAllRead={() => setNotifications(prev => prev.map(n => ({...n, read: true})))} onClose={() => setShowNotifs(false)} />}
              </div>
              
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500">
                {isDarkMode ? '🌙' : '☀️'}
              </button>

              <div className="relative">
                <div onClick={() => { setShowProfileModal(!showProfileModal); setShowNotifs(false); }} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border-2 border-transparent hover:border-brand-blue overflow-hidden cursor-pointer shadow-sm">
                  <img src={currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name}`} className="w-full h-full object-cover" />
                </div>
                {showProfileModal && (
                  <div className="absolute right-0 mt-4 w-64 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-[200]">
                    <div className="p-8 border-b border-slate-50 dark:border-white/5">
                      <p className="text-sm font-black text-slate-800 dark:text-white truncate">{currentUser?.name}</p>
                      <p className="text-[9px] font-black text-brand-cyan uppercase tracking-widest mt-1">{currentUser?.role}</p>
                    </div>
                    <div className="p-4">
                      <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 transition-colors rounded-2xl text-left font-black text-[10px] uppercase tracking-widest">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {(isAddingTask || editingTask) ? (
          <TaskEntryForm 
            currentUser={currentUser!} 
            users={tenantUsers} 
            brands={tenantBrands}
            initialTask={editingTask} 
            onSubmit={handleTaskSubmit} 
            onCancel={() => { setIsAddingTask(false); setEditingTask(null); }} 
          />
        ) : (
          <>
            {view === 'board' && <TaskBoard tasks={visibleTasks} users={tenantUsers} brands={tenantBrands} currentUser={currentUser!} onEditTask={setEditingTask} onAddComment={handleAddComment} onReviewTask={handleReviewTask} />}
            {view === 'calendar' && <ContentCalendarView currentUser={currentUser!} users={tenantUsers} brands={tenantBrands} calendars={tenantCalendars} onSaveCalendar={handleSaveCalendar} />}
            {view === 'brands' && isAdminOrLead && <BrandManagement brands={tenantBrands} onCreateBrand={handleCreateBrand} onUpdateBrand={handleUpdateBrand} onBrandClick={handleBrandDrillDown} />}
            {view === 'brand-detail' && selectedBrandDetailId && (
              <BrandDetailView 
                brand={brands.find(b => b.id === selectedBrandDetailId)!}
                tasks={tenantTasks}
                users={tenantUsers}
                currentUser={currentUser!}
                onBack={() => setView('brands')}
                onEditTask={setEditingTask}
                onAddComment={handleAddComment}
                onReviewTask={handleReviewTask}
              />
            )}
            {view === 'squad' && isAdminOrLead && <MentorshipHub users={tenantUsers} tasks={tenantTasks} currentUser={currentUser!} onClaimMentee={(id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, mentorId: currentUser.id } : u))} />}
            {view === 'analysis' && isAdminOrLead && (loading ? <div className="py-20 text-center font-black animate-pulse text-slate-400 uppercase tracking-widest">Synthesizing intelligence logs...</div> : summary && <Dashboard summary={summary} />)}
            {view === 'users' && isAdminOrLead && <AdminUserManagement users={visibleUsers} currentUser={currentUser!} onUpdateUser={(id, updates) => setUsers(prev => prev.map(u => u.id === id ? {...u, ...updates} : u))} onDeleteUser={handleDeleteUser} onDrillDown={handleAdminDrillDown} />}
            {view === 'personnel-detail' && selectedPersonnelId && isAdminOrLead && (
              <PersonnelProtocolView 
                userId={selectedPersonnelId} 
                users={tenantUsers} 
                tasks={tenantTasks} 
                currentUser={currentUser!}
                onBack={() => setView('users')}
                onAddComment={handleAddComment}
                onReviewTask={handleReviewTask}
              />
            )}
            {(!isAdminOrLead && view !== 'board' && view !== 'calendar') && <div className="py-40 text-center text-slate-400 font-black uppercase tracking-widest">Redirecting to active protocols... {setView('board')}</div>}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
