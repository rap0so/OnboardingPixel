const injectConpassTag = (conpassTag, parentNode) => {
  if (!document.body.querySelector('conpass')) {
    parentNode.prepend(conpassTag);
  }
};

export default injectConpassTag;
