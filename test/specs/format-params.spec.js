describe('Param format testing.', function () {
  it('Should format params correctly - simple.', function () {
    var dateNow = Date.now()
    var result = createQueryStr({
      callbackQuery: 'callback',
      callbackName: 'func',
      date: dateNow
    })

    var expected = 'callbackQuery=callback&callbackName=func&date=' + dateNow
    expect(decodeURIComponent(result)).equal(expected)
  })

  it('Should format params correctly - complex.', function () {
    var result = createQueryStr({
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
      }
    })

    var expected = 'callbackQuery=callback&callbackName=func&source=testing&info[name]=LancerComet&info[age]=27&info[address][]=Beijing&info[address][]=NewYork&info[score][math]=10&info[score][english]=100&info[something][one][]=1&info[something][one][]=2&info[something][one][][wow]=true&info[something][two][wow]=false&info[something][two][three][]=1&info[something][two][three][]=2&info[something][two][three][]=3'

    expect(decodeURIComponent(result)).equal(expected)
  })
})

function createQueryStr (param) {
  var querys = []
  Object.keys(param).forEach(function (keyName) {
    querys.push(formatParams(keyName, param[keyName]))
  })
  return flatten(querys).join('&')
}

/**
 * Format params into querying string.
 * @param {{}}
 * @return {string[]}
 */
function formatParams (queryName, value) {
  queryName = queryName.replace(/=/g, '')
  var result = []

  switch (value.constructor) {
    case String:
    case Number:
    case Boolean:
      result.push(encodeURIComponent(queryName) + '=' + encodeURIComponent(value))
      break

    case Array:
      value.forEach(function (item) {
        result = result.concat(formatParams(queryName + '[]=', item))
      })
      break

    case Object:
      Object.keys(value).forEach(function (key) {
        var item = value[key]
        result = result.concat(formatParams(queryName + '[' + key + ']', item))
      })
      break
  }

  return result
}

/**
 * Flat querys.
 *
 * @param {any} array
 * @returns
 */
function flatten (array) {
  var querys = []
  array.forEach(function (item) {
    if (typeof item === 'string') {
      querys.push(item)
    } else {
      querys = querys.concat(flatten(item))
    }
  })
  return querys
}
