// Admin client disabled — revert to avoid accidental usage.
export function createAdminClient() {
  throw new Error("Admin client disabled. Revert requested.");
}
