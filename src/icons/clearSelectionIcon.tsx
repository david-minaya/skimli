import { SvgIcon } from '@mui/material';

export function ClearSelectionIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path 
        fillRule='evenodd' 
        clipRule='evenodd' 
        fill='#FC4603'
        d='M5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5ZM9.87863 8.46444C9.4881 8.07391 8.85494 8.07391 8.46441 8.46444C8.07389 8.85496 8.07389 9.48813 8.46441 9.87865L14.1213 15.5355C14.5118 15.926 15.145 15.926 15.5355 15.5355C15.926 15.145 15.926 14.5118 15.5355 14.1213L9.87863 8.46444Z'/>
      <path 
        d='M9.17139 14.8284L14.8282 9.17154' 
        fill='none'
        stroke='white' 
        strokeWidth='2' 
        strokeLinecap='round' 
        strokeLinejoin='round'/>
    </SvgIcon>
  );
}
