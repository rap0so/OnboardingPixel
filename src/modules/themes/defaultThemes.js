const conpass = {
  btnPrimaryColor: '#d89003', // working
  btnBackColor: '#aaa', // working
  btnTextColor: '#ffffff', // working
  btnTextHoverColor: '', // working
  btnRadius: '0', // working

  fontPrimaryColor: '#555', // working

  overlayColor: '#000', // working
  overlayOpacity: 0.5, // working

  shadow: 'blur', // new property ['none', 'blur'] // working

  popover: {
    // background: '#fff', // working
    radius: 10 // working
    // fontColor: 'green' // working
  },
  modal: {
    // background: '#fff', // working
    headerBackground: '#12c1c7', // working
    headerFontColor: '#fff', // working
    radius: 10 // working
    // fontColor: 'yellow' // working
  }
};

const dark = {
  btnPrimaryColor: '#666',
  btnBackColor: 'transparent',
  btnTextColor: '#666',
  btnTextHoverColor: '#f00',
  btnRadius: '0',
  fontPrimaryColor: '#ddd',
  overlayColor: '#000000',
  overlayOpacity: 0.75,
  popover: {
    background: '#222'
  },
  modal: {
    background: '#222',
    headerBackground: '#000'
  },
  shadow: 'blur' // new property
};

const light = {
  btnPrimaryColor: '#999',
  btnBackColor: '#ccc',
  btnTextColor: '#222',
  btnTextHoverColor: '#f00',
  btnRadius: '0',
  fontPrimaryColor: '#222',
  overlayColor: '#fff',
  overlayOpacity: 0.75,
  popover: {
    background: '#fff'
  },
  modal: {
    background: '#fff'
  },
  shadow: 'blur' // new property
};

export { light, dark, conpass };
