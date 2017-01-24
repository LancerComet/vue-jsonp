/**
 * Vue Jsonp By LancerComet at 16:35, 2016.10.17.
 * # Carry Your World #
 * License MIT.
 */
var _timeout = null

var vueJsonp = {
  install: function (Vue, options) {
    Vue.jsonp = jsonp
    Vue.prototype.$jsonp = jsonp

    if (typeof options === 'number') {
      _timeout = options
    }
  }
}

/**
 * JSONP function.
 * @param { String } url Target URL address.
 * @param { Object } params Querying params object.
 * @param { Number } timeout Timeout setting (ms).
 * 
 * @example
 *   Vue.jsonp('/url', {
 *     callbackQuery: ''
 *     callbackName: '',
 *     name: 'LancerComet',
 *     age: 26
 *   }, 1000)
 */
function jsonp (url, params, timeout) {
  params = params || {}
  timeout = timeout || _timeout

  return new Promise(function (resolve, reject) {
    if (Object.prototype.toString.call(url) !== '[object String]') {
      throw new Error('[Vue.jsonp] Type of param "url" is not string.')
    }

    var callbackQuery = params.callbackQuery || 'callback'
    var callbackName = params.callbackName || 'jsonp_' + randomStr()

    params[callbackQuery] = callbackName

    delete params.callbackQuery
    delete params.callbackName

    // Convert params to querying str.
    var queryStr = formatParams(params)
  
    // Setup timeout.
    if (typeof timeout === 'number') {
      var timer = setTimeout(function () {
        clearTimeout(timer)
        headNode.removeChild(paddingScript)        
        delete window[callbackName]
        reject({ statusText: 'Request Timeout', status: 408 })
      }, timeout)
    }
  
    // Create global function.
    window[callbackName] = function (json) {
      clearTimeout(timer)      
      headNode.removeChild(paddingScript)
      delete window[callbackName]
      resolve(json)
    }

    // Create script element.
    var headNode = document.querySelector('head')
    var paddingScript = document.createElement('script')
    paddingScript.src = url + /\?/.test(url) ? '&' : '?' + queryStr
    headNode.appendChild(paddingScript)
  })

}

/**
 * Generate random string.
 * @return { String }
 */
function randomStr () {
  return (Math.floor(Math.random() * 100000) * Date.now()).toString(16)
}

/**
 * Format params into querying string.
 * @param { Object }
 * @return { String }
 */
function formatParams (param) {
  var arr = []
  Object.keys(param).forEach(function (name) {
    arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(param[name]))
  })
  return arr.join('&')
}
