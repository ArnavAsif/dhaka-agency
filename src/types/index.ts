export type ShapeName = 
  | 'fplus' 
  | 'eighteen' 
  | 'glasses' 
  | 'wheel' 
  | 'pen' 
  | 'bottle' 
  | 'medal' 
  | 'cup' 
  | 'frame' 
  | 'mail';

export interface WorkProject {
  id: string;
  tag?: string;
  title: string;
  shape: ShapeName;
  description: string[];
  link?: {
    href: string;
    label: string;
  };
}
