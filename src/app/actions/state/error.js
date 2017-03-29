import { ACTIONS_CONST } from '../../constants';

export const error = data => ({
  type: ACTIONS_CONST.ERROR,
  data,
});
