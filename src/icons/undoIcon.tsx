import { SvgIcon, SvgIconProps } from '@mui/material';

export function UndoIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d='M15 2L12 5L15 8' fill='none' stroke='black' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
      <path d='M11 2L9 5L11 8' fill='none' stroke='black' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
      <path d='M4 13.4141C4 18.156 7.80558 22 12.5 22C17.1944 22 21 18.156 21 13.4141C21 9.26035 18.0798 5.79552 14.2 5H13.4444' fill='none' stroke='black' strokeWidth='2' strokeLinecap='round'/>
      <path d='M12 11V14.4286L15 17' fill='none' stroke='black' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
    </SvgIcon>
  );
}
