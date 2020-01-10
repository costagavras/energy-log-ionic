export interface Exercise {
  id: string;
  name: string;
  caloriesOut: number;
  duration?: number;
  quantity?: number;
  date: Date;
  dateStr: string;
}