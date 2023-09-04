<script setup>
import { Storage } from 'aws-amplify'
import BreadcrumbList from '../components/BreadcrumbList.vue'
import ListObjects from '../components/ListObjects.vue'
import AddObject from '../components/AddObject.vue'
import PreLoader from '../components/util/PreLoader.vue'
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
        <div v-show="isFetching">
          <PreLoader></PreLoader>
        </div>
        <ListObjects v-show="!isFetching" :path="path" :results="results" @updated="refresh(path)"></ListObjects>
      </div>
    </div>
    <AddObject :path="path" @uploaded="refresh(path)"></AddObject>
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
      path: String,
      results: [],
      isFetching: false
    }
  },
  methods: {
    async refresh(path){
      // パスの最初のスラッシュを削除
      if (path.startsWith('/')) path = path.slice(1)

      this.isFetching = true
      const config = {
        // TODO: paging
        // https://docs.amplify.aws/lib/storage/list/q/platform/js/#paginated-file-access
        pageSize: 'ALL'
      }
      const response = await Storage.list(path, config)

      this.path = path
      this.results = response.results

      this.isFetching = false
    }
  },
  mounted() {
    M.AutoInit()
  },
  watch: {
    $route(to) {
      // パス変更時のイベント
      this.refresh(to.path)
    }
  }
}
</script>