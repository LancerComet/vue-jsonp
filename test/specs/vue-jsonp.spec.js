import Vue from 'vue'
import VueJsonp from '../../'

describe('VueJsonp testing.', function () {
  this.timeout(5000)
  
  it('Vue-Jsonp should be loaded.', function () {
    Vue.use(VueJsonp)
    expect(Vue.jsonp).should.be.ok
  })

  it('Make a jsonp request.', function (done) {
    Vue.jsonp('http://live-api.bilibili.com/index/dynamic').then(result => {
      expect(result.code).equal(0)
      expect(result.msg).equal('ok')
      done()
    }, xhrObject => {
      done(xhrObject)
    })
  })

  it('Make a jsonp with custom querying and callback name.', function (done) {
    Vue.jsonp('http://live-api.bilibili.com/index/dynamic', {
      callbackQuery: 'callback',
      callbackName: 'func'
    }).then(result => {
      expect(result.code).equal(0)
      expect(result.msg).equal('ok')
      done()
    }, xhrObject => {
      done(xhrObject)
    })
  })
})
