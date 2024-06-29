import { AxiosError } from 'axios'

import { api } from 'boot/axios'
import { crudIndex } from 'services/api'

const TEST_ENDPOINT = 'company-types'

export async function applyApiKey (key) {
  if (!key) return false

  setApiKey(key)

  try {
    await crudIndex(TEST_ENDPOINT)
    return true
  } catch (error) {
    const isInvalidKey = error instanceof AxiosError && [403, 401].includes(error.response?.status)
    if (isInvalidKey) clearApiKey()
    return !isInvalidKey
  }
}

export async function setApiKey (key) {
  api.defaults.headers.common.Authorization = `Bearer ${key}`
}

export function clearApiKey () {
  delete api.defaults.headers.common.Authorization
}
