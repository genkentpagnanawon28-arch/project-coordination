export type Priority = 'LOW' | 'MID' | 'HIGH';

export type WebsiteType =
  | 'Portfolio Website'
  | 'Store Website'
  | 'Corporate Website'
  | 'Landing Page'
  | 'SaaS Platform'
  | 'Custom Web App';

export type Package = 'Beginner Package' | 'Elite Package' | 'Business Package';

export type PaymentStatus = 'paid' | 'half paid' | 'to be discuss';

export type ProjectStatus = 'not complete' | 'on going' | 'completed' | 'published';

export interface Case {
  id: string;
  client_name: string;
  case_name: string;
  website_type: WebsiteType;
  package: Package;
  priority: Priority;
  payment_status: PaymentStatus;
  project_status: ProjectStatus;
  website_link: string | null;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCaseInput {
  client_name: string;
  case_name: string;
  website_type: WebsiteType;
  package: Package;
  priority: Priority;
  payment_status: PaymentStatus;
  project_status: ProjectStatus;
  website_link: string | null;
  start_date: string;
  end_date: string | null;
}
