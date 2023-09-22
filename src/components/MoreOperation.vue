<script setup>
import { Storage } from 'aws-amplify'
import { infoMessage, errorMessage } from './util/Toast.vue'
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
    <li>
      <a class="black-text modal-trigger" :href="'#delete-object-' + objectKey">
        <i class="material-icons">delete</i>delete
      </a>
    </li>
  </ul>

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
  methods: {
    downloadObject(objectKey) {
      Storage.get(objectKey, { download: true }).then(async (result) => {
        // ダウンロード処理
        if (result.Body) {
          console.debug("result:", result)
          const typeOfBody = Object.prototype.toString.call(result.Body)
          console.debug("type:", typeOfBody)
          // XXX: デプロイするとなぜか ReadableStream になる……
          const isReadableStream = typeOfBody == "[object ReadableStream]";
          const blob = isReadableStream ? await new Response(result.Body).blob() : result.Body

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