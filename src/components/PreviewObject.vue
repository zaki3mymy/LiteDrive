<script setup>
import { Storage } from 'aws-amplify'
import PreLoader from '../components/util/PreLoader.vue'
</script>

<style>
img {
  max-width: 100%;
}
audio {
  min-width: 100%;
  max-width: 100%;
}
video {
  max-width: 100%;
}
</style>

<template>
  <div class="container">
    <div class="row">
      <div class="col s12">
        <div class="center">
          <p>{{ filename }}</p>
          <div>
            <PreLoader v-show="isLoading"></PreLoader>
            <img
              v-if="isImage()"
              v-show="!isLoading"
              :src="objectSrc"
              v-on:load="isLoading = false"
            />
            <audio v-else-if="isAudio()" controls :src="objectSrc"></audio>
            <video v-else-if="isVideo()" controls :src="objectSrc"></video>
            <div v-else-if="isText()" class="input-field card-panel">
              <textarea
                id="textarea"
                :value="fileContent"
                readonly
                class="materialize-textarea"
              ></textarea>
            </div>
            <p v-else-if="isElse()">{{ $t("message.cannot_preview") }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import M from 'materialize-css'

export default {
  props: ['path'],
  data() {
    return {
      objectSrc: '',
      isLoading: true,
      filename: '',
      fileExt: '',
      fileContent: ''
    }
  },
  methods: {
    preview(objectKey) {
      const key = objectKey.startsWith('/') ? objectKey.slice(1) : objectKey
      Storage.get(key, { download: false })
        .then((result) => {
          this.objectSrc = result
        })
        .catch((err) => {
          console.error(err)
        })
    },
    isImage() {
      return this.fileExt == '.jpg' || this.fileExt == '.png' || this.fileExt == '.gif'
    },
    isAudio() {
      if (this.fileExt == '.wav' || this.fileExt == '.mp3') {
        this.isLoading = false
        return true
      } else {
        return false
      }
    },
    isVideo() {
      if (this.fileExt == '.mp4') {
        this.isLoading = false
        return true
      } else {
        return false
      }
    },
    isText() {
      if (this.fileExt == '.txt' || this.fileExt == '.md' || this.fileExt == '.csv') {
        fetch(this.objectSrc).then((response) => {
          response.text().then((text) => {
            this.fileContent = text

            const textarea = document.getElementById('textarea')
            M.textareaAutoResize(textarea)
            // for auto resize
            textarea.dispatchEvent(new KeyboardEvent('keydown'), {
              key: 'Enter'
            })

            this.isLoading = false
          })
        })
        return true
      } else {
        return false
      }
    },
    isElse() {
      this.isLoading = false
      return true
    }
  },
  mounted() {
    this.isLoading = true

    const filename = this.$route.query.preview
    this.filename = filename
    this.fileExt = '.' + filename.split('.').pop()

    const path = this.path == '' ? this.path + '/' : this.path
    const objectKey = `${path}${filename}`
    this.preview(objectKey)
  }
}
</script>