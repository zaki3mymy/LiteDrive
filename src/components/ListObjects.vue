<script setup>
import { Storage } from 'aws-amplify'
import { formatDatetime, shortFormatDatetime } from './util/Datetime.vue'
</script>

<template>
  <p v-if="isFetching">loading...</p>
  <table v-else class="highlight">
    <thead>
      <tr>
        <th style="width: 10%; min-width: 30px"></th>
        <th style="width: 50%">ファイル名</th>
        <th style="width: 30%">
          <span class="hide-on-small-only">更新日時</span>
          <span class="hide-on-med-only show-on-small">更新日</span>
        </th>
        <th style="width: 10%; min-width: 30px"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="folder in folders" :key="folder">
        <td><i class="material-icons">folder</i></td>
        <td>
          <router-link :to="'/' + folder">{{ folder }}</router-link>
        </td>
        <td></td>
      </tr>
      <tr v-for="file in files" :key="file.key">
        <td></td>
        <td>
          <router-link :to="file.key">{{ file.key }}</router-link>
        </td>
        <td>
          <span class="hide-on-small-only">
            {{ formatDatetime(file.lastModified) }}
          </span>
          <span
            class="hide-on-med-only show-on-small tooltipped"
            data-position="top"
            :data-tooltip="formatDatetime(file.lastModified)"
          >
            {{ shortFormatDatetime(file.lastModified) }}
          </span>
        </td>
        <td>
          <a class="btn white z-depth-0 black-text">
            <i class="material-icons">more_horiz</i>
          </a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import M from 'materialize-css'

export default {
  props: {
    keyProp: String
  },
  emit: ['move'],
  data() {
    return {
      files: [],
      folders: new Set(),
      isFetching: true
    }
  },
  methods: {
    async listObjects(key) {
      this.files = []
      this.folders = new Set()

      // 現在の階層を取得("/"の数を階層とする)
      const level = (key.match(/\//g) || []).length

      this.isFetching = true
      const config = {
        // TODO: paging
        // https://docs.amplify.aws/lib/storage/list/q/platform/js/#paginated-file-access
        pageSize: 'ALL'
      }
      const response = await Storage.list(key, config)
      this.isFetching = false

      response.results.forEach((res) => {
        // 階層が同じものだけを対象とする(フォルダーは+1階層)
        const resLevel = (res.key.match(/\//g) || []).length

        if (res.size) {
          if (level == resLevel) this.files.push(res)
          // sometimes files declare a folder with a / within then
          let possibleFolder = res.key.split('/').slice(0, -1).join('/')
          if (possibleFolder) {
            possibleFolder += '/'
            if (level + 1 == resLevel) this.folders.add(possibleFolder)
          }
        } else {
          if (level + 1 == resLevel) this.folders.add(res.key)
        }
      })
    }
  },
  watch: {
    keyProp(newValue, oldValue) {
      this.listObjects(newValue)
    }
  },
  updated() {
    const elems = document.querySelectorAll('.tooltipped')
    const options = {}
    M.Tooltip.init(elems, options)
  }
}
</script>