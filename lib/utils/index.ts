/**
 * Generate random string.
 *
 * @return { string }
 */
function randomStr () {
  return (Math.floor(Math.random() * 100000) * Date.now()).toString(16)
}

/**
 * Format params into querying string.
 *
 * @return {string[]}
 */
function formatParams (queryKey: string, value: any): string[] {
  queryKey = queryKey.replace(/=/g, '')
  let result: string[] = []

  switch (value && value.constructor) {
    case String:
    case Number:
    case Boolean:
      result.push(encodeURIComponent(queryKey) + '=' + encodeURIComponent(value))
      break

    case Array:
      value.forEach(function (item) {
        result = result.concat(formatParams(queryKey + '[]=', item))
      })
      break

    case Object:
      Object.keys(value).forEach(function (key) {
        const item = value[key]
        result = result.concat(formatParams(queryKey + '[' + key + ']', item))
      })
      break
  }

  return result
}

/**
 * Flat querys.
 *
 * @param {string[] | (string[])[]} array
 * @returns
 */
function flatten (array: string[] | (string[])[]): string[] {
  let querys = []
  array.forEach(item => {
    if (typeof item === 'string') {
      querys.push(item)
    } else {
      querys = querys.concat(flatten(item))
    }
  })
  return querys
}

export {
  formatParams,
  flatten,
  randomStr
}
