export default defineNuxtRouteMiddleware(async (to, from) => {
  const { supabaseUser } = storeToRefs(useUserStore());

  if (!to.name) {
    return navigateTo("/dashboard");
  }

  if (to.name === "auth-login" && supabaseUser.value) {
    return navigateTo("/dashboard");
  }
});
