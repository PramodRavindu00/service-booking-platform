export class CurrentUserType {
  id: string;
  email: string;
}
export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthResult {
  refreshToken: string;
  accessToken: string;
}

export interface RequestWithUser extends Request {
  user: CurrentUserType;
}

export interface ExtendedRequest extends Request {
  cookies?: Record<string, string>;
}
