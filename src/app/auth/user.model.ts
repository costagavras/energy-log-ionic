export interface User {
  email?: string;
  userId?: string;
  name?: string;
  gender?: string;
  age?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  bmr?: number;
  activityLevel?: number; // BMR * activity level (extra ex+walking)
  units?: string;
}

export interface UserStamp {
  date: Date;
  dateStr: string;
  age: number;
  weight: number;
  bmi: number;
  bmr: number;
  activityLevel: number;
}
