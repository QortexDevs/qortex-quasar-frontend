import { createPinia } from 'pinia'
import { store } from 'quasar/wrappers'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia()

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia
})

export function byField (field, getData = s => s.data) { return state => Object.fromEntries(getData(state).map(r => [r[field], r])) }
export const byId = byField('id')

export function arrayByField (field, getData = s => s.data) {
  return state => {
    const res = {}
    getData(state).forEach(r => {
      if (res[r[field]] === undefined) { res[r[field]] = [] }
      res[r[field]].push(r)
    })

    return res
  }
}
