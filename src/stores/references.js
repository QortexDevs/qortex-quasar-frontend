import { capitalize } from 'lodash'
import { defineStore } from 'pinia'

import { crudDestroy, crudIndex, crudUpsert } from 'services/api'
import { moreLess } from 'services/support'

const references = []

export function getStoreByReference (name) {
  const id = getReferenceId(name)
  return references.find(store => store.$id === id)
}

function getReferenceId (reference) {
  return `reference${reference.split('-').map(n => capitalize(n)).join('')}`
}

export function createReferenceStore (name, { getters, actions, rules, paramsFn, afterSave, afterDelete } = {}) {
  const reference = defineStore(getReferenceId(name), {
    state: () => ({
      data: [],
      loaded: false,
      loading: false,
      paramsFn
    }),
    getters: {
      options: state => state.data.map(item => ({ ...item, label: item.name, value: item.id })),
      byId: state => Object.fromEntries(state.data.map(item => [item.id, item])),
      byCode: state => Object.fromEntries(state.data.map(item => [item.code, item])),
      optionByValue () {
        return Object.fromEntries(this.options.map(option => [option.value, option]))
      },
      ...getters
    },
    actions: {
      sortData () {
        this.data.sort((i1, i2) => moreLess(i1.order ?? i1.name, i2.order ?? i2.name))
      },
      async loadData (reload = false) {
        if (this.loaded && !reload) { return }
        try {
          this.loading = true
          this.data = await crudIndex(name, this.paramsFn?.(), rules)
          this.sortData()
          this.loaded = true
        } finally {
          this.loading = false
        }
      },
      presentation (id, field = 'name') {
        return this.data.find(item => item.id === id)?.[field] ?? '<>'
      },
      async saveItem (data) {
        this.loading = true
        const newData = await crudUpsert(name, data, this.paramsFn?.(), rules)
        const index = data.id ? this.data.findIndex(r => r.id === newData.id) : -1
        if (index === -1) {
          this.data.push(newData)
        } else {
          this.data[index] = newData
        }
        this.sortData()
        afterSave?.call(this, newData)
        this.loading = false
        return newData
      },
      async deleteItem (id) {
        const index = this.data.findIndex(r => r.id === id)
        if (index === -1) {
          throw new Error('Элемент не найден')
        } else {
          await crudDestroy(name, id, this.paramsFn?.())
          this.data.splice(index, 1)
          afterDelete?.call(this, id)
        }
      },

      ...actions
    }
  })
  references.push(reference())
  return reference
}
