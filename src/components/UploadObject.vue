<script lang="ts" setup>
import { Storage } from 'aws-amplify'

const uploadObject = () => {
  if (!key) {
    alert("ファイルパスを入力してください。");
    return;
  }
  Storage.put(key, "あああ"
    ).then(result => {
      console.log(result);
    }).catch(err => console.error(err))
}
let key = "";
</script>

<template>
  <div>
    <input v-model="key" placeholder="path/to/object"/>
    <button v-on:click="uploadObject">upload!</button>
  </div>
</template>