"use strict"
module.exports = class Regex {

  constructor(url) {
    this.suffix = ''
    if ( !url.endsWith('*') ) {
      this.suffix = '$'
    }
    this.url = url.replace(/\*/g, '[^+]{0,}')
    this.url = this.url.replace(/\?/g, '\\?')
    this.url = this.url.replace(/\/$/g, '')
  }

  test(test_url) {
    return RegExp(this.url + this.suffix, "i").test(test_url.replace(/\/$/g, ''))
  }

  log() {
    console.log(this.url + this.suffix);
  }
}
