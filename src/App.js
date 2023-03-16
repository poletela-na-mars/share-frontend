import { useEffect } from 'react';

import { fetchAuthMe } from './redux/slices/auth';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Header } from './components';
import { AddPost, FullPost, Home, Login, Registration, NotFound } from './pages';

import Container from '@mui/material/Container';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAuthMe());
    }, [dispatch]);

    return (
        <>
            <Header />
            <Container maxWidth='lg'>
                <Routes>
                    <Route path='*' element={<NotFound />} />
                    <Route path='/' element={<Home />} />
                    <Route path='/posts/:id' element={<FullPost />} />
                    <Route path='/posts/:id/edit' element={<AddPost />} />
                    <Route path='/add-post' element={<AddPost />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Registration />} />
                </Routes>
            </Container>
        </>
    );
}

export default App;
