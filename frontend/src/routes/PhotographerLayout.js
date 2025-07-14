import { Outlet } from "react-router-dom";
import PhotographerHeader from "../components/Header/PhotographerHeader";

const PhotographerLayout = () => (
    <>
        <PhotographerHeader />
        <Outlet />
    </>
);

export default PhotographerLayout;
