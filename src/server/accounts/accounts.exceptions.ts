import AppErrorCodes from "../../common/app-error-codes";
import { BadInputError } from "../types/base.types";

export const UserNotFoundException = new BadInputError(
  AppErrorCodes.USER_NOT_FOUND
);
