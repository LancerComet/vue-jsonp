/**
 * Vue Jsonp.
 * # Carry Your World #
 *
 * @author: LancerComet
 * @license: MIT
 */

import Vue from 'vue'
import { PluginObject } from 'vue/types/plugin'
import { flatten, formatParams, randomStr } from './utils'

const DEFAULT_TIMEOUT: number = 5000

declare module 'vue/types/vue' {
  // tslint:disable-next-line:interface-name
  interface Vue {
    $jsonp: typeof jsonp
  }
}

/**
 * JSONP Vue plugin.
 *
 * @example
 * Vue.use(VueJsonp)
 */
// tslint:disable-next-line:variable-name
const VueJsonp: PluginObject<never> = {
  install (V: typeof Vue) {
    V.prototype.$jsonp = jsonp
  }
}

/**
 * Make a json request.
 *
 * @template T
 * @param {string} url Target URL address.
 * @param {IJsonpParam} [param={}] Querying params object.
 * @param {number} [timeout] Timeout setting (ms).
 * @returns {Promise<T>}
 *
 * @example
 * const data = await jsonp<string>('/url', {
 *   type: 'admin',
 *   date: '2020'
 * })
 */
function jsonp<T = any> (url: string, param?: IJsonpParam, timeout?: number): Promise<T>
function jsonp<T = any> (url: string, param?: IJsonpParam, config?: IConfig): Promise<T>
function jsonp<T = any> (
  url: string,
  param: IJsonpParam = {},
  config?: undefined | number | IConfig
): Promise<T> {
  if (typeof url !== 'string') {
    throw new Error('[Vue-jsonp] Type of param "url" is not string.')
  }

  if (typeof param !== 'object' || !param) {
    throw new Error('[Vue-jsonp] Invalid params, should be an object.')
  }

  const timeout = typeof config === 'number'
    ? config
    : config?.timeout ?? DEFAULT_TIMEOUT

  let arrayIndicator = '[]'
  if (typeof config === 'object') {
    const _indicator = config.arrayIndicator
    if (typeof _indicator === 'string') {
      arrayIndicator = _indicator
    }
  }

  return new Promise<T>((resolve, reject) => {
    const callbackQuery = typeof param.callbackQuery === 'string'
      ? param.callbackQuery
      : 'callback'
    const callbackName = typeof param.callbackName === 'string'
      ? param.callbackName
      : 'jsonp_' + randomStr()

    param[callbackQuery] = callbackName

    // Remove callbackQuery and callbackName.
    delete param.callbackQuery
    delete param.callbackName

    // Convert params to querying str.
    let queryStrs: (string[])[] = []
    Object.keys(param).forEach(queryKey => {
      queryStrs = queryStrs.concat(formatParams(queryKey, param[queryKey], arrayIndicator))
    })

    const queryStr = flatten(queryStrs).join('&')

    const onError = () => {
      removeErrorListener()
      clearTimeout(timeoutTimer)
      reject({
        status: 400,
        statusText: 'Bad Request'
      })
    }

    const removeErrorListener = () => {
      paddingScript.removeEventListener('error', onError)
    }

    const removeScript = () => {
      document.body.removeChild(paddingScript)
      delete window[callbackName]
    }

    // Timeout timer.
    let timeoutTimer = null

    // Setup timeout.
    if (timeout > -1) {
      timeoutTimer = setTimeout(() => {
        removeErrorListener()
        removeScript()
        reject({
          statusText: 'Request Timeout',
          status: 408
        })
      }, timeout)
    }

    // Create global function.
    window[callbackName] = (json: T) => {
      clearTimeout(timeoutTimer)
      removeErrorListener()
      removeScript()
      resolve(json)
    }

    // Create script element.
    const paddingScript = document.createElement('script')

    // Add error listener.
    paddingScript.addEventListener('error', onError)

    // Append to head element.
    paddingScript.src = url + (/\?/.test(url) ? '&' : '?') + queryStr
    document.body.appendChild(paddingScript)
  })
}

export {
  VueJsonp,
  jsonp
}

/**
 * JSONP parameter declaration.
 */
interface IJsonpParam {
  /**
   * Callback query name.
   * This param is used to define the query name of the callback function.
   *
   * @example
   * // The request url will be "/some-url?myCallback=jsonp_func&myCustomUrlParam=veryNice"
   * const result = await jsonp('/some-url', {
   *   callbackQuery: 'myCallback',
   *   callbackName: 'jsonp_func',
   *   myCustomUrlParam: 'veryNice'
   * })
   *
   * @default callback
   */
  callbackQuery?: string

  /**
   * Callback function name.
   * This param is used to define the jsonp function name.
   *
   * @example
   * // The request url will be "/some-url?myCallback=jsonp_func&myCustomUrlParam=veryNice"
   * const result = await jsonp('/some-url', {
   *   callbackQuery: 'myCallback',
   *   callbackName: 'jsonp_func',
   *   myCustomUrlParam: 'veryNice'
   * })
   *
   * @default jsonp_ + randomStr()
   */
  callbackName?: string

  /**
   * Custom data.
   */
  [key: string]: any
}

/**
 * JSONP Config.
 */
interface IConfig {
  /**
   * Request timeout, ms.
   *
   * @default 5000
   */
  timeout?: number

  /**
   * This is the indicator that used in query string to indicate arrays.
   *
   * @example
   * // When you pass a '[]' or nothing:
   * a[]=1&a[]=2&a[]=3  // This form is used widely.
   *
   * // An empty sring was passed:
   * a=1&a=2&a=3  // This is a custom example.
   *
   * @default '[]'
   */
  arrayIndicator?: string
}
