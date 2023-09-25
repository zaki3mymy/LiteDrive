<template>
  <div :id="'progress-modal-' + objectKey" class="modal">
    <div class="modal-content">
      <p>{{ message }}</p>
      <div class="progress blue-grey lighten-3">
        <div class="determinate blue-grey" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script>
import M from 'materialize-css'

export default {
  props: ['objectKey', 'progress', "message"],
  data() {
    return {
      instance: null
    }
  },
  methods: {
    open() {
      this.instance.open()
    },
    close() {
      this.instance.close()
    }
  },
  mounted() {
    const elem = document.getElementById('progress-modal-' + this.objectKey)
    const options = {
      dismissible: false
    }
    this.instance = M.Modal.init(elem, options)
  }
}
</script>