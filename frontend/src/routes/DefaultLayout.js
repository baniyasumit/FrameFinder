// layouts/ClientLayout.js
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";

const DefaultLayout = () => (
    <>
        <Header />
        <Outlet />
    </>
);

export default DefaultLayout;
