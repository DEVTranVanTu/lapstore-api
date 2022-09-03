import { IUser } from "../models/user.model";
import { roles } from "./constants";

const setUserInfo = (request: IUser) => {
  return {
    _id: request._id,
    email: request.email,
    username: request.username,
    profile: request.profile,
    role: request.role,
  };
};

const getRole = (checkRole: String) => {
  let role: Number;
  switch (checkRole) {
    case roles.ROLE_ADMIN:
      role = 0;
      break;
    case roles.ROLE_CUSTOMER:
      role = 1;
      break;
    default:
      role = 1;
  }
  return role;
};

export default { getRole, setUserInfo };
