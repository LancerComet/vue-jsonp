require('expect-puppeteer')
const path = require('path')

describe('VueJsonp testing.', () => {
  it('Make a jsonp request.', async () => {
    await page.addScriptTag({
      path: path.resolve(__dirname, '../dist/index.js')
    })

    await page.addScriptTag({
      path: path.resolve(__dirname, '../node_modules/vue/dist/vue.min.js')
    })

    const result = await page.evaluate(async () => {
      Vue.use(VueJsonp.VueJsonp)

      const vm = new Vue()
      const isPluginInstalled = typeof vm.$jsonp === 'function'

      const jsonpResult = await VueJsonp.jsonp('https://static.lancercomet.com/lancercomet/misc/vue-jsonp-test-01.js', {
        callbackQuery: 'callback',
        callbackName: 'jsonp_callback'
      })

      return {
        isPluginInstalled,
        jsonpResult
      }
    })

    expect(result.isPluginInstalled).toBe(true)
    expect(result.jsonpResult).toEqual({
      data: {
        name: 'John Smith',
        age: 100
      },
      code: 0,
      message: 'OK'
    })
  })
})
