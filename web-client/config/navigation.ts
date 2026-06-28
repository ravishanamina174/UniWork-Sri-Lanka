import { Home, User, Briefcase, FileText, Award } from 'lucide-react';

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
        { name: 'Available Tasks', href: '/dashboard/st-tasks', icon: Briefcase },// Example extra route
        commonLinks[1],
      ];
    case 'TASK_POSTER':
      return [
        commonLinks[0],
        { name: 'My Posted Tasks', href: '/dashboard/ps-tasks', icon: FileText },
        commonLinks[1],
      ];
    case 'CORPORATE_CLIENT':
      return [
        commonLinks[0],
        { name: 'Enterprise Tasks', href: '/dashboard/co-tasks', icon: Briefcase },
        commonLinks[1],
      ];
    default:
      return commonLinks;
  }
};