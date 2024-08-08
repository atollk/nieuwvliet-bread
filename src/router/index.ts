import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginPage from "@/views/LoginView.vue";
import MyOrdersView from "@/views/MyOrdersView.vue";
import OrderSummaryView from "@/views/OrderSummaryView.vue";

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "login",
            component: LoginPage,
        },
        {
            path: "/home",
            name: "home",
            component: HomeView,
        },
        {
            path: "/my-orders/:userName",
            name: "orders",
            component: MyOrdersView,
            props: true,
        },
        {
            path: "/order-summary",
            name: "order-summary",
            component: OrderSummaryView,
        }
    ],
});

export default router;
