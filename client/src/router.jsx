import { createBrowserRouter, redirect } from "react-router-dom";
import Login from "./components/login";
import Home from "./pages/Home";


export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login/>,
    loader: () => {
        if(localStorage.getItem("accessToken")) {
            return redirect('/publics')
        }
        return null
    }
  },
  {
    path: "/publics",
    element: <Home/>,
    loader: () => {
        if(!localStorage.getItem("accessToken")) {
            return redirect('/login')
        }
        return null;
    }
  },
]);