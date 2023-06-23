import { MouseEvent, cloneElement } from 'react';
import { Box, Tooltip } from '@mui/material';
import { style } from './nav-bar-item.style';
import { useRouter } from 'next/router';
import { mergeSx } from '~/utils/style';

interface Props {
  tooltip: string;
  icon: JSX.Element;
  href?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export function NavBarItem(props: Props) {

  const { 
    tooltip,
    icon,
    href,
    onClick
  } = props;

  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (href) router.push(href);
    onClick?.(event);
  }

  return (
    <Tooltip
      componentsProps={{ tooltip: { sx: style.tooltip } }}
      title={tooltip}
      placement='right'>
      <Box
        sx={style.option}
        onClick={handleClick}>
        {cloneElement(icon, { sx: mergeSx(style.optionIcon, icon.props.sx) })}
      </Box>
    </Tooltip>
  );
}
