<template>
  <nav class="blue-grey darken-4">
    <div class="nav-wrapper">
      <div class="container">
        <div class="row">
          <div class="col s12">
            <a href="/" class="brand-logo">{{ $t("title") }}</a>
            <div class="right">
              <button
                class="waves-effect waves-light blue-grey btn hide-on-small-only"
                @click="signOut"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    signOut: null
  }
}
</script>