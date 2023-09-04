<script>
import M from 'materialize-css'

const infoMessage = (msg) => {
  const options = {
    html: msg,
    classes: 'blue-grey lighten-4 black-text'
  }
  M.toast(options)
}

const errorMessage = (msg) => {
  const options = {
    html: msg,
    classes: 'red lighten-1'
  }
  M.toast(options)
}

export { infoMessage, errorMessage }
</script>