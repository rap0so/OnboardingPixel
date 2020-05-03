function getProp(object, keys, defaultVal) {
  try {
    const parsedKeys = Array.isArray(keys) ? keys : keys.split('.');
    const parsedObject = object[parsedKeys[0]];
    if (parsedObject && parsedKeys.length > 1) {
      return getProp(parsedObject, parsedKeys.slice(1), defaultVal);
    }
    return parsedObject === undefined ? defaultVal : parsedObject;
  } catch (error) {
    return {};
  }
}

export default getProp;
