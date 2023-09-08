import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Amplify
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

// Amplify UI Vue
import AmplifyVue from '@aws-amplify/ui-vue';
import '@aws-amplify/ui-vue/styles.css';

// Materialize CCS
import 'materialize-css/dist/css/materialize.min.css'
import 'material-icons/iconfont/material-icons.css';

// i18n
import { createI18n } from 'vue-i18n';
import messages from './assets/messages'


const app = createApp(App)
app.config.productionTip = false;

const user_locale = window.navigator.language;
const i18n = createI18n({
  locale: user_locale,
  messages
})

app.use(router)
app.use(AmplifyVue);
app.use(i18n)
app.mount('#app')
