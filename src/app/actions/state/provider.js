import { ACTIONS_CONST } from '../../constants';

export const add = result => ({
  type: ACTIONS_CONST.PROVIDER_ADD,
  result,
});

export const updateProviders = result => ({
  type: ACTIONS_CONST.PROVIDERS_UPDATE,
  result,
});

export const select = id => ({
  type: ACTIONS_CONST.PROVIDER_SELECT,
  id,
});
