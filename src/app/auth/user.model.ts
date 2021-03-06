export class User {
  constructor(
    public id: string,
    public userEmail: string,
    private _token: string,
    private tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
      return null;
    }
    return this._token;
  }

  get tokenDuration() {
    if (!this.token) {
      return 0;
    }
    return this.tokenExpirationDate.getTime() - new Date().getTime();
  }

}

export interface UserProfile {
  userId: string;
  email?: string;
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
