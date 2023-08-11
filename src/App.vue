<script setup>
import MainView from './views/MainView.vue'
import { Authenticator } from '@aws-amplify/ui-vue'
</script>

<template>
  <authenticator>
  <!-- <authenticator hide-sign-up="true"> -->
    <template v-slot="{ signOut }">
      <header>
        <h1>MyCloudStorage</h1>
        <button @click="signOut" class="contact">Sign out</button>
      </header>
      <MainView></MainView>
    </template>
  </authenticator>
</template>
