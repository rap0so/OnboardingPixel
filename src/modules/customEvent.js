export default (name, detail = {}) => {
  const event = new CustomEvent(name, {
    detail,
    bubbles: true,
    cancelable: true
  });

  document.dispatchEvent(event);
};
