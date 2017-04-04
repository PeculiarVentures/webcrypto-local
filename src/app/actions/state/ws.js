import { ACTIONS_CONST } from '../../constants';

export const createCertificate = (providerId, data) => ({
  type: ACTIONS_CONST.WS_CREATE_CSR,
  providerId,
  data,
});

export const removeItem = () => ({
  type: ACTIONS_CONST.WS_REMOVE_ITEM,
});

export const status = state => ({
  type: ACTIONS_CONST.WS_STATUS,
  state,
});

export const downloadCertificate = format => ({
  type: ACTIONS_CONST.WS_DOWNLOAD_CERTIFICATE,
  format,
});

export const copyCertificate = format => ({
  type: ACTIONS_CONST.WS_COPY_CERTIFICATE,
  format,
});
