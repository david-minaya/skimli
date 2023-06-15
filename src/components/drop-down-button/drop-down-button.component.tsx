import { Fragment, ReactElement, useRef, useState, Children, cloneElement } from 'react';
import { ExpandMore } from '@mui/icons-material';
import { Popper, Paper, ClickAwayListener, MenuList } from '@mui/material';
import { OutlinedButton } from '~/components/outlined-button/outlined-button.component';
import { mergeSx } from '~/utils/style';
import { style } from './drop-down-button.style';

interface Props {
  title: string;
  children: ReactElement | ReactElement[];
}

export function DropDownButton(props: Props) {

  const {
    title,
    children
  } = props;

  const [openPopup, setOpenPopup] = useState(false);
  const newButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Fragment>
      <OutlinedButton
        sx={style.button}
        refButton={newButtonRef}
        title={title}
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
              {
                Children.map(children, child =>
                  cloneElement(child, { 
                    sx: mergeSx(style.menuItem, child.props.sx),
                    onClick: () => {
                      setOpenPopup(false);
                      child.props.onClick?.();
                    } 
                  })
                )
              }
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </Fragment>
  );
}
