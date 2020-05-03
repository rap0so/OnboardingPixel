/* eslint-disable */

class PseudoStyler {
  constructor() {
    this.styles = [];
    this.uniqueID = 0;
    this.registered = new WeakMap();
  }

  loadDocumentStyles() {
    const count = document.styleSheets.length;
    for (let i = 0; i < count; i += 1) {
      const sheet = document.styleSheets[i];
      if (sheet.href) {
        this.addLink(sheet.href);
      } else if (
        sheet.ownerNode &&
        sheet.ownerNode.nodeName &&
        sheet.ownerNode.nodeName === 'STYLE' &&
        sheet.ownerNode.firstChild
      ) {
        this.addCSS(sheet.ownerNode.firstChild.textContent);
      }
    }
  }

  addCSS(text) {
    const copySheet = document.createElement('style');
    copySheet.type = 'text/css';
    copySheet.textContent = text;
    document.head.appendChild(copySheet);
    for (let i = 0; i < copySheet.sheet.cssRules.length; i += 1) {
      if (
        copySheet.sheet.cssRules[i].selectorText &&
        copySheet.sheet.cssRules[i].selectorText.includes(':')
      ) {
        this.styles.push(copySheet.sheet.cssRules[i]);
      }
    }
    document.head.removeChild(copySheet);
  }

  addLink(url) {
    const self = this;
    new Promise((resolve, reject) => {
      fetch(url, { mode: 'no-cors' })
        .then(res => res.text())
        .then(res => {
          self.addCSS(res);
          resolve(self.styles);
        })
        .catch(err => reject(err));
    });
  }

  matches(element, selector, pseudoClass) {
    const newSelector = selector.replace(new RegExp(pseudoClass, 'g'), '');
    for (let part of newSelector.split(/ +/)) {
      try {
        if (element && element.matches(part)) {
          return true;
        }
      } catch (ignored) {
        // reached a non-selector part such as '>'
      }
    }
    return false;
  }

  register(element, pseudoclass) {
    const uuid = this.uniqueID + 1;
    const customClasses = {};
    for (let style of this.styles) {
      if (style.selectorText.includes(pseudoclass)) {
        style.selectorText
          .split(/\s*,\s*/g)
          .filter(selector => this.matches(element, selector, pseudoclass))
          .forEach(selector => {
            let newSelector = this._getCustomSelector(
              selector,
              pseudoclass,
              uuid
            );
            customClasses[newSelector] += style.style.cssText
              .split(/\s*;\s*/)
              .map(rule => (rule && !rule.includes('!important') ? `${rule} !important` : rule) || '')
              .join(';');
            customClasses[newSelector] = customClasses[newSelector].replace(/undefined/g, '');
          });
      }
    }

    if (!this.style) {
      this._createStyleElement();
    }
    for (const selector in customClasses) {
      const cssClass = selector + ' { ' + customClasses[selector] + ' }';
      this.style.sheet.insertRule(cssClass);
    }

    this.registered.get(element).set(pseudoclass, uuid);
  }

  deregister(element, pseudoClass) {
    if (
      this.registered.has(element) &&
      this.registered.get(element).has(pseudoClass)
    ) {
      const uuid = this.registered.get(element).get(pseudoClass);
      const className = this._getMimicClassName(pseudoClass, uuid);
      const regex = new RegExp(`${className} ($|\\W)`);
      for (let i = 0; i < this.style.sheet.cssRules.length; i += 1) {
        if (regex.test(this.style.sheet.cssRules[i].selectorText)) {
          this.style.sheet.deleteRule(i);
        }
      }
      this.registered.get(element).delete(pseudoClass);
      element.classList.remove(className.substr(1));
    }
  }

  addStyle(element, pseudoclass, force) {
    if (!this.registered.has(element)) {
      this.registered.set(element, new Map());
    }
    if (!this.registered.get(element).has(pseudoclass)) {
      this.register(element, pseudoclass);
    }
    const uuid = this.registered.get(element).get(pseudoclass);
    element.classList.add(
      this._getMimicClassName(pseudoclass, uuid).substr(1),
      force
    );
  }

  removeStyle(element, pseudoclass, force) {
    if (!this.registered.has(element)) {
      this.registered.set(element, new Map());
    }
    if (!this.registered.get(element).has(pseudoclass)) {
      this.register(element, pseudoclass);
    }
    const uuid = this.registered.get(element).get(pseudoclass);
    element.classList.remove(
      this._getMimicClassName(pseudoclass, uuid).substr(1),
      force
    );
  }

  toggleStyle(element, pseudoclass, force) {
    if (!this.registered.has(element)) {
      this.registered.set(element, new Map());
    }
    if (!this.registered.get(element).has(pseudoclass)) {
      this.register(element, pseudoclass);
    }
    const uuid = this.registered.get(element).get(pseudoclass);
    element.classList.toggle(
      this._getMimicClassName(pseudoclass, uuid).substr(1),
      force
    );
  }

  _getMimicClassName(pseudoClass, uuid) {
    return pseudoClass.replace(':', '.') + '-pseudostyler-' + uuid;
  }

  _getCustomSelector(selectorText, pseudoClass, uuid) {
    return selectorText.replace(
      new RegExp(pseudoClass, 'g'),
      this._getMimicClassName(pseudoClass, uuid)
    );
  }

  _createStyleElement() {
    const style = document.createElement('style');
    style.type = 'text/css';
    document.head.appendChild(style);
    this.style = style;
  }
}

export default PseudoStyler;
