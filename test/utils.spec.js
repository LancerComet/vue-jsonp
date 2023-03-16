require('expect-puppeteer')
const { flatten, formatParams } = require('../lib/utils')

describe('Utils test.', () => {
  it('Should format params correctly - simple.', () => {
    const dateNow = Date.now()
    const result = createQueryStr({
      callbackQuery: 'callback',
      callbackName: 'func',
      date: dateNow
    })
    const expected = 'callbackQuery=callback&callbackName=func&date=' + dateNow
    expect(decodeURIComponent(result)).toBe(expected)
  })

  it('Should format params correctly - complex.', () => {
    const result = createQueryStr({
      callbackQuery: 'callback',
      callbackName: 'func',
      source: 'testing',
      info: {
        name: 'LancerComet',
        age: 27,
        address: ['Beijing', 'NewYork'],
        score: {
          math: 10,
          english: 100
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
    const expected = 'callbackQuery=callback&callbackName=func&source=testing&info[name]=LancerComet&info[age]=27&info[address][]=Beijing&info[address][]=NewYork&info[score][math]=10&info[score][english]=100&info[something][one][]=1&info[something][one][]=2&info[something][one][][wow]=true&info[something][two][wow]=false&info[something][two][three][]=1&info[something][two][three][]=2&info[something][two][three][]=3'
    expect(decodeURIComponent(result)).toBe(expected)
  })

  it('Should format params correctly - from issue.', () => {
    const self = {
      email: 'mail@hotmail.com',
      first_name: 'FirstName',
      last_name: 'LastName'
    }
    const result = createQueryStr({
      EMAIL: self.email,
      FNAME: self.first_name,
      LNAME: self.last_name
    })

    const expected = 'EMAIL=' + self.email + '&FNAME=' + self.first_name + '&LNAME=' + self.last_name
    expect(decodeURIComponent(result)).toBe(expected)
  })

  it('Array separator should be configurable.', () => {
    const result = createQueryStr({
      a: 'a',
      b: ['1', '2', '3'],
      c: {
        d: 'd',
        e: [1, 2, { wow: true }]
      }
    }, '')
    const expected = 'a=a&b=1&b=2&b=3&c[d]=d&c[e]=1&c[e]=2&c[e][wow]=true'
    expect(decodeURIComponent(result)).toBe(expected)
  })
})

function createQueryStr (param, arraySeprator) {
  const querys = []
  Object.keys(param).forEach(keyName => {
    querys.push(formatParams(keyName, param[keyName], arraySeprator))
  })
  return flatten(querys).join('&')
}
