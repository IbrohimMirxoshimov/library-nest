// src/modules/auth/auth.interface.ts

export interface ReqUser {
  id: number;
  roleId: number;
  permissions: number[];
  locationId?: number;
}

export interface ReqUserLocation extends ReqUser {
  locationId: number;
}

export type JwtPayload = {
  sub: number;
};
