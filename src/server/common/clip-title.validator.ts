import {
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "title", async: true })
class ValidClipTitleConstraint implements ValidatorConstraintInterface {
  async validate(title: string) {
    return /^[A-Za-z0-9\s]*$/.test(title);
  }

  defaultMessage() {
    return "Title contains invalid characters";
  }
}

export const IsValidClipTitle = Validate(ValidClipTitleConstraint);
