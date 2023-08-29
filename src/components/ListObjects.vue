<script setup>
import { Storage } from "aws-amplify";
import { formatDatetime } from "./util/Datetime.vue";
</script>

<template>
  <p v-if="isFetching">loading...</p>
  <table v-else>
    <thead>
      <tr>
        <th></th>
        <th>ファイル名</th>
        <th>最終更新日</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="folder in folders" :key="folder">
        <td><i class="material-icons">folder</i></td>
        <td>
          <router-link
            :to="'/' + folder + '/'"
            >{{ folder }}/</router-link
          >
        </td>
        <td></td>
      </tr>
      <tr v-for="file in files" :key="file.key">
        <td></td>
        <td>
          <router-link :to="file.key">{{ file.key }}</router-link>
        </td>
        <td>{{ formatDatetime(file.lastModified) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    keyProp: String,
  },
  emit: ["move"],
  data() {
    return {
      files: [],
      folders: new Set(),
      isFetching: true,
    };
  },
  methods: {
    async listObjects(key) {
      // TODO: 階層のみ表示
      this.files = [];
      this.folders = new Set();

      // 現在の階層を取得("/"の数を階層とする)
      const level = (key.match(/\//g) || []).length

      this.isFetching = true;
      const config = {
        // TODO: paging
        // https://docs.amplify.aws/lib/storage/list/q/platform/js/#paginated-file-access
        pageSize: 100
      }
      const response = await Storage.list(key, config);
      this.isFetching = false;

      response.results.forEach((res) => {
        // 階層が同じものだけを対象とする(フォルダーは+1階層)
        const resLevel = (res.key.match(/\//g) || []).length

        if (res.size) {
          if (level == resLevel) this.files.push(res)
          // sometimes files declare a folder with a / within then
          let possibleFolder = res.key.split("/").slice(0, -1).join("/")
          if (possibleFolder) {
            if (level + 1 == resLevel) this.folders.add(possibleFolder)
          }
        } else {
          this.folders.add(res.key);
        }
      });
    },
  },
  watch: {
    keyProp(newValue, oldValue) {
      this.listObjects(newValue);
    },
  },
};
</script>