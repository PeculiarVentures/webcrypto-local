import { ACTIONS_CONST } from '../../constants';

export const createCSR = (providerId, data) => ({
  type: ACTIONS_CONST.WS_CREATE_CSR,
  providerId,
  data,
});

export const removeCSR = certId => ({
  type: ACTIONS_CONST.WS_REMOVE_CSR,
  certId,
});
