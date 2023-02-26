import { Link } from 'react-router-dom';
import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import styles from './Header.module.scss';
import { theme } from '../../theme';
import { Box, Fade, Modal, ThemeProvider } from '@mui/material';

export const CustomModal = ({ openSelectionPopup, closeSelectionPopupHandler, actionHandler, text }) => {
    const styleBoxPopup = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'lg',
        bgcolor: 'background.paper',
        borderRadius: theme.shape.lightRoundedBorderRadius,
        p: 4,
    };

    return (
        <Modal
            aria-labelledby='modal-question'
            className='selection-popup'
            open={openSelectionPopup}
            onClose={closeSelectionPopupHandler}
            closeAfterTransition
        >
            <Fade in={openSelectionPopup}>
                <Box sx={styleBoxPopup} className='selection-popup__paper'>
                    <h3 className='selection-popup__question' id='modal-question'>{text}</h3>
                    <Box component='div' className='selection-popup__buttons-container'
                         sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        <Button className='selection-popup__yes-button'
                                sx={{ marginLeft: '20px', marginRight: '20px' }}
                                onClick={actionHandler}>Да
                        </Button>
                        <Button className='selection-popup__no-button'
                                sx={{ marginLeft: '20px', marginRight: '20px' }}
                                onClick={closeSelectionPopupHandler}>Нет
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

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

    //TODO - не показывает ошибки, когда неправильный e-mail или пароль
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

                        <CustomModal openSelectionPopup={openSelectionPopup}
                                     closeSelectionPopupHandler={closeSelectionPopupHandler}
                                     actionHandler={logoutHandler}
                                     text='Вы действительно хотите выйти?'
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
