;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Index = factory();
  }
}(this, function() {
/**
 * Vue Jsonp By LancerComet at 16:35, 2016.10.17.
 * # Carry Your World #
 * 
 * @author: LancerComet
 * @license: MIT
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

    // Remove callbackQuery and callbackName.
    delete params.callbackQuery
    delete params.callbackName

    // Convert params to querying str.
    var queryStr = formatParams(params)

    // Timeout timer.
    var timeoutTimer = null
  
    // Setup timeout.
    if (typeof timeout === 'number') {
      timeoutTimer = setTimeout(function () {
        removeErrorListener()        
        headNode.removeChild(paddingScript)
        delete window[callbackName]
        reject({ statusText: 'Request Timeout', status: 408 })
      }, timeout)
    }
  
    // Create global function.
    window[callbackName] = function (json) {
      clearTimeout(timeoutTimer)
      removeErrorListener()   
      headNode.removeChild(paddingScript)
      resolve(json)
      delete window[callbackName]
    }

    // Create script element.
    var headNode = document.querySelector('head')
    var paddingScript = document.createElement('script')

    // Add error listener.
    paddingScript.addEventListener('error', onError)

    // Append to head element.
    paddingScript.src = url + (/\?/.test(url) ? '&' : '?') + queryStr
    headNode.appendChild(paddingScript)

    /**
     * Padding script on-error event.
     * @param {Event} event
     */
    function onError (event) {
      removeErrorListener()
      reject({
        status: 400,
        statusText: 'Bad Request'
      })
    }

    /**
     * Remove on-error event listener.
     */
    function removeErrorListener () {
      paddingScript.removeEventListener('error', onError)
    }
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

return vueJsonp;
}));
