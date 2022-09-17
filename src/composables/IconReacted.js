import currentUser from "./CurrentUser";

const getIconReacted = (listReaction) => {
  const index = listReaction?.findIndex(({ user }) => user.uid == currentUser.uid);
  return listReaction ? listReaction[index]?.icon : '';
}

export { getIconReacted }