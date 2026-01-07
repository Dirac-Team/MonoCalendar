export interface ContentPillar {
  name: string;
  description: string;
}

export interface UserProfile {
  name: string;
  brandType: 'Personal' | 'Company';
  platform: 'YouTube' | 'Instagram';
  postingDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  contentPillars: ContentPillar[]; // List of recurring formats with details
  persona: string; // Detailed description of voice/personality
  visualStyle: string; // Color grading, editing style, aesthetic
  isOnboarded: boolean;
}

export interface DayPlan {
  date: string; // ISO Date string YYYY-MM-DD
  theme: string;
  description: string;
  isPosted?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface WeeklyPlanResponse {
  plans: {
    dayOffset: number; // 0 for today/start date, 1 for tomorrow...
    theme: string;
    description: string;
  }[];
}