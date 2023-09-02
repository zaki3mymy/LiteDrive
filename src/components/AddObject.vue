<script setup>
import { Storage } from 'aws-amplify'
</script>

<template>
  <div class="fixed-action-btn">
    <a class="btn-floating btn-large blue-grey">
      <i class="large material-icons">add</i>
    </a>
    <ul>
      <li>
        <a class="btn-floating blue-grey lighten-2 modal-trigger" href="#create-folder">
          <i class="material-icons">folder</i>
        </a>
      </li>
      <li>
        <a class="btn-floating blue-grey lighten-2" @click="fileUpload">
          <i class="material-icons">file_upload</i>
        </a>
        <input id="upload_file" type="file" class="hide" ref="fileInput" @change="handleFileChange" />
      </li>
    </ul>
  </div>
  <div id="create-folder" class="modal card">
    <div class="card-content">
      <span class="card-title">Create Folder</span>

      <div class="input-field col s6">
        <input
          id="folder_name"
          type="text"
          autocomplete="off"
          v-model="folderName"
          class="validate"
          pattern="^.*[^\/]$"
        />
        <label for="folder_name">Folder Name</label>
      </div>
    </div>
    <div class="card-action" style="display: flow-root">
      <button
        class="waves-effect waves-light blue-grey btn right"
        @click="createFolder(folderName)"
      >
        Create!
      </button>
    </div>
  </div>
</template>

<script>
import M from 'materialize-css'

export default {
  props: {
    path: String
  },
  emits: ['uploaded'],
  data() {
    return {
      folderName: '',
    }
  },
  methods: {
    async createFolder(folderName) {
      if (!folderName) {
        alert('フォルダ名が未入力です。')
        return
      }

      if (folderName.endsWith('/')) {
        // TODO: 自動で末尾"/"を削除する(再帰的に削除)
        alert('末尾のスラッシュを削除してください。')
        return
      }

      console.log(folderName)
      if (!folderName.endsWith('/')) folderName += '/'

      folderName = this.path + folderName
      console.log(folderName)

      const result = await Storage.put(folderName, null)
      console.log('---result', result)
      alert('フォルダを作成しました。')
    },
    fileUpload() {
      // ファイル選択ダイアログを開く(ファイル選択後 handlerFileChange が呼ばれる)
      this.$refs.fileInput.click();
    },
    handleFileChange() {
      // イベントリスナーの中でthisを使うために変数に入れる
      const vm = this

      const selectedFile = event.target.files[0];
      if (selectedFile) {
        const uploadFilename = this.path + selectedFile.name
        console.log(uploadFilename)
        
        const reader = new FileReader();
        reader.onload = function(e) {
          const data = new Uint8Array(e.target.result);
          console.log(data);

          const result = Storage.put(uploadFilename, data);
          console.log("---- result", result)

          alert("ファイルをアップロードしました。")
          
          // ファイル選択を初期化する
          document.getElementById('upload_file').value = ''
          vm.$emit("uploaded")
        };
        reader.readAsArrayBuffer(selectedFile);
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