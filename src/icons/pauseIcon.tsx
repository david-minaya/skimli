import { SvgIcon } from '@mui/material';

export function PauseIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path 
        d='M8 6V17M17 6V17' 
        stroke='currentColor' 
        strokeWidth='3' 
        strokeLinecap='round' 
        strokeLinejoin='round'/>
    </SvgIcon>
  );
}
