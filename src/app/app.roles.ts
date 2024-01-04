import { config } from 'dotenv';
import { AppRole } from '../shared/interfaces/auth.interface';
import { RolesBuilder } from 'nest-access-control';
config();

export const adminEmail = process.env.ADMIN_EMAIL;

export const getRole = (email: string): AppRole => {
  return email === adminEmail ? AppRole.ADMIN : AppRole.VOTER;
};

export enum ApiResources {
  ADMIN = 'ADMIN',
  VOTER = 'VOTER',
  VOTE = 'VOTE',
  STATUS = 'STATUS',
}

export const roles: RolesBuilder = new RolesBuilder();

// Voter authorizations
roles
  .grant(AppRole.VOTER)
  .readOwn(ApiResources.VOTER)
  .updateOwn(ApiResources.VOTER)
  .createOwn(ApiResources.VOTE);

// Admin authorizations
for (const key in ApiResources) {
  roles
    .grant(AppRole.ADMIN)
    .readAny(ApiResources[key])
    .updateAny(ApiResources[key])
    .createAny(ApiResources[key])
    .deleteAny(ApiResources[key]);
}
