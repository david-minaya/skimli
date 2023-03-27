import { BadInputError } from "../types/base.types";

export const AssetNotFoundException = new BadInputError(`Asset not found`);
export const ClipsNotFoundException = new BadInputError(`Clips not found`);
