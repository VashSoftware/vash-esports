export const load = async ({ locals }) => {
  const userPictureUrl = await locals.supabase.storage
    .from("user_pictures")
    .getPublicUrl(locals.user?.id);

  const isLoggedIn = () => {
    return locals.user?.id;
  };

  return {
    isLoggedIn: isLoggedIn(),
    userPictureUrl: userPictureUrl.data.publicUrl,
  };
};
