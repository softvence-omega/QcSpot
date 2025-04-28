export interface IUser {
  _id: string;
  email: string;
  name: string;
  password: string;
  role: "admin" | "user";
  isBlocked: boolean;
  isDeleted: boolean;
  isLoggedIn: boolean;
  passwordChangeTime: string;
}
