import { boot } from 'quasar/wrappers'

import { useSessionStore } from 'stores/session'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ router }) => {
  const sessionStore = useSessionStore()

  router.beforeEach(async (to, _from, next) => {
    const authorized = sessionStore.authorized
    const loading = sessionStore.loading

    const requiresAuth = to.matched.reduce((acc, record) => record.meta.requiresAuth ?? acc, false)

    let route
    if (loading && to.name !== 'loading') {
      route = { name: 'loading' }
      sessionStore.redirect = { name: to.name, path: to.fullPath, params: to.params }
    } else if (to.name !== 'login' && requiresAuth && !authorized) {
      route = { name: 'login' }
      sessionStore.redirect = { name: to.name, path: to.fullPath, params: to.params }
    } else if (to.name === 'login' && authorized) {
      route = { name: 'home' }
    }

    next(route)
  })
})
