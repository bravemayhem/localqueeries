export const PROVIDER_CATEGORIES = [
    'painting',
    'plumbing',
    'electrical',
    'dog walking',
    'carpentry',
    'landscaping',
    'handywork',
    'cleaning',
    'hvac',
    'roofing',
    'flooring',
    'general_maintenance',
    'pest_control',
    'moving',
    'interior_design',
    'security',
] as const;
  
export type ProviderCategory = typeof PROVIDER_CATEGORIES[number];