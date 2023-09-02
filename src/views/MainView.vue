<script setup>
import BreadcrumbList from '../components/BreadcrumbList.vue'
import ListObjects from '../components/ListObjects.vue'
import AddObject from '../components/AddObject.vue'
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
      <div class="col s12">
        <ListObjects :keyProp="path"></ListObjects>
      </div>
    </div>
    <AddObject :path="path" @uploaded="refresh"></AddObject>
  </div>
</template>

<script>
import M from 'materialize-css'

export default {
  components: {
    BreadcrumbList,
    ListObjects,
    AddObject
  },
  data() {
    return {
      path: String
    }
  },
  methods: {
    refresh() {
      let path = this.$route.path
      // パスの最初のスラッシュを削除
      if (path.startsWith('/')) path = path.slice(1)

      this.path = path
    }
  },
  mounted() {
    M.AutoInit()
  },
  updated() {
    this.refresh()
  }
}
</script>