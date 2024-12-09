import { TaskType, RateType, ServiceStatus } from './types';
import type { DetailedLocation } from '../location';

export interface ServiceListing {
  id: string;
  taskType: TaskType;
  category: string;
  customCategory?: string;
  description: string;
  provider?: {
    id: string;
    name: string;
    rating?: number;
    reviewCount?: number;
  };
  location: DetailedLocation;
  pricing?: {
    rate: number;
    rateType: RateType;
  };
  status: ServiceStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface OddJob extends ServiceListing {
  taskType: TaskType.ODD_JOB;
  dateNeeded: Date;
  estimatedDuration?: string;
  budget?: number;
}

export interface ProfessionalService extends ServiceListing {
  taskType: TaskType.PROFESSIONAL_SERVICE;
  businessHours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  certifications?: string[];
  insurance?: {
    provider: string;
    policyNumber: string;
    expirationDate: Date;
  };
}