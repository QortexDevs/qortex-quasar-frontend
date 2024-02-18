<template>
  <q-layout view="hHh Lpr fFf">
    <!-- Be sure to play with the Layout demo on docs -->

    <q-page-container>
      <q-page class="flex flex-center">
        <q-spinner
          color="primary"
          size="xl" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useRouter } from 'vue-router'

import { useSessionStore } from 'src/stores/session'

const { redirect, loading } = storeToRefs(useSessionStore())
const router = useRouter()

watch(loading, (newValue) => {
  if (!newValue) {
    router.replace(redirect ?? { to: 'home' })
  }
}, { immediate: true })
</script>
