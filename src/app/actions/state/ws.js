import { ACTIONS_CONST } from '../../constants';

export const createRequest = data => ({
  type: ACTIONS_CONST.WS_CREATE_REQUEST,
  data,
});

export const importItem = data => ({
  type: ACTIONS_CONST.WS_IMPORT_ITEM,
  data,
});

export const getCertificates = () => ({
  type: ACTIONS_CONST.WS_GET_CERTIFICATES,
});

export const removeItem = () => ({
  type: ACTIONS_CONST.WS_REMOVE_ITEM,
});

export const status = state => ({
  type: ACTIONS_CONST.WS_STATUS,
  state,
});

export const downloadItem = format => ({
  type: ACTIONS_CONST.WS_DOWNLOAD_ITEM,
  format,
});

export const copyCertificate = format => ({
  type: ACTIONS_CONST.WS_COPY_CERTIFICATE,
  format,
});

export const getProviders = () => ({
  type: ACTIONS_CONST.WS_GET_PROVIDERS,
});

export const login = id => ({
  type: ACTIONS_CONST.WS_LOGIN,
  id,
});

export const onListening = () => ({
  type: ACTIONS_CONST.WS_ON_LISTENING,
});
