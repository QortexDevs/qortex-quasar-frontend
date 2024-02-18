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
    const isInvalidKey = error instanceof AxiosError && error.response?.status === 403
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
