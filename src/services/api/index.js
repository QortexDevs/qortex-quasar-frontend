import { ref, toValue } from 'vue'

import { api } from 'boot/axios'
import { objectDifference } from 'services/support'

import { applyRules } from './transform'

export async function crudIndex (resource, params, rules) {
  const { data } = await api.get(`/${resource}/`, { params })
  return rules ? await Promise.all(data.map(row => applyRules(row, rules, 'client'))) : data
}

function paginationToApi (pagination) {
  const p = toValue(pagination)
  const sort_by = !p.sortBy ? undefined : `${p.descending ? '-' : ''}${p.sortBy}`
  return { offset: p.rowsPerPage * (p.page - 1), limit: p.rowsPerPage, sort_by }
}

function apiToPagination (pagination = {}, count) {
  pagination.value.rowsNumber = count
  pagination.value.pagesNumber = Math.ceil(count / pagination.value.rowsPerPage)
}

export async function crudPaginatedIndex (resource, pagination, params, rules) {
  const localPagination = pagination ?? ref({ rowsPerPage: 10, page: 1 })
  const { data: { results: data, count } } = await api.get(`/${resource}/`, { params: { ...params, ...paginationToApi(localPagination) } })
  apiToPagination(localPagination, count)
  return rules ? await Promise.all(data.map(row => applyRules(row, rules, 'client'))) : data
}

export async function crudStore (resource, data, params, rules) {
  const dataToSend = rules && !(data instanceof FormData) ? await applyRules(data, rules, 'server') : data
  const { data: savedData } = await api.post(`/${resource}/`, dataToSend, { params })
  return rules ? await applyRules(savedData, rules, 'client') : savedData
}

export async function crudShow (resource, id, params, rules) {
  const { data } = await api.get(`/${resource}/${id}/`, { params })
  return rules ? await applyRules(data, rules, 'client') : data
}

export async function crudUpdate (resource, data, params, rules) {
  const dataToSend = rules ? await applyRules(data, rules, 'server') : data
  const { data: savedData } = await api.put(`/${resource}/${dataToSend.id}/`, dataToSend, { params })
  return rules ? await applyRules(savedData, rules, 'client') : savedData
}

export async function crudPartialUpdate (resource, data, params, rules, referenceData) {
  const tmp = referenceData ? objectDifference(data, referenceData, { requiredKeys: ['id'] }) : data
  const dataToSend = rules ? await applyRules(tmp, rules, 'server', { generateFields: false }) : tmp
  const { data: savedData } = await api.patch(`/${resource}/${dataToSend.id}/`, dataToSend, { params })
  return rules ? await applyRules(savedData, rules, 'client') : savedData
}

export async function crudUpsert (resource, data, params, rules, referenceData) {
  return !data.id
    ? await crudStore(resource, data, params, rules)
    : !referenceData ? await crudUpdate(resource, data, params, rules)
        : await crudPartialUpdate(resource, data, params, rules, referenceData)
}

export async function crudDestroy (resource, id, params) {
  await api.delete(`/${resource}/${id}/`, { params })
  return true
}

export async function downloadFile (url, filename = 'file') {
  const { data } = await api.get(url, { responseType: 'blob' })
  const localUrl = window.URL.createObjectURL(data)
  const link = document.createElement('a')

  link.href = localUrl
  link.download = filename
  link.click()

  window.URL.revokeObjectURL(link.href)
}
