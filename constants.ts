import { User, Idea, Comment, Notification, FeedActivity, ActivityType } from './types';

export const MOCK_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'Qaisar Mushtaq', 
    avatarUrl: 'https://picsum.photos/seed/qaisar/100/100', 
    skills: ['UI/UX Design', 'React', 'Figma'], 
    interests: ['Sustainability', 'Mobile Apps'], 
    role: 'Creator',
    bio: 'Creative UI/UX designer passionate about building intuitive and beautiful user experiences. I love turning complex problems into simple, elegant designs.',
    portfolioUrl: 'https://qaisarm.design',
    isPremium: true,
    following: ['u2', 'u5'],
    followers: [],
    notifications: [],
  },
  { 
    id: 'u2', 
    name: 'Bob Williams', 
    avatarUrl: 'https://picsum.photos/seed/bob/100/100', 
    skills: ['Python', 'Machine Learning', 'Data Analysis'], 
    interests: ['AI', 'Fintech'], 
    role: 'Collaborator',
    bio: 'Data scientist with a knack for finding patterns in chaos. My expertise lies in machine learning models and data visualization.',
    following: [],
    followers: ['u1'],
    notifications: [],
  },
  { 
    id: 'u3', 
    name: 'Charlie Brown', 
    avatarUrl: 'https://picsum.photos/seed/charlie/100/100', 
    skills: ['Marketing', 'SEO', 'Content Writing'], 
    interests: ['E-commerce', 'Branding'], 
    role: 'Critic',
    bio: 'Marketing strategist who helps ideas find their audience. I specialize in digital marketing, SEO, and compelling content creation.',
    portfolioUrl: 'https://charlieb.marketing',
    following: [],
    followers: [],
    notifications: [],
  },
  { 
    id: 'u4', 
    name: 'Diana Prince', 
    avatarUrl: 'https://picsum.photos/seed/diana/100/100', 
    skills: ['Project Management', 'Agile', 'Scrum'], 
    interests: ['Productivity Tools', 'Startups'], 
    role: 'Collaborator',
    bio: 'Experienced project manager dedicated to keeping teams on track and delivering results. I thrive in agile environments.',
    following: [],
    followers: [],
    notifications: [],
  },
  { 
    id: 'u5', 
    name: 'Ethan Hunt', 
    avatarUrl: 'https://picsum.photos/seed/ethan/100/100', 
    skills: ['Graphic Design', 'Illustration', 'Adobe Suite'], 
    interests: ['Gaming', 'Art'], 
    role: 'Creator',
    bio: 'Visual storyteller and graphic designer. From logos to full-scale illustrations, I bring ideas to life with vibrant visuals.',
    portfolioUrl: 'https://ethanhunt.art',
    following: [],
    followers: ['u1'],
    notifications: [],
  },
];

const MOCK_COMMENTS: Comment[] = [
  { id: 'c1', user: MOCK_USERS[2], text: "This is a fascinating concept! Have you considered the scalability challenges?", timestamp: "2 hours ago" },
  { id: 'c2', user: MOCK_USERS[3], text: "I'd love to help with the project management side of this. Seems promising.", timestamp: "1 day ago" },
];

export const MOCK_IDEAS: Idea[] = [
  {
    id: 'i1',
    title: 'AI-Powered Personal Gardener',
    author: MOCK_USERS[0],
    description: 'A mobile app that uses AI to identify plants, diagnose diseases, and provide personalized care schedules. It connects to smart home watering systems for automated plant care. The goal is to make gardening accessible to everyone, regardless of their experience level.',
    category: 'Technology',
    tags: ['AI', 'Sustainability', 'Mobile App', 'IoT'],
    imageUrl: 'https://picsum.photos/seed/gardener/800/600',
    upvotes: 128,
    rating: 4.5,
    comments: MOCK_COMMENTS,
    analytics: {
      views: 1523,
      geo: { 'US': 820, 'DE': 150, 'IN': 120, 'GB': 95, 'CA': 88 },
    },
    isPromoted: false,
  },
  {
    id: 'i2',
    title: 'Gamified Language Learning Adventure',
    author: MOCK_USERS[4],
    description: 'An immersive RPG where players learn a new language by completing quests, interacting with NPCs, and exploring a fantasy world. Vocabulary and grammar are integrated into the gameplay, making learning feel like an adventure rather than a chore.',
    category: 'Gaming',
    tags: ['Education', 'Gaming', 'Mobile App'],
    imageUrl: 'https://picsum.photos/seed/gaming/800/600',
    upvotes: 256,
    rating: 4.8,
    comments: [],
    analytics: {
      views: 3250,
      geo: { 'KR': 1200, 'JP': 950, 'US': 600, 'BR': 250 },
    },
    isPromoted: false,
  },
  {
    id: 'i3',
    title: 'Sustainable Packaging Marketplace',
    author: MOCK_USERS[0],
    description: 'An e-commerce platform connecting businesses with suppliers of eco-friendly and biodegradable packaging materials. The platform would also provide resources and consulting on transitioning to sustainable practices.',
    category: 'Business',
    tags: ['Sustainability', 'E-commerce', 'Startups'],
    imageUrl: 'https://picsum.photos/seed/packaging/800/600',
    upvotes: 95,
    rating: 4.2,
    comments: [],
    analytics: {
      views: 890,
      geo: { 'DE': 300, 'NL': 150, 'SE': 120, 'US': 100 },
    },
    isPromoted: true,
  },
];

export const MOCK_ACTIVITIES: FeedActivity[] = [
  {
    id: 'act1',
    type: ActivityType.NEW_IDEA,
    user: MOCK_USERS[4], // Ethan Hunt
    idea: MOCK_IDEAS[1], // Gamified Language Learning Adventure
    timestamp: '1 day ago',
  },
  {
    id: 'act2',
    type: ActivityType.COMMENT,
    user: MOCK_USERS[3], // Diana Prince
    idea: MOCK_IDEAS[0], // AI-Powered Personal Gardener
    commentText: "I'd love to help with the project management side of this. Seems promising.",
    timestamp: '2 days ago',
  },
  {
    id: 'act3',
    type: ActivityType.FOLLOW,
    user: MOCK_USERS[0], // Qaisar Mushtaq
    followedUser: MOCK_USERS[1], // Bob Williams
    timestamp: '3 days ago',
  },
  {
    id: 'act4',
    type: ActivityType.UPVOTE,
    user: MOCK_USERS[0], // Qaisar Mushtaq
    idea: MOCK_IDEAS[1], // Gamified Language Learning Adventure
    timestamp: '4 days ago',
  }
];
