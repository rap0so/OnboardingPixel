import { init } from '../modules';

describe('<conpass>', () => {
  let conpassTag;

  beforeEach(() => {
    conpassTag = document.createElement('conpass');
    conpassTag.id = 'conpass-tag';
  });

  it('creates tag <conpass id="conpass-tag">', () => {
    const tag = init.createConpassTag('conpass-tag');
    expect(tag).toEqual(conpassTag);
  });

  it('injects <conpass> only once', () => {
    init.injectConpassTag(conpassTag, document.body);
    init.injectConpassTag(conpassTag, document.body);
    const conpassTags = document.body.querySelectorAll('conpass');
    expect(conpassTags.length).toBe(1);
  });

  it('injects <conpass> as <body> first child', () => {
    init.injectConpassTag(conpassTag, document.body);
    expect(document.body.firstChild).toEqual(conpassTag);
  });
});

describe('window.Conpass', () => {
  it('is in the window object', () => {
    window.Conpass = init.externalAPI;
    expect(window.Conpass).toBeTruthy();
  });
});

describe('MutationObserver', () => {
  xit('calls a method when url and DOM changes', () => {
    const callbackMethod = jest.fn();

    init.createObserver(document.body, callbackMethod);

    window.history.pushState({ foo: 'bar' }, 'page 2', 'bar.html');

    const newElement = document.createElement('div');
    newElement.innerHTML = 'This is a new DOM element';
    document.body.appendChild(newElement);

    expect(callbackMethod).toBeCalled();
  });
  // it('calls a method once when url and DOM changes', () => {

  // });
  // it('does not call any method when url and DOM does not change', () => {

  // });
  // it('does not call any method when url changes but DOM does not', () => {

  // });
  // it('does not call any method when url does not change but DOM does', () => {

  // });
});
