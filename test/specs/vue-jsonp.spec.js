import Vue from 'vue'
import VueJsonp from '../../dist/vue-jsonp.umd'

describe('VueJsonp testing.', function () {
  this.timeout(5000)

  before(function () {
    Vue.use(VueJsonp, 5000)
  })
  
  it('Vue-Jsonp should be loaded.', function () {
    expect(Vue.jsonp).should.be.ok
  })

  it('Make a jsonp request.', function (done) {
    Vue.jsonp('http://api.live.bilibili.com/index/dynamic').then(result => {
      // console.log(result)
      try {
        expect(result.code).equal(0)
        expect(result.msg).equal('ok')
        done()        
      } catch (tryErr) {
        done(tryErr)
      }
    }).catch(xhrObject => {
      done(xhrObject)
    })
  })

  it('Make a jsonp with custom querying and callback name.', function (done) {
    Vue.jsonp('http://api.live.bilibili.com/index/dynamic', {
      callbackQuery: 'callback',
      callbackName: 'func',
      source: 'testing'
    }).then(result => {
      // console.log(result)
      try {
        expect(result.code).equal(0)
        expect(result.msg).equal('ok')
        done()        
      } catch (tryErr) {
        done(tryErr)
      }
    }).catch(xhrObject => {
      done(xhrObject)
    })
  })

  it('Make a jsonp with existing querying params in url.', function (done) {
    Vue.jsonp('http://api.live.bilibili.com/index/dynamic?name=LancerComet', {
      callbackQuery: 'callback',
      callbackName: 'func',
      source: 'testing'
    }).then(result => {
      // console.log(result)
      try {
        expect(result.code).equal(0)
        expect(result.msg).equal('ok')
        done()        
      } catch (tryErr) {
        done(tryErr)
      }
    }).catch(xhrObject => {
      done(xhrObject)
    })
  })
  
  it('Make 10 requests every 100ms.', function (done) {
    let count = 0
    let interval = setInterval(function () {
      // console.log(`Request ${count}`)
      if (count >= 10) {
        clearInterval(interval)
        done()
        return
      }
      Vue.jsonp('http://api.live.bilibili.com/index/dynamic?name=LancerComet', {
        callbackQuery: 'callback',
        callbackName: 'func',
        source: 'testing'
      }).then(result => {
        try {
          expect(result.code).equal(0)
          expect(result.msg).equal('ok')
        } catch (tryErr) {
          done(tryErr)
        }
      }).catch(xhrObject => {
        done(xhrObject)
      })
      count++
    }, 100)
  })

  it('Should give an expired error.', function (done) {
    Vue.jsonp('http://api.live.bilibili.com/index/dynamic?name=LancerComet', { source: 'testing' }, 1)
      .then(result => {
        // Should't go there.
        done(1)
      }).catch(err => {
        done(0)
      })
  })

  it('Should give an error.', function (done) {
    Vue.jsonp('https://www.some-link-does-not-exist.com')
      .then(result => {
        // Should't go there.
        done(1)
      })
      .catch(err => {
        done(0)
      })
  })
})
