import React from 'react';
import { CircularLoader } from '../basic';
import * as DialogStyled from '../basic/dialog/styled/dialog.styled';

const LoadDialog = () => (
  <DialogStyled.Dialog>
    <CircularLoader color="#ffffff" />
  </DialogStyled.Dialog>
);

export default LoadDialog;
