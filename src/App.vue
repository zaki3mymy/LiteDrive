<script setup>
import MainView from './views/MainView.vue'
import { Authenticator } from '@aws-amplify/ui-vue'
</script>

<template>
  <!-- <authenticator hide-sign-up="true"> -->
  <authenticator>
    <template v-slot="{ signOut }">
      <button @click="signOut">Sign out</button>
      <main>
        <MainView></MainView>
      </main>
    </template>
  </authenticator>
</template>
