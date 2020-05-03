/**
 * @param  {} css
 */
export default css => {
  if (!css) {
    return null;
  }
  const tagId = 'conpass-custom-css';
  const customStyleTag = document.createElement('style');
  customStyleTag.setAttribute('id', tagId);

  if (!document.querySelector(`#${tagId}`)) {
    const targetTag = document.body;
    targetTag.appendChild(customStyleTag);
    customStyleTag.innerHTML = css;
  }

  return null;
};
