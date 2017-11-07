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


  it('Make a jsonp request with complex param.', function (done) {
    Vue.jsonp('http://api.live.bilibili.com/index/dynamic', {
      callbackQuery: 'callback',
      callbackName: 'func',
      source: 'testing',
      info: {
        name: 'LancerComet',
        age: 27,
        address: ['Beijing', 'NewYork'],
        score: {
          math: 10,
          english: 100,
        },
        something: {
          one: [1, 2, { wow: true }],
          two: {
            wow: false,
            three: [1, 2, 3]
          }
        }
      },
    }).then(result => {
      // console.log(result)
      try {
        expect(result.code).equal(0)
        expect(result.msg).equal('ok')
        done()
      } catch (tryErr) {
        done(tryErr)
      }
    }).catch(error => {
      console.error('Request failed when making complex request: ', error)
      done(error)
    })
  })
})
