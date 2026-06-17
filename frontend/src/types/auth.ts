export type User = {
  id: number;
  email: string;
  name: string;
  university: string | null;
  course: string | null;
  yearOfStudy: number | null;
  bio: string | null;
};

export type AuthResponse = {
  token: string;
  user: User;
};