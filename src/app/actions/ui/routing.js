import { ACTIONS_CONST } from '../../constants';

export const push = path => ({
  type: ACTIONS_CONST.ROUTING_PUSH,
  path,
});

export const back = () => ({
  type: ACTIONS_CONST.ROUTING_BACK,
});
