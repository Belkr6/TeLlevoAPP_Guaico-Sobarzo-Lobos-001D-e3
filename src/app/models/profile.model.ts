export interface Profile {
  uid: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
  bio?: string;
  profileImage?: string;
}