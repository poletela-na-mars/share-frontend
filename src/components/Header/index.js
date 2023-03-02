import { Link } from 'react-router-dom';
import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import styles from './Header.module.scss';
import { theme } from '../../theme';
import { ThemeProvider } from '@mui/material';
import { ModalWindow } from '../ModalWindow/ModalWindow';

export const Header = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);
    const [openSelectionPopup, setOpenSelectionPopup] = useState(false);

    const logoutButtonClickHandler = () => {
        setOpenSelectionPopup(true);
    };

    const closeSelectionPopupHandler = () => {
        setOpenSelectionPopup(false);
    };

    const logoutHandler = () => {
        dispatch(logout());
        window.localStorage.removeItem('token');
        setOpenSelectionPopup(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <div className={styles.root}>
                <Container maxWidth='lg'>
                    <div className={styles.inner}>

                        <ModalWindow openPopup={openSelectionPopup}
                                     closePopupHandler={closeSelectionPopupHandler}
                                     actionHandler={logoutHandler}
                                     text='Вы действительно хотите выйти?'
                                     error={false}
                        />

                        <Link className={styles.logo} to='/'>
                            <div>Share</div>
                        </Link>
                        <div className={styles.buttons}>
                            {isAuth ? (
                                <>
                                    <Button onClick={logoutButtonClickHandler} variant='contained'>
                                        Выйти
                                    </Button>
                                    <Link to='/add-post'>
                                        <Button variant='contained'
                                                style={{ backgroundColor: theme.palette.primary.light }}
                                        >
                                            Написать статью
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to='/login'>
                                        <Button variant='outlined'>Войти</Button>
                                    </Link>
                                    <Link to='/register'>
                                        <Button variant='contained'>Зарегистрироваться</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </Container>
            </div>
        </ThemeProvider>
    );
};
