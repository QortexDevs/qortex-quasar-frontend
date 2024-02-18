<template>
  <button
    class="hover:opacity-90"
    @click="onClick">
    <slot />
  </button>
</template>

<script setup>
import { copyToClipboard, useQuasar } from 'quasar'

import { notifyError } from 'services/support'

const props = defineProps({
  notify: String
})

const $q = useQuasar()
function onClick (e) {
  try {
    copyToClipboard(e.target.innerText)
    $q.notify(props.notify)
  } catch (error) {
    notifyError(error)
  }
}
</script>
