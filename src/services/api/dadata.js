import axios from 'axios'

const BASE = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs'
const TOKEN = import.meta.env.VITE_DADATA_KEY

export const dadataAPI = axios.create({
  baseURL: BASE,
  headers: {
    Authorization: `Token ${TOKEN}`
  }
})

export const dadataRequest = async (resource, type, payload) => {
  const { data } = await dadataAPI.post(`${resource}/${type}`, payload)
  return data
}

export const dadataSuggest = async (type, query, country, otherParams) => {
  const locations = { country }
  const payload = { query, locations, ...otherParams }
  const { suggestions } = await dadataRequest('suggest', type, payload)

  return suggestions
}

export const dadataFindById = async (type, query, otherParams) => {
  const payload = { query, ...otherParams }
  const { suggestions } = await dadataRequest('findById', type, payload)

  return suggestions
}
