import {createApp} from 'vue';
import router from './router';

import App from './App';

const app = createApp(App);

app.use(router);  // tell app to use router
app.mount("#app");  // mount our app on the div#app element in our template

