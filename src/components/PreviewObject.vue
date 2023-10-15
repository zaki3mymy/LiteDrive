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
            <img v-if="isImage()" :src="objectSrc" v-on:load="isLoading = false"/>
            <audio v-else-if="isAudio()" controls :src="objectSrc" v-on:loadeddata="isLoading = false"></audio>
            <p v-else-if="isElse()">preview未対応</p>
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
      fileExt: "",
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
    },
    isImage() {
      return this.fileExt == ".jpg" || this.fileExt == ".png" || this.fileExt == ".gif"
    },
    isAudio() {
      return this.fileExt == ".wav" || this.fileExt == ".mp3"
    },
    isElse() {
      this.isLoading = false
      return true
    },
  },
  mounted() {
    this.isLoading = true

    const filename = this.$route.query.preview
    this.filename = filename
    this.fileExt = "." + filename.split(".").pop()

    const path = this.path == '' ? this.path + '/' : this.path
    const objectKey = `${path}${filename}`
    this.preview(objectKey)
  },
}
</script>