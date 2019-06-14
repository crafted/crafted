export type RepositoryPermission = 'unknown'|'admin'|'write'|'read'|'none';

export interface PermissionResponse {
  permission: RepositoryPermission;
}
