import { SvgIcon } from '@mui/material';

export function ArrowLeftIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path 
        d='M10 19L3 12M3 12L10 5M3 12H21'
        fill='none'
        stroke='black' 
        strokeWidth='2' 
        strokeLinecap='round' 
        strokeLinejoin='round'/>
    </SvgIcon>
  );
}
