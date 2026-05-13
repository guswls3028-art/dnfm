/**
 * permissions.js — frontend 권한 helper.
 *
 * /auth/me 는 user.siteRoles: [{ site: "newb"|"allow"|"*", role: "member"|"admin"|"super" }] 를 반환.
 *   - 사이트별 row 가 없으면 일반 member 로 간주.
 *   - site = "*" 인 super row 는 모든 사이트에 admin 권한.
 *
 * 사용:
 *   const { user } = useCurrentUser();
 *   if (isSiteAdmin(user, "newb")) { ... admin only UI ... }
 */

const ADMIN_ROLES = new Set(["admin", "super"]);

export function isSiteAdmin(user, site = "newb") {
  if (!user) return false;
  const roles = Array.isArray(user.siteRoles) ? user.siteRoles : [];
  for (const r of roles) {
    if (!r || !r.role) continue;
    if (!ADMIN_ROLES.has(r.role)) continue;
    if (r.site === "*") return true;
    if (r.site === site) return true;
  }
  return false;
}

export function isSuperAdmin(user) {
  if (!user) return false;
  const roles = Array.isArray(user.siteRoles) ? user.siteRoles : [];
  return roles.some((r) => r && r.role === "super");
}
