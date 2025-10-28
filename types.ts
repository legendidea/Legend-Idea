
export interface Notification {
  id: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  skills: string[];
  interests: string[];
  role: 'Creator' | 'Critic' | 'Collaborator';
  bio: string;
  portfolioUrl?: string;
  isPremium?: boolean;
  following: string[]; // Array of user IDs this user follows
  followers: string[]; // Array of user IDs that follow this user
  notifications: Notification[];
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
}

export interface IdeaAnalytics {
  views: number;
  geo: { [countryCode: string]: number }; // e.g., { 'US': 500, 'DE': 100 }
}

export interface Idea {
  id: string;
  title: string;
  author: User;
  description: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  upvotes: number;
  rating: number;
  comments: Comment[];
  analytics: IdeaAnalytics;
  isPromoted?: boolean;
}

export interface CollaboratorMatch {
  name: string;
  skills: string[];
  reason: string;
}

// FIX: Add missing Challenge interface
export interface Challenge {
  id: string;
  title: string;
  prompt: string;
  endDate: string;
  prize: string;
  imageUrl: string;
}

export enum ActivityType {
  NEW_IDEA = 'NEW_IDEA',
  UPVOTE = 'UPVOTE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
}

export interface FeedActivity {
  id: string;
  type: ActivityType;
  user: User; // User who performed the action
  timestamp: string; // e.g., "2 hours ago"
  idea?: Idea; // The related idea
  commentText?: string;
  followedUser?: User; // The user who was followed
}
