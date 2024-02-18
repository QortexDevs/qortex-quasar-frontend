<template>
  <q-page
    class="flex flex-center bg-slate-400"
    padding>
    <q-form @submit="login">
      <q-card>
        <q-card-section class="text-xl font-bold text-center">
          Вход
        </q-card-section>
        <q-card-section class="pt-0">
          <q-input
            v-model="credentials.username"
            label="Имя пользователя"
            :rules="[val => val !== '' || 'Обязательное поле']" />
          <q-input
            v-model="credentials.password"
            label="Пароль"
            :rules="[val => val !== '' || 'Обязательное поле']"
            type="password" />
        </q-card-section>
        <q-card-section class="text-center">
          <q-btn
            color="primary"
            type="submit">
            Вход
          </q-btn>
        </q-card-section>
        <q-inner-loading :showing="loading" />
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { notifyError } from 'src/services/support'
import { useSessionStore } from 'src/stores/session'

const router = useRouter()

const credentials = ref({ username: '', password: '' })

const sessionStore = useSessionStore()
const { loading } = storeToRefs(sessionStore)

async function login () {
  try {
    loading.value = true
    await sessionStore.login(credentials.value)
    router.push({ name: 'home' })
  } catch (error) {
    notifyError(error)
  } finally {
    loading.value = false
  }
}
</script>
