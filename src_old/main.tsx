import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {HomeView} from "./components/HomeView.tsx";
import {LoginScreen} from "./components/LoginScreen.tsx";
import {Route, Router} from "wouter";
import {UserOrders} from "./components/UserOrders.tsx";
import {OrderSummary} from "./components/OrderSummary.tsx";

// TODO: redirect to login if no cookie
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Router>
            <Route path="/" component={LoginScreen}/>
            <Route path="/home" component={HomeView}/>
            <Route path="/orders/:userName" component={(props) => UserOrders(props.params.userName)}/>
            <Route path="/order-summary" component={OrderSummary}/>
        </Router>
    </StrictMode>,
)
