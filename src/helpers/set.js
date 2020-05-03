function setProp(object, keys, val) {
  try {
    const parsedKeys = Array.isArray(keys) ? keys : keys.split('.');
    const parsedObject = object;
    if (parsedKeys.length) {
      parsedObject[parsedKeys[0]] = parsedObject[parsedKeys[0]] || {};
      return setProp(parsedObject[parsedKeys[0]], parsedKeys.slice(1), val);
    }
    parsedObject[parsedKeys[0]] = val;
    return true;
  } catch (error) {
    return false;
  }
}

export default setProp;
