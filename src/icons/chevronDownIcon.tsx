import { SvgIcon } from '@mui/material';

export function ChevronDownIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path 
        d='M19 9L12 16L5 9'
        fill='none' 
        stroke='currentColor' 
        strokeWidth='2' 
        strokeLinecap='round' 
        strokeLinejoin='round'/>
    </SvgIcon>
  );
}
