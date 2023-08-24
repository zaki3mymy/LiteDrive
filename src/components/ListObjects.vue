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
            v-on:click="folderClicked('/' + folder + '/')"
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
    keyProp: "",
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
    folderClicked(path) {
      this.$emit("move", path);
    },
    async listObjects(key) {
      // TODO: 階層のみ表示
      this.files = [];
      this.folders = new Set();

      this.isFetching = true;
      console.log("listobjects " + key);
      const response = await Storage.list(key);
      console.log(response);
      this.isFetching = false;

      response.results.forEach((res) => {
        if (res.size) {
          this.files.push(res);
          // sometimes files declare a folder with a / within then
          let possibleFolder = res.key.split("/").slice(0, -1).join("/");
          if (possibleFolder) this.folders.add(possibleFolder);
        } else {
          this.folders.add(res.key);
        }
      });
      // console.log(files);
      // console.log(folders);

      // this.files = files;
      // this.folders = folders;
    },
  },
  watch: {
    keyProp(newValue, oldValue) {
      console.log("----", newValue);
      this.listObjects(newValue);
    },
  },
};
</script>