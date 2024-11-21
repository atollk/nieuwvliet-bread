import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createRouter, createWebHistory} from "vue-router";
import {HomeView} from "./views/HomeView.tsx";
import {LoginScreenView} from "./views/LoginScreenView.tsx";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: LoginScreenView,
        },
        {
            path: "/home",
            component: HomeView,
        }
    ]
})

createApp(App)
    .use(router)
    .mount('#app')
