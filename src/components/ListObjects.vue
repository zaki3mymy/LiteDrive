<script setup>
import { formatDatetime, shortFormatDatetime } from './util/Datetime.vue'
import MoreOperation from './MoreOperation.vue'
</script>

<template>
  <table class="highlight">
    <thead>
      <tr>
        <th style="width: 10%; min-width: 30px"></th>
        <th style="width: 50%">{{ $t("table.filename") }}</th>
        <th style="width: 30%">
          <span class="hide-on-small-only">{{ $t("table.update_datetime") }}</span>
          <span class="hide-on-med-and-up show-on-small">{{ $t("table.update_date") }}</span>
        </th>
        <th style="width: 10%; min-width: 30px"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="folder in folders" :key="folder.key">
        <td><i class="material-icons">folder</i></td>
        <td>
          <router-link :to="'/' + folder.key">{{ folder.name }}</router-link>
        </td>
        <td></td>
        <td>
          <MoreOperation :objectKey="folder.key" @updated="updateMe"></MoreOperation>
        </td>
      </tr>
      <tr v-for="file in files" :key="file.key">
        <td></td>
        <td>
          {{ file.name }}
        </td>
        <td>
          <span class="hide-on-small-only">
            {{ formatDatetime(file.lastModified) }}
          </span>
          <span
            class="hide-on-med-and-up show-on-small tooltipped"
            data-position="top"
            :data-tooltip="formatDatetime(file.lastModified)"
          >
            {{ shortFormatDatetime(file.lastModified) }}
          </span>
        </td>
        <td>
          <MoreOperation :objectKey="file.key" @updated="updateMe"></MoreOperation>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import M from 'materialize-css'

class S3Object {
  constructor(key, lastModified) {
    this.key = key
    this.lastModified = lastModified

    let name = ''
    if (key.endsWith('/')) {
      // フォルダ
      name = key.split('/').slice(-2)[0] + '/'
    } else {
      // ファイル
      name = key.split('/').slice(-1)[0]
    }
    this.name = name
  }
}

export default {
  props: ['path', 'results'],
  emits: ['updateList'],
  components: {
    MoreOperation
  },
  data() {
    return {
      files: [],
      folders: []
    }
  },
  methods: {
    async listObjects(key, results) {
      this.files = []
      this.folders = []

      // 現在の階層を取得("/"の数を階層とする)
      const level = (key.match(/\//g) || []).length

      const files = []
      const folders = []
      const folderKeys = new Set()
      results.forEach((res) => {
        // 階層が同じものだけを対象とする(フォルダーは+1階層)
        const resLevel = (res.key.match(/\//g) || []).length

        const obj = new S3Object(res.key, res.lastModified)

        if (res.size) {
          // ファイル
          if (level == resLevel) files.push(obj)

          // ファイルまでの階層をフォルダとして追加
          const parentFolder = res.key.split('/').slice(0, -1).join('/') + '/'
          if (parentFolder !== '/' && level + 1 == resLevel && !folderKeys.has(parentFolder)) {
            const folderObj = new S3Object(parentFolder, null)
            folders.push(folderObj)
            folderKeys.add(parentFolder)
          }
        } else {
          // フォルダ
          if (level + 1 == resLevel && !folderKeys.has(obj.key)) {
            folders.push(obj)
            folderKeys.add(obj.key)
          }
        }
      })
      this.files = files
      this.folders = folders
    },
    updateMe() {
      this.$emit('updated')
    }
  },
  mounted() {
    M.AutoInit()
  },
  watch: {
    results(newValue) {
      this.listObjects(this.path, newValue)
    }
  }
}
</script>