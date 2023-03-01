import { SvgIcon } from '@mui/material';

export function CloseIcon(props: any) {
  return (
    <SvgIcon {...props} fill='none'>
      <path 
        d='M6 6L18 18M6 18L18 6L6 18Z'
        stroke='currentColor' 
        strokeWidth='2' 
        strokeLinecap='round' 
        strokeLinejoin='round'/>
    </SvgIcon>
  );
}
