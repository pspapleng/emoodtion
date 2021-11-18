export const SIGNIN_COMPLETE = "SIGNIN_COMPLETE";
export const whoSignin = (
  doc_id,
  auth_id,
  username,
  avatarURL,
  firstName,
  lastName,
  birthday,
  gender,
  bookmarks
) => {
  return {
    type: SIGNIN_COMPLETE,
    doc_id: doc_id,
    auth_id: auth_id,
    username: username,
    avatarURL: avatarURL,
    firstName: firstName,
    lastName: lastName,
    birthday: birthday,
    gender: gender,
    bookmarks: bookmarks,
  };
};
