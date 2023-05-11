import { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { style } from './timeout.style';

interface Props {
  show: boolean;
  timeout: number;
  onTimeout: () => void;
}

export function Timeout(props: Props) {

  const {
    show,
    timeout,
    onTimeout
  } = props;

  const { t } = useTranslation('components');

  const [minutes, setMinutes] = useState<number>();
  const [seconds, setSeconds] = useState<number>();
  const [timeoutId] = useState<{ id?: NodeJS.Timeout }>({});

  const calcTimeout = useCallback((time: number) => {

    const timeInSeconds = (time - Date.now()) / 1000;
    
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds - hours * 3600) / 60);
    const seconds = Math.trunc(timeInSeconds - hours * 3600 - minutes * 60);

    setMinutes(minutes);
    setSeconds(seconds);

    if (!show || timeInSeconds < 0) {
      clearTimeout(timeoutId.id);
      setMinutes(undefined);
      setSeconds(undefined);
      onTimeout();
      return;
    }

    timeoutId.id = setTimeout(() => calcTimeout(time), 1000);

  }, [onTimeout, show, timeoutId]);

  useEffect(() => {

    if (!show) return;

    const time = Date.now() + timeout;
    calcTimeout(time);

    return () => {
      clearTimeout(timeoutId.id);
      setMinutes(undefined);
      setSeconds(undefined);
    };

  }, [show, timeout, onTimeout, calcTimeout, timeoutId]);

  if (!show) return null;

  return (
    <Box sx={style.timeout}>
      {t('timeout.text', { minutes, seconds })}
    </Box>
  );
}
