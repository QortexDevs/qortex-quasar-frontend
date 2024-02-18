import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import { computed, ref } from 'vue'

import { applyApiKey, clearApiKey } from 'services/api/auth'
import { delay } from 'services/support'

const commonReferences = []
const userDependentReferences = []

export const useSessionStore = defineStore('session', () => {
  const loading = ref(true)
  const params = ref({})
  const token = ref(undefined)
  const user = ref({})
  const redirect = ref(undefined)

  const authorized = computed(() => token.value !== undefined)

  async function boot () {
    setParams()

    const localToken = getToken()
    if (localToken) {
      await setToken(localToken)
    }

    if (authorized.value) {
      await loadUser()
      await loadReferences()
    }

    loading.value = false
  }

  async function setParams (withRemove = true) {
    if (window.location.search) {
      const url = new URL(window.location.href)
      const params = Object.fromEntries(Array.from(url.searchParams.entries()))
      params.value = params

      if (withRemove) {
        for (const key of url.searchParams.keys()) {
          url.searchParams.delete(key)
        }
        history.pushState({}, '', url)
      }
    }
  }

  async function getToken () {
    return LocalStorage.has('api_key')
      ? LocalStorage.getItem('api_key')
      : undefined
  }

  async function setToken (apiKey) {
    token.value = apiKey
    await applyApiKey(apiKey)
    LocalStorage.set('api_key', apiKey)
  }

  async function clearToken () {
    token.value = undefined
    clearApiKey()
    LocalStorage.remove('api_key')
  }

  async function loadReferences () {
    await Promise.all(commonReferences.map(async (store) => await store.loadData()))
    await Promise.all(userDependentReferences.map(async (store) => await store.loadData()))
  }

  async function resetReferences () {
    userDependentReferences.forEach((store) => store.reset())
  }

  async function loadUser () {
    user.value = { name: 'Тестовый пользователь' }
  }

  async function login (credentials) {
    await delay(1500)

    if (credentials.password !== 'password') {
      throw new Error('Неверный пароль. Попробуйте password')
    }

    const token = 'testToken'

    if (token) {
      setToken(token)
      await loadUser()
      await loadReferences()
    }
  }

  async function logout () {
    await delay(1500)
    clearToken()
    user.value = {}
    resetReferences()
  }

  return {
    loading,
    params,
    token,
    user,
    redirect,
    authorized,
    boot,
    login,
    logout
  }
})
