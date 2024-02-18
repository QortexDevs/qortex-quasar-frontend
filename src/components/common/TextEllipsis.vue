<template>
  <div
    class="max-w-full"
    :class="{'cursor-pointer': tooltip}"
    @click="onClick">
    <div
      ref="elementRef"
      class="overflow-hidden whitespace-nowrap text-ellipsis">
      <slot />
    </div>
    <q-tooltip v-if="tooltip">
      {{ tooltip }}
    </q-tooltip>
  </div>
</template>

<script setup>
import { copyToClipboard, debounce, useQuasar } from 'quasar'
import { onMounted, onUnmounted, ref } from 'vue'

import { notifyError } from 'services/support'

const elementRef = ref()
const tooltip = ref()

function refreshTooltip () {
  if (!elementRef.value) return
  if (elementRef.value.clientWidth < elementRef.value.scrollWidth) {
    tooltip.value = elementRef.value.innerText
  } else {
    tooltip.value = undefined
  }
}

const refreshTooltipDebounced = debounce(refreshTooltip, 1000)

const resizeObserver = new ResizeObserver(refreshTooltipDebounced)
const mutationObserver = new MutationObserver(refreshTooltipDebounced)

onMounted(async () => {
  resizeObserver.observe(elementRef.value)
  mutationObserver.observe(elementRef.value, { characterData: true, attributes: true, childList: true })
  refreshTooltip()
})
onUnmounted(() => {
  resizeObserver.disconnect()
  mutationObserver.disconnect()
})

const $q = useQuasar()
function onClick () {
  if (!tooltip.value) return
  try {
    copyToClipboard(tooltip.value)
    $q.notify('Полный текст скопирован в буфер обмена')
  } catch (error) {
    notifyError(error)
  }
}
</script>
