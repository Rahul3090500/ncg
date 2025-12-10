export interface Step {
  id: string;
  title: string;
  description: string;
  image?: {
    url: string;
    alt?: string;
  };
}

export interface ApproachData {
  title: string;
  steps: Step[];
}