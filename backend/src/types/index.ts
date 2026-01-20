import { Request } from 'express';

export interface DecodedToken {
  userId: string;
  email: string;
  role: 'client' | 'admin';
}

export interface AuthRequest extends Request {
  user?: DecodedToken;
}
