export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'expert' | 'business';
  createdAt: string;
}

export interface Expert extends User {
  userType: 'expert';
  expertise: string[];
  experience: number;
  rating: number;
  completedProjects: number;
  hourlyRate: number;
  bio: string;
  portfolio: string[];
}

export interface BusinessOwner extends User {
  userType: 'business';
  businessName: string;
  businessType: string;
  location: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  duration: string;
  requirements: string[];
  businessOwnerId: string;
  businessOwnerName: string;
  businessName: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  expertId?: string;
  expertName?: string;
  createdAt: string;
  deadline: string;
}

export interface Application {
  id: string;
  projectId: string;
  expertId: string;
  expertName: string;
  message: string;
  proposedRate: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Quote {
  id: string;
  projectId: string;
  expertId: string;
  expertName: string;
  expertRating: number;
  expertExperience: number;
  totalPrice: number;
  estimatedDuration: string;
  workScope: string[];
  deliverables: string[];
  message: string;
  timeline: QuoteTimeline[];
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
  expiresAt: string;
}

export interface QuoteTimeline {
  phase: string;
  duration: string;
  description: string;
}

export interface QuoteRequest {
  projectId: string;
  expertIds: string[];
  message?: string;
  deadline: string;
}

export interface MajayoungCash {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  lastUpdated: string;
}

export interface CashTransaction {
  id: string;
  userId: string;
  type: 'charge' | 'spend' | 'refund' | 'bonus';
  amount: number;
  description: string;
  relatedId?: string; // 견적 ID, 충전 ID 등
  balanceAfter: number;
  createdAt: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface CashPackage {
  id: string;
  name: string;
  amount: number;
  price: number;
  bonusAmount: number;
  description: string;
  isPopular?: boolean;
  isActive: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'bank' | 'kakao' | 'naver';
  icon: string;
  isActive: boolean;
}