import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

export function isValidFilename(filename: string): boolean {
  return filename.match(/\.\.\//g) === null;
}

@ValidatorConstraint({ name: "filename", async: false })
export class IsValidFilename implements ValidatorConstraintInterface {
  validate(filename: string) {
    return isValidFilename(filename);
  }

  defaultMessage() {
    return "Filename contains suspicious characters";
  }
}
