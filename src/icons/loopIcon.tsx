import { SvgIcon, SvgIconProps } from '@mui/material';

export function LoopIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} fill='none'>
      <path d='M13 10.25L15.1667 7.125L13 4' fill='none' stroke='black' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
      <path d='M13.5 7H5C4.44772 7 4 7.44772 4 8V16C4 16.5523 4.44772 17 5 17H5.91176' fill='none' stroke='black' strokeWidth='2' strokeLinecap='round'/>
      <path d='M11.167 13.75L9.00033 16.875L11.167 20' fill='none' stroke='black' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
      <path d='M10.667 17L19.167 17C19.7193 17 20.167 16.5523 20.167 16L20.167 8C20.167 7.44772 19.7193 7 19.167 7L18.2552 7' fill='none' stroke='black' strokeWidth='2' strokeLinecap='round'/>
    </SvgIcon>
  );
}
