import regExps from './reg_exps';

const error = (type) => {
  console.error(`Type '${type}' not founded`);
  return false;
};

const validator = (value, type) => {
  if (!type) {
    return error(type);
  }
  const valid = [];

  if (Array.isArray(type)) {
    for (let i = 0; i < type.length; i += 1) {
      if (!regExps[type[i]]) {
        return error(type[i]);
      }
      valid.push(regExps[type[i]].test(value));
    }
  } else {
    if (!regExps[type]) {
      return error(type);
    }
    valid.push(regExps[type].test(value));
  }

  return valid.indexOf(true) !== -1;
};

export default validator;
