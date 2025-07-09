export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'user';
}