<script setup>
import { Storage } from 'aws-amplify'
</script>

<template>
  <a class="btn white z-depth-0 black-text dropdown-trigger" :data-target="'more-ope' + objectKey">
    <i class="material-icons">more_horiz</i>
  </a>

  <ul :id="'more-ope' + objectKey" class="dropdown-content">
    <li>
      <a class="black-text modal-trigger" :href="'#delete-object-' + objectKey">
        <i class="material-icons">delete</i>delete
      </a>
    </li>
  </ul>

  <div :id="'delete-object-' + objectKey" class="modal card">
    <div class="card-content">
      <span class="card-title">Delete File</span>
      <p>{{ objectKey }} を削除します。</p>
    </div>
    <div class="card-action" style="display: flow-root">
      <button
        class="waves-effect waves-light blue-grey btn right"
        @click="deleteObject(objectKey)"
      >
        Delete
      </button>
      <span class="right">&nbsp;</span>
      <button class="waves-effect waves-light blue-grey lighten-3 btn right">Cancel</button>
    </div>
  </div>
</template>

<script>
import M from 'materialize-css'

export default {
  props: {
    objectKey: String
  },
  methods: {
    deleteObject(objectKey) {
      console.log(objectKey)
      // Storage.remove(objectKey).then(
      //   alert(`${objectKey} を削除しました。`)
      //   // モーダルを閉じる
      // )
      console.log(this)
    }
  },
  mounted() {
    M.AutoInit()
    this.key = this.objectKey
  }
}
</script>