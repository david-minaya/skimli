import { SxProps, Theme } from "@mui/system";

/**
 * This function maps the type of the style object to help 
 * TypeScript infer the type of the style object. Without this
 * function, TypeScript won't know which properties are defined
 * in the style object.
 * 
 * @param style style object
 * @returns style object typed
 */
export function Style<T>(style: { [k in keyof T]: SxProps<Theme> }) {
  return style; 
}
