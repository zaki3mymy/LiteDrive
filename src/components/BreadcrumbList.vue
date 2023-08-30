<template>
  <span v-for="crumb in crumbs" :key="crumb.link">
    <router-link :to="crumb.path" @click="updateBreadcrumb">{{ crumb.name }}</router-link> /
  </span>
</template>

<script>
class Breadcrumb {
  constructor(path) {
    if (!path.endsWith('/')) {
      path += '/'
    }
    this.path = path.startsWith('/') ? path : '/' + path

    // パスの最下層をnameとする
    let tmp = path.split('/')
    let name = tmp[tmp.length - 2]
    this.name = name
  }
}

export default {
  props: {
    path: String
  },
  emits: ['onClick'],
  data() {
    return {
      crumbs: []
    }
  },
  methods: {
    updateBreadcrumb(e) {
      const path = e.target.attributes.href.value
      this.$emit('onClick', path)
    },
    generateBreadcrumbList(pathVar) {
      this.crumbs = []
      if (!pathVar) return

      let path = pathVar;
      // 末尾に"/"があるとsplitした配列の最後の要素が空白になってしまうため、末尾"/"を除去
      if (pathVar.endsWith('/')) {
        path = pathVar.slice(0, pathVar.length - 1)
      }

      let tmp = path.split('/')
      let crumbs = []
      for (let i = 0; i < tmp.length; i++) {
        let pathArr = tmp.slice(0, i + 1)
        let path = pathArr.join('/')
        crumbs.push(new Breadcrumb(path))
      }

      this.crumbs = crumbs
    }
  },
  updated() {
    this.generateBreadcrumbList(this.path)
  }
}
</script>