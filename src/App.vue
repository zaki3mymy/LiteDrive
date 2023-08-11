<script setup>
import MainView from './views/MainView.vue'
import { Authenticator } from '@aws-amplify/ui-vue'
</script>

<template>
  <!-- <authenticator hide-sign-up="true"> -->
  <authenticator>
    <template v-slot="{ signOut }">
      <v-layout class="rounded rounded-md">
        <v-app-bar title="owncloudbox">
          <v-btn variant="tonal" @click="signOut">Sign out</v-btn>
        </v-app-bar>

        <v-navigation-drawer>
          <v-list>
            <v-list-item title="draft"></v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-main class="d-flex align-center justify-center" style="min-height: 300px">
          <MainView></MainView>
        </v-main>
      </v-layout>
    </template>
  </authenticator>
</template>
