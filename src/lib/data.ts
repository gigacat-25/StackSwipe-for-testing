
export type UserProfile = {
  id: string;
  name: string;
  avatarUrl: string;
  headline: string;
  bio: string;
  currentWork: string;
  techStack: string[];
  interests: string[];
  networkingTags: string[];
  links: {
    github: string;
    linkedin: string;
  };
};

export const profiles: UserProfile[] = [
  {
    id: "1",
    name: "Alex Morgan",
    avatarUrl: "https://placehold.co/128x128.png",
    headline: "Senior Frontend Engineer @ Innovate Inc.",
    bio: "Passionate about building beautiful and accessible user interfaces. Always learning new things in the React ecosystem.",
    currentWork: "Leading the development of a new design system.",
    techStack: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Figma"],
    interests: ["Design Systems", "Web Accessibility", "Indie Hacking"],
    networkingTags: ["Mentor", "Teammate"],
    links: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "2",
    name: "Sam Chen",
    avatarUrl: "https://placehold.co/128x128.png",
    headline: "Backend Developer | Python & Go",
    bio: "Building scalable and resilient systems. I enjoy working on distributed systems and cloud infrastructure.",
    currentWork: "Developing microservices for a fintech platform.",
    techStack: ["Python", "Go", "Docker", "Kubernetes", "PostgreSQL", "AWS"],
    interests: ["Distributed Systems", "Cloud Native", "Fintech"],
    networkingTags: ["Teammate", "Vibes"],
    links: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "3",
    name: "Jessica Wu",
    avatarUrl: "https://placehold.co/128x128.png",
    headline: "Product Manager | Ex-Founder",
    bio: "I love building products that users love. Experienced in 0-to-1 product development and scaling.",
    currentWork: "Product Lead for a new AI-powered analytics tool.",
    techStack: ["Jira", "Figma", "Mixpanel", "SQL"],
    interests: ["AI/ML", "Product Strategy", "User Research"],
    networkingTags: ["Mentor", "Referrals"],
    links: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "4",
    name: "Ben Carter",
    avatarUrl: "https://placehold.co/128x128.png",
    headline: "Aspiring Software Engineer",
    bio: "Recent bootcamp grad looking for my first full-time role. Eager to learn and contribute to a meaningful project.",
    currentWork: "Building personal projects and contributing to open source.",
    techStack: ["JavaScript", "React", "Node.js", "Express", "MongoDB"],
    interests: ["Open Source", "Web Development", "Learning new technologies"],
    networkingTags: ["Mentee"],
    links: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    },
  },
   {
    id: "5",
    name: "Chloe Rodriguez",
    avatarUrl: "https://placehold.co/128x128.png",
    headline: "UX/UI Designer",
    bio: "Creating intuitive and delightful experiences for users. I bridge the gap between user needs and business goals.",
    currentWork: "Designing the mobile app for a health and wellness startup.",
    techStack: ["Figma", "Adobe XD", "Sketch", "User-centered Design"],
    interests: ["Mobile Design", "Prototyping", "Design Thinking"],
    networkingTags: ["Teammate", "Vibes"],
    links: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    },
  },
];

export const currentUser: UserProfile = profiles[0];

export type Message = {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
};

export type Conversation = {
  contactId: number;
  contactName: string;
  contactAvatarUrl: string;
  messages: Message[];
};

export const conversations: Conversation[] = [
    {
        contactId: 2,
        contactName: "Sam Chen",
        contactAvatarUrl: "https://placehold.co/128x128.png",
        messages: [
            { id: '1', sender: 'them', text: "Hey Alex! Saw your profile, impressive work with design systems.", timestamp: "10:00 AM" },
            { id: '2', sender: 'me', text: "Thanks Sam! Likewise on the backend stuff. Your work with Go is interesting.", timestamp: "10:01 AM" },
        ]
    },
    {
        contactId: 3,
        contactName: "Jessica Wu",
        contactAvatarUrl: "https://placehold.co/128x128.png",
        messages: [
            { id: '1', sender: 'them', text: "Hi Alex, I'm looking for a frontend expert to chat about a side project. Interested?", timestamp: "Yesterday" },
            { id: '2', sender: 'me', text: "Definitely sounds intriguing! Tell me more.", timestamp: "Yesterday" },
            { id: '3', sender: 'them', text: "It's an AI tool for summarizing research papers. We need a clean, intuitive interface.", timestamp: "Yesterday" },
        ]
    }
];

    