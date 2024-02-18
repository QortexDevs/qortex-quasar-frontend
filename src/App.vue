<template>
  <router-view v-slot="{ Component }">
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut absolute"
      appear>
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App'
})
</script>
