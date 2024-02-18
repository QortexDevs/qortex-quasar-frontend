import { boot } from 'quasar/wrappers'

import { delay } from 'services/support'
import { useSessionStore } from 'stores/session'
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ router }) => {
  const sessionStore = useSessionStore()
  const bootPromise = sessionStore.boot()

  if (sessionStore.loading) {
    Promise.all([bootPromise, delay(1000)]).then(() =>
      router.replace(sessionStore.redirect ?? { name: 'home' })
    )
  }
})
