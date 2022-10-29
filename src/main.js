import { createApp } from 'vue'
import { createStore } from "vuex";
import App from './App.vue'
import createStoreGame from './store'
import VueDragscroll from "vue-dragscroll";

const store = createStore(createStoreGame);

const app = createApp(App);
app.use(store);
app.use(VueDragscroll);
app.mount("#app");

