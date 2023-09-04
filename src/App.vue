<script setup>
import MainView from './views/MainView.vue'
import HeaderComponent from './components/HeaderComponent.vue'
import { Authenticator } from '@aws-amplify/ui-vue'
</script>

<template>
  <authenticator hide-sign-up="true">
  <!-- <authenticator> -->
    <template v-slot="{ signOut }">
      <HeaderComponent :signOut="signOut"></HeaderComponent>
      <MainView></MainView>
    </template>
  </authenticator>
</template>
