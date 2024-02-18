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

  const boot = async () => {
    setParams()

    const apiKey = getApiKey()
    if (apiKey) {
      await setToken(apiKey)
    }

    if (authorized.value) {
      await loadUser()
      await loadReferences()
    }

    loading.value = false
  }

  const setParams = (withRemove = true) => {
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

  const getApiKey = () => {
    return LocalStorage.has('api_key')
      ? LocalStorage.getItem('api_key')
      : undefined
  }

  const setToken = async (apiKey) => {
    token.value = apiKey
    await applyApiKey(apiKey)
    LocalStorage.set('api_key', apiKey)
  }

  const clearToken = () => {
    token.value = undefined
    clearApiKey()
    LocalStorage.remove('api_key')
  }

  const loadReferences = async () => {
    await Promise.all(commonReferences.map(async (store) => await store.loadData()))
    await Promise.all(userDependentReferences.map(async (store) => await store.loadData()))
  }

  const resetReferences = () => {
    userDependentReferences.forEach((store) => store.reset())
  }

  const loadUser = async () => {
    user.value = { name: 'Тестовый пользователь' }
  }

  const login = async (credentials) => {
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

  const logout = async () => {
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