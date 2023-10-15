<script setup>
import { Storage } from 'aws-amplify'
import PreLoader from '../components/util/PreLoader.vue'
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col s12">
        <div class="center">
          <p>{{ filename }}</p>
          <div v-show="isLoading">
            <PreLoader></PreLoader>
          </div>
          <div v-show="!isLoading">
            <img :src="objectSrc" v-on:load="isLoading = false"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['path'],
  data() {
    return {
      objectSrc: "",
      isLoading: true,
      filename: "",
    }
  },
  methods: {
    preview(objectKey) {
      const key = objectKey.startsWith('/') ? objectKey.slice(1) : objectKey
      Storage.get(key, { download: false })
        .then((result) => {
          console.log(result)
          const contentType = result.headers;
          console.log(contentType)
          this.objectSrc = result
        })
        .catch((err) => {
          console.error(err)
        })
    }
  },
  mounted() {
    this.isLoading = true

    const filename = this.$route.query.preview
    this.filename = filename
    const path = this.path == '' ? this.path + '/' : this.path
    const objectKey = `${path}${filename}`
    this.preview(objectKey)
  },
}
</script>