import { ACTIONS_CONST } from '../../constants';

export const error = (data, action) => ({
  type: ACTIONS_CONST.ERROR,
  data,
  action,
});
