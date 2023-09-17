<script setup>
import { Storage } from 'aws-amplify'
import { infoMessage, errorMessage } from './util/Toast.vue'
import PreLoader from './util/PreLoader.vue'
</script>

<template>
  <a class="btn white z-depth-0 black-text dropdown-trigger" :data-target="'more-ope' + objectKey">
    <i class="material-icons">more_horiz</i>
  </a>

  <ul :id="'more-ope' + objectKey" class="dropdown-content">
    <li v-if="!objectKey.endsWith('/')">
      <a class="black-text" @click="downloadObject(objectKey)">
        <i class="material-icons">download</i>download
      </a>
    </li>
    <li v-if="!objectKey.endsWith('/')">
      <a class="black-text modal-trigger" :href="'#copy-link-' + objectKey" @click="copyUrl(objectKey)">
        <i class="material-icons">link</i>copy link
      </a>
    </li>
    <li>
      <a class="black-text modal-trigger" :href="'#delete-object-' + objectKey">
        <i class="material-icons">delete</i>delete
      </a>
    </li>
  </ul>

  <div :id="'copy-link-' + objectKey" class="modal card">
    <div class="card-content">
      <span class="card-title">{{ $t("dialog.title.shared_link") }}</span>
      <div v-show="isLoading">
        <PreLoader></PreLoader>
      </div>
      <div v-show="!isLoading">
        <p>{{ $t("message.copy_shared_link", { key: objectKey }) }}</p>
        <input :id="'copy-link-value-' + objectKey" />
      </div>
    </div>
  </div>

  <div :id="'delete-object-' + objectKey" class="modal card">
    <div class="card-content">
      <span class="card-title">{{ $t("dialog.title.delete") }}</span>
      <p>{{ $t("dialog.confirm.delete", { key: objectKey }) }}</p>
    </div>
    <div class="card-action" style="display: flow-root">
      <button
        class="waves-effect waves-light blue-grey btn right modal-close"
        @click="deleteObject(objectKey)"
      >
        {{ $t("dialog.button.delete") }}
      </button>
      <span class="right">&nbsp;</span>
      <button class="waves-effect waves-light blue-grey lighten-3 btn right modal-close">
        {{ $t("dialog.button.cancel") }}
      </button>
    </div>
  </div>
</template>

<script>
import M from 'materialize-css'

export default {
  props: ['objectKey'],
  emits: ['updated'],
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    downloadObject(objectKey) {
      Storage.get(objectKey, { download: true }).then((result) => {
        // ダウンロード処理
        if (result.Body) {
          const blob = result.Body
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url

          const filename = objectKey.split('/').slice(-1)[0]
          a.download = filename || 'download'

          const clickHandler = () => {
            setTimeout(() => {
              URL.revokeObjectURL(url)
              a.removeEventListener('click', clickHandler)
            }, 150)
          }
          a.addEventListener('click', clickHandler, false)
          a.click()
        }
      })
    },
    copyUrl(objectKey) {
      const vm = this
      vm.isLoading = true
      Storage.get(objectKey).then((result) => {
        const elem = document.getElementById(`copy-link-value-${objectKey}`)
        elem.value = result
        elem.addEventListener("click", () => {
          elem.focus()
          elem.select()
          document.execCommand("copy")
        })

        vm.isLoading = false
      })
    },
    deleteObject(objectKey) {
      const vm = this

      const deleteObjectKey = () => {
        Storage.remove(objectKey)
          .then(() => {
            infoMessage(vm.$t("message.deleted_object", { key: objectKey }))
            vm.$emit('updated')
          })
          .catch((err) => {
            console.error(err)
            errorMessage(vm.$t("message.delete_failed"))
          })
      }
      // 先に子オブジェクトを全て削除する
      const config = {
        pageSize: 'ALL'
      }
      Storage.list(objectKey, config)
        .then((response) => {
          // 子オブジェクトを全て削除する
          response.results.forEach((res) => {
            Storage.remove(res.key)
              .catch((err) => {
                console.error(err)
              })
          })
          // 該当オブジェクトを削除する
          deleteObjectKey()
        })
    }
  },
  mounted() {
    M.AutoInit()
  }
}
</script>