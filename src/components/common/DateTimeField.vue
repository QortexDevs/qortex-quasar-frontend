<template>
  <span>
    {{ formatDate(value) }}
    <span class="text-dark-3">
      {{ formatTime(value) }}
    </span>
  </span>
</template>

<script setup>
import { formatDate, formatTime } from 'services/support'

defineProps({
  value: Date
})
</script>
