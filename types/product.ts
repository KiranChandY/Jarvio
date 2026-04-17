export type HealthStatus = 'good' | 'caution' | 'avoid';

export interface HealthCondition {
  condition: string;
  status: HealthStatus;
  flagged_ingredients?: string[];
  details?: string;
}

export interface ProductSource {
  title: string;
  url: string;
}

export interface ProductData {
  barcode: string;
  name?: string;
  brand?: string;
  image_url?: string;
  clean_score?: number;
  health?: HealthCondition[];
  sources?: ProductSource[];
}

export interface ScanProductResponse {
  product: ProductData;
  clean_score?: number;
  health?: HealthCondition[];
  sources?: ProductSource[];
}
