<script setup>
import UploadObject from '../components/UploadObject.vue'
import ListObjects from '../components/ListObjects.vue'
</script>
<template>
  <main>
    <UploadObject></UploadObject>
    <router-link to="/" v-on:click="refresh('/')">top/</router-link>
    <span>{{ path }}</span>
    <ListObjects :keyProp="path" @move="refresh"></ListObjects>
  </main>
</template>

<script>
import M from 'materialize-css'

export default {
  components: {
    UploadObject,
    ListObjects
  },
  data() {
    return {
      path: String
    }
  },
  methods: {
    refresh(path) {
      console.log('refresh', path)
      // パスの最初のスラッシュを削除
      if (path.startsWith('/')) path = path.slice(1)

      console.log(path)
      this.path = path
    }
  },
  mounted() {
    M.AutoInit();
    // 最初のページ
    this.refresh('/')
  }
}
</script>