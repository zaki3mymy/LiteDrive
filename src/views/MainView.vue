<script setup>
import BreadcrumbList from '../components/BreadcrumbList.vue'
import UploadObject from '../components/UploadObject.vue'
import ListObjects from '../components/ListObjects.vue'
</script>
<template>
  <div class="container">
    <div class="row">
      <div class="col s12">
        <p class="hide">{{ $route.path }}</p>
        <router-link to="/"><i class="material-icons left">home</i></router-link> /
        <BreadcrumbList :path="path"></BreadcrumbList>
      </div>
    </div>
    <div class="row">
      <a class="waves-effect waves-light grey btn modal-trigger" href="#upload">
        <i class="material-icons left">file_upload</i>upload
      </a>
      <div id="upload" class="modal">
        <UploadObject></UploadObject>
      </div>
    </div>
    <div class="row">
      <div class="col s12">
        <ListObjects :keyProp="path"></ListObjects>
      </div>
    </div>
  </div>
</template>

<script>
import M from 'materialize-css'

export default {
  components: {
    BreadcrumbList,
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
      // パスの最初のスラッシュを削除
      if (path.startsWith('/')) path = path.slice(1)

      this.path = path
    }
  },
  mounted() {
    M.AutoInit()
  },
  updated() {
    const path = this.$route.path
    this.refresh(path)
  }
}
</script>