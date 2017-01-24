# Vue-jsonp

![Travis](https://travis-ci.org/LancerComet/vue-jsonp.svg?branch=master)

A tiny library for handling JSONP request.

## Usage.

Static function: 
`Vue.jsonp(url, dataObj, timeout)`

In Vue component: 
`this.$jsonp(url, dataObj, timeout)`

## Params.
 - url: Target url for request.
 - dataObj: Object contains datas for querying.
 - timeout: Timeout for jsonp request.

## URL.
```javascript
'/url?{callbackQuery}={callbackName}&...'

// Default:
'/url?callback=jsonp_RANDOM_STRING&...'
``` 

## Assign callback query name.
```javascript
this.$jsonp('/url', {
  callbackQuery: 'cb'  // Default: callback
})

// Then URL will be: '/url?cb=jsonp_aws84739ssu8e3'
```

## Assign callback function name.
```javascript
this.$jsonp('/url', {
  callbackName: 'jsonpFunc'
})

// Then URL will be: '/url?callback=jsonpFunc'
```

## Example.
```javascript
import Vue from 'vue'
import VueJsonp from 'vue-jsonp'
Vue.use(VueJsonp)

// If you want to setup the global timeout, just:
Vue.use(VueJsonp, 5000)
// Now all requests will be expired after 5000ms.

// Use it in Vue Component.
const SomeComponent = Vue.extend({
  methods: {
    getData () {
      this.$jsonp('http://www.some-site.com/data', { name: 'MyName', age: 20 }).then(json => {
        // Success.
      }).catch(err => {
        // Failed.
      })
    }
  }
})

// Static Function.
// Request url will be 'http://www.some-site.com/data?name=MyName&age=20&cb=jsonpFunc'
Vue.jsonp('http://www.some-site.com/data', {
  name: 'MyName', age: 20, callbackQuery: 'cb', callbackName: 'jsonpFunc'
}).then(json => {
  // Success.
}).catch(err => {
  // Failed.
})
```
## License
MIT.
