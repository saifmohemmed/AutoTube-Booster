
export enum UserRole {
  GUEST = 'guest',
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export interface User {
  id: number;
  name: string;
  role: UserRole;
  plan?: SubscriptionPlan;
  points?: number;
  rank?: number;
}

export enum SubscriptionPlan {
  BASIC = 'Basic',
  STANDARD = 'Standard',
  VIP = 'VIP',
}

export interface Course {
  id: string;
  title: string;
  description: string;
  type: 'نظري' | 'تطبيقي';
  instructor: string;
  imageUrl: string;
}

export interface PromotionalContent {
  mainVideoUrl: string;
  galleryImages: string[];
  specialOffers: string[];
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  type: 'code' | 'platform';
}
