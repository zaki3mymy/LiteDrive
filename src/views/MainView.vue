<script setup>
import { Storage } from 'aws-amplify'
import BreadcrumbList from '../components/BreadcrumbList.vue'
import ListObjects from '../components/ListObjects.vue'
import AddObject from '../components/AddObject.vue'
import PreLoader from '../components/util/PreLoader.vue'
import PreviewObject from '../components/PreviewObject.vue'
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
        <div v-if="isPreview">
          <PreviewObject :path="path"></PreviewObject>
        </div>
        <div v-else>
          <div v-show="isFetching">
            <PreLoader></PreLoader>
          </div>
          <ListObjects v-show="!isFetching" :path="path" :results="results" @updated="refresh(path)"></ListObjects>
        </div>
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
      isFetching: false,
      isPreview: false,
    }
  },
  methods: {
    async refresh(path){
      // パスの最初のスラッシュを削除
      if (path.startsWith('/')) path = path.slice(1)

      path = decodeURI(path)

      this.isFetching = true

      let nextToken = undefined
      let hasNextPage = true
      let results = []
      while (hasNextPage) {
        const config = {
          // https://docs.amplify.aws/lib/storage/list/q/platform/js/#paginated-file-access
          pageSize: 'ALL',
          nextToken: nextToken
        }
        const response = await Storage.list(path, config)
        response.results.forEach((result) => {
          results.push(result)
        })

        if (response.hasNextToken) {
          nextToken = response.nextToken
        } else {
          nextToken = undefined
          hasNextPage = false
        }
      }

      this.path = path
      this.results = results

      this.isFetching = false
    }
  },
  mounted() {
    M.AutoInit()
    this.refresh("/")
  },
  watch: {
    $route(to) {
      // パス変更時のイベント
      if (this.$route.query.preview) {
        this.isPreview = true
      } else {
        this.isPreview = false
        this.refresh(to.path)
      }
    }
  }
}
</script>