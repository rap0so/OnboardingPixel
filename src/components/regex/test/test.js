var assert = require('assert');
var Regex = require('..');

describe('Regex', function() {
  describe('#test()', function() {
    it('should return true when have two * and valid url', function() {
      let r = new Regex('*.xunda.com.br/p/*/edit')
      let xxx = r.test('teste.xunda.com.br/p/123/edit')
      assert.equal(true, xxx);
    });

    it('should return false when have invalid url', function() {
      let r = new Regex('*.xunda.com.br/p/*/edit')
      let xxx = r.test('xxxxx')
      assert.equal(false, xxx);
    });

    describe('keruak', function () {
      it('should be true with ?', function () {
        let r = new Regex('app.keruak.com/?Financial#Home')
        let xxx = r.test('app.keruak.com/?Financial#Home')
        assert.equal(true, xxx);
      })

      it('should be true, when ends with * and ?', function () {
        let r = new Regex('app.keruak.com/*')
        let xxx = r.test('app.keruak.com/?Financial#Home')
        assert.equal(true, xxx);
      })
    })

    it('should Madis', function () {
      let a = '54.86.17.107/Madis/Pessoas/'
      let b = '54.86.17.107/Madis/Pessoas/Create'
      let r = new Regex(a)
      let xxx = r.test(b)
      assert.equal(false, xxx);
    })

    it('should Joao true with *', function () {
      let a = '*/agenda|*/contatos|*/comunicados'
      let b = 'http://localhost:3000/agenda'
      let r = new Regex(a)
      let xxx = r.test(b)
      assert.equal(true, xxx);
    })

    it('should Joao true', function () {
      let a = 'http://localhost:3000/agenda|http://localhost:3000/contatos|http://localhost:3000/comunicados'
      let b = 'http://localhost:3000/agenda'
      let r = new Regex(a)
      let xxx = r.test(b)
      assert.equal(true, xxx);
    })

    it('should Joao false', function () {
      let a = 'http://localhost:3000/agenda|http://localhost:3000/contatos|http://localhost:3000/comunicados'
      let b = 'http://localhost:3000/pessoas'
      let r = new Regex(a)
      let xxx = r.test(b)
      assert.equal(false, xxx);
    })
    
    describe('url has :', function () {
      it('should lvh', function () {
        let a = 'app.lvh.me'
        let b = 'app.lvh.me'
        let r = new Regex(a)
        let xxx = r.test(b)
        assert.equal(true, xxx);
      })
      
      it('should lvh with port', function () {
        let a = 'app.lvh.me'
        let b = 'app.lvh.me:3000'
        let r = new Regex(a)
        let xxx = r.test(b)
        assert.equal(false, xxx);
      })
      
      it('should lvh with port', function () {
        let a = 'app.lvh.me:3000'
        let b = 'app.lvh.me:3000'
        let r = new Regex(a)
        let xxx = r.test(b)
        assert.equal(true, xxx);
      })
      
      describe('with * on end' , function () {
        it('should lvh without port', function () {
          let a = 'app.lvh.me*'
          let b = 'app.lvh.me'
          let r = new Regex(a)
          let xxx = r.test(b)
          assert.equal(true, xxx);
        })
        
        it('should lvh with port', function () {
          let a = 'app.lvh.me*'
          let b = 'app.lvh.me:3000'
          let r = new Regex(a)
          let xxx = r.test(b)
          assert.equal(true, xxx);
        })
      })
    })

    describe('url has #', function () {
      it('should be true', function () {
        let r = new Regex('app.conpass.io/#/')
        let xxx = r.test('app.conpass.io/#/')
        assert.equal(true, xxx);
      })
    });
    
    it('should be true with *', function () {
      let r = new Regex('app.conpass.io/*')
      let xxx = r.test('app.conpass.io/#/')
      assert.equal(true, xxx);
    })

    it('should be true with * xunda', function () {
      let r = new Regex('app.conpass.io/*/xunda')
      let xxx = r.test('app.conpass.io/app/#/xunda')
      assert.equal(true, xxx);
    })

    it('should be true with app * xunda', function () {
      let r = new Regex('app.conpass.io/app/*/xunda')
      let xxx = r.test('app.conpass.io/app/#/xunda')
      assert.equal(true, xxx);
    })

    it('should Comunique-se 1', function () {
      let a = 'dev.comunique-se.com.br/#/activities'
      let b = 'dev.comunique-se.com.br/#/|dev.comunique-se.com.br/#/search'
      let r = new Regex(a)
      let xxx = r.test(b)
      assert.equal(false, xxx);
    })

    it('should Comunique-se 2', function () {
      let a = 'dev.comunique-se.com.br/#/activities'
      let b = 'dev.comunique-se.com.br/#/activities'
      let r = new Regex(a)
      let xxx = r.test(b)
      assert.equal(true, xxx);
    })

    it('should be true with underline "_"', function () {
      let r = new Regex('roihero.com.br/dashboard/controle_xml_')
      let xxx = r.test('www.roihero.com.br/dashboard/controle_xml_')
      assert.equal(true, xxx);
    })

    describe('Tests with and without bar', function () {
      it('Url without bar and flow with bar', function () {
        let r = new Regex('app.conpass.io/#/')
        let xxx = r.test('app.conpass.io/#')
        assert.equal(true, xxx);
      })

      it('Url with bar and flow without bar', function () {
        let r = new Regex('app.conpass.io/#')
        let xxx = r.test('app.conpass.io/#/')
        assert.equal(true, xxx);
      })
    });
    
  });
});
