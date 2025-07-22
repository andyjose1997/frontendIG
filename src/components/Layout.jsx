import Header from './Header';
import Rodape from '../pages/Rodape'; // 👈 Correto!
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <>
            <Header />
            <Outlet />
            <Rodape />
        </>
    );
}
