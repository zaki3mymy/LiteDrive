<script setup>
import { Storage } from 'aws-amplify'
import { infoMessage, errorMessage } from './util/Toast.vue'
import ProgressBar from './util/ProgressBar.vue'
</script>

<template>
  <div class="fixed-action-btn">
    <a class="btn-floating btn-large blue-grey">
      <i class="large material-icons">add</i>
    </a>
    <ul>
      <li>
        <a class="btn-floating blue-grey lighten-2 modal-trigger" href="#create-folder">
          <i class="material-icons">create_new_folder</i>
        </a>
      </li>
      <li>
        <a class="btn-floating blue-grey lighten-2" @click="fileUpload">
          <i class="material-icons">file_upload</i>
        </a>
        <input
          id="upload_file"
          type="file"
          class="hide"
          ref="fileInput"
          @change="handleFileChange"
        />
      </li>
    </ul>
  </div>
  <div id="create-folder" class="modal card">
    <div class="card-content">
      <span class="card-title">{{ $t("dialog.title.create_folder") }}</span>

      <div class="input-field col s6">
        <input
          id="folder_name"
          type="text"
          autocomplete="off"
          v-model="folderName"
          class="validate"
          pattern="^.*[^\/]$"
        />
        <label for="folder_name">{{ $t("label.folder_name") }}</label>
      </div>
    </div>
    <div class="card-action" style="display: flow-root">
      <button
        class="waves-effect waves-light blue-grey btn right modal-close"
        @click="createFolder(folderName)"
      >
        Create!
      </button>
    </div>
  </div>
  <ProgressBar :objectKey="'uploading'" :progress="progress" :message="$t('progress.uploading')" ref="progressBar"></ProgressBar>
</template>

<script>
import M from 'materialize-css'

export default {
  props: ['path'],
  emits: ['uploaded'],
  data() {
    return {
      folderName: '',
      progress: 0,
    }
  },
  methods: {
    async createFolder(folderName) {
      if (!folderName) {
        errorMessage(this.$t("message.empty_folder_name"))
        return
      }

      if (folderName.endsWith('/')) {
        // TODO: 自動で末尾"/"を削除する(再帰的に削除)
        errorMessage(this.$t("message.trailing_slash"))
        return
      }

      if (!folderName.endsWith('/')) folderName += '/'

      folderName = this.path + folderName

      await Storage.put(folderName, null)
      infoMessage(this.$t("message.folder_created"))
      this.$emit('uploaded')
    },
    fileUpload() {
      // ファイル選択ダイアログを開く(ファイル選択後 handlerFileChange が呼ばれる)
      this.$refs.fileInput.click()
    },
    handleFileChange() {
      // イベントリスナーの中でthisを使うために変数に入れる
      const vm = this

      const selectedFile = event.target.files[0]
      if (selectedFile) {
        this.progress = 0
        this.$refs.progressBar.open();
        const progressCallback = (progress) => {
          this.progress = Math.round((progress.loaded / progress.total) * 100)
        }
        const uploadFilename = this.path + selectedFile.name

        const reader = new FileReader()
        reader.onload = async function (e) {
          const data = new Uint8Array(e.target.result)

          await Storage.put(uploadFilename, data, { progressCallback })
          vm.progress = 0
          vm.$refs.progressBar.close();

          infoMessage(vm.$t("message.file_uploaded"))

          // ファイル選択を初期化する
          document.getElementById('upload_file').value = ''
          vm.$emit('uploaded')
        }
        reader.readAsArrayBuffer(selectedFile)
      }
    }
  },
  mounted() {
    // イベントリスナーの中でthisを使うために変数に入れる
    const vm = this

    document.addEventListener('DOMContentLoaded', function () {
      const elem = document.getElementById('create-folder')
      const options = {
        onCloseEnd() {
          vm.folderName = null
          vm.$emit('uploaded')
        }
      }
      M.Modal.init(elem, options)
    })
  }
}
</script>