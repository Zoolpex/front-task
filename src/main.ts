import "@fontsource/inter/400.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/700.css"
import "@fontsource/koulen/400.css"

import "./assets/base.css"

import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"

createApp(App).use(router).mount("#app")
