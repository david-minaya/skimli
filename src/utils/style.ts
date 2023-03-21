import { SxProps, Theme } from "@mui/system";

type Nested<T> = { [k in keyof T]: SxProps<Theme> };

/**
 * This function maps the type of the style object to help 
 * TypeScript infer the type of the style object. Without this
 * function, TypeScript won't know which properties are defined
 * in the style object.
 * 
 * @param style style object
 * @returns style object typed
 */
export function Style<T>(style: { [k in keyof T]: SxProps<Theme> | T[k] }) {
  return style as { [k in keyof T]: T[k] extends Nested<T[k]> ? T[k] : SxProps<Theme> }; 
}

export function nestedStyle<T>(style: { [k in keyof T]: SxProps<Theme> }) {
  return style as Nested<typeof style>
}

export function mergeSx(...sxs: (SxProps<Theme> | undefined | false)[]): SxProps<Theme> {
  return sxs.reduce((result: any, sx) => sx ? { ...result, ...sx } : result, {});
}
