<template>
  <q-page
    class="flex flex-center bg-slate-400"
    padding>
    <q-form @submit="login">
      <q-card class="w-96">
        <q-card-section class="text-xl font-bold text-center">
          Вход в систему
        </q-card-section>

        <q-card-section class="pt-0">
          <q-input
            v-model="credentials.username"
            label="Имя пользователя"
            :rules="[NOT_EMPTY_STRING]" />
          <q-input
            v-model="credentials.password"
            label="Пароль"
            :rules="[NOT_EMPTY_STRING]"
            type="password" />
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            color="primary"
            type="submit">
            Войти
          </q-btn>
        </q-card-actions>

        <q-inner-loading :showing="loading" />
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { NOT_EMPTY_STRING } from 'services/validators'
import { notifyError } from 'src/services/support'
import { useSessionStore } from 'src/stores/session'

const router = useRouter()

const sessionStore = useSessionStore()
const { loading } = storeToRefs(sessionStore)

const credentials = ref({
  username: undefined,
  password: undefined
})

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
