import VueJsonp from '../index'
Vue.use(VueJsonp)

const TestComponent = Vue.extend({
  data () {
    return {}
  },

  methods: {
    getDynamic () {
      this.$jsonp('http://live-api.bilibili.com/index/dynamic', {
        name: 'MyName',
        age: 20
      }).then(json => {
        console.log('JSONP Request success: ', json)
      }, json => {
        console.log('JSONP Request failed: ', json)
      })
    }
  },

  ready () {
    console.log('ready')
    this.getDynamic()
  }
})

Vue.component('test-component', TestComponent)

const RootComponent = new Vue({
  el: 'body'
})
