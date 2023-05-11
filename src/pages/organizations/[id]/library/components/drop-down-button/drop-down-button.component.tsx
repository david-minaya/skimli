import { Fragment, useRef, useState } from 'react';
import { ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import { Popper, Paper, ClickAwayListener, MenuList, MenuItem } from '@mui/material';
import { OutlinedButton } from '~/components/outlined-button/outlined-button.component';
import { useUploadFiles } from '~/utils/UploadFilesProvider';
import { style } from './drop-down-button.style';

interface Props {
  onUploadFile: () => void;
}

export function DropDownButton(props: Props) {

  const { onUploadFile } = props;
  const { t } = useTranslation('library');
  const { inProgress } = useUploadFiles();
  const [openPopup, setOpenPopup] = useState(false);
  const newButtonRef = useRef<HTMLButtonElement>(null);

  function handleUpload() {
    setOpenPopup(false);
    onUploadFile();
  }

  return (
    <Fragment>
      <OutlinedButton
        sx={style.button}
        refButton={newButtonRef}
        title={t('newButton')}
        secondaryIcon={ExpandMore}
        onClick={() => setOpenPopup(true)}/>
      {/* @ts-ignore */}
      <Popper
        open={openPopup}
        placement='bottom-end'
        anchorEl={newButtonRef.current}>
        <Paper 
          sx={style.paper}
          elevation={2}>
          <ClickAwayListener onClickAway={() => setOpenPopup(false)}>
            <MenuList autoFocusItem>
              <MenuItem
                sx={style.menuItem}
                disabled={inProgress}
                onClick={handleUpload}>
                {t('uploadOption')}
              </MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </Fragment>
  );
}
