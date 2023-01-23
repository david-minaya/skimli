import { DoneRounded, PriorityHighRounded } from '@mui/icons-material';
import { Box } from '@mui/material';
import { style } from './step.style';

interface Props {
  value: number;
  index: number;
  title: string;
  warning?: boolean;
}

export function Step(props: Props) {

  const {
    value,
    index,
    title,
    warning: _warning,
  } = props;

  const selected = index === value && !_warning;
  const warning = index === value && _warning;
  const completed = index > value;

  return (
    <Box sx={style.container}>
      <Box 
        sx={[
          style.symbol,
          selected && style.symbolSelected as any,
          warning && style.symbolWarning as any,
          completed && style.symbolCompleted as any
        ]}>
        {selected && <DoneRounded sx={style.doneIcon}/>}
        {warning && <PriorityHighRounded sx={style.warningIcon}/>}
        {!selected && !warning && <Box sx={style.index}>{value}</Box>}
      </Box>
      <Box 
        sx={[
          style.title,
          selected && style.titleSelected as any,
          warning && style.titleWarning as any,
          completed && style.titleCompleted as any
        ]}>
        {title}
      </Box>
    </Box>
  );
}
