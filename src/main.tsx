import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {HomeView} from "./components/HomeView.tsx";
import {LoginScreen} from "./components/LoginScreen.tsx";

/*
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
 */

// TODO: redirect to login if no cookie
const router = createBrowserRouter([
        {
            path: "/",
            element: <LoginScreen/>,
        },
        {
            path: "/home",
            element: <HomeView/>,
        },
    ]
);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <>
            <RouterProvider router={router}/>
        </>
    </StrictMode>,
)
