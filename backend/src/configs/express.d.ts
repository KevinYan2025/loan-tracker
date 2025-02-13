import { Request } from 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    user: {
      uid: string | undefined;
      email: string | undefined;
    };
  }
}