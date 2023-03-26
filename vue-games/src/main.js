import {createApp} from 'vue';
import router from './router';

import App from './App';
import axios from 'axios';
import VueAxios from "vue-axios";


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

const app = createApp(App);

app.use(router);  // tell app to use router
app.use(VueAxios, axios);  // tell app to use axios
app.mount("#app");  // mount our app on the div#app element in our template

