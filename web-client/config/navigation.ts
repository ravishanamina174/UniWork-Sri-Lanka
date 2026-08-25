// web-client/config/navigation.ts
import { Home, User, Briefcase, FileText, FileCheck, MessageSquare, Settings, Search } from 'lucide-react';

export type UserRole = 'STUDENT_EARNER' | 'TASK_POSTER' | 'CORPORATE_CLIENT';

export const getNavLinks = (role: UserRole) => {
  const commonLinks = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  switch (role) {
    case 'STUDENT_EARNER':
      return [
        commonLinks[0],
        { name: 'Tasks', href: '/dashboard/student-tasks', icon: Briefcase },
        { name: 'Settings', href: '/', icon: Settings }, // <-- Added
        commonLinks[1],
      ];
    case 'TASK_POSTER':
      return [
        commonLinks[0],
        { name: 'My Posted Tasks', href: '/dashboard/poster-tasks', icon: FileText },
        { name: 'Applications', href: '/dashboard/applications', icon: FileCheck },
        { name: 'Student Lookup', href: '/dashboard/student-lookup', icon: Search }, // <-- Added
        commonLinks[1],
      ];
    case 'CORPORATE_CLIENT':
      return [
        commonLinks[0],
        { name: 'Enterprise Tasks', href: '/dashboard/corporate-tasks', icon: Briefcase },
        { name: 'Applications', href: '/dashboard/applications', icon: FileCheck },
        { name: 'Student Lookup', href: '/dashboard/student-lookup', icon: Search }, // <-- Added
        commonLinks[1],
      ];
    default:
      return commonLinks;
  }
};