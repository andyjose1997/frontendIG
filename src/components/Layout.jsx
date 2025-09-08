import Header from './header';
import Rodape from '../pages/rodape'; // 👈 Correto!
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
