import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import styles from './Header.module.scss';

export const Header = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);

    //TODO - не показывает ошибки, когда неправильный e-mail или пароль
    const onClickLogout = () => {
        //TODO - сделать попап с вопросом
        if (window.confirm('Вы действительно хотите выйти?')) {
            dispatch(logout());
            window.localStorage.removeItem('token');
        }
    };

    return (
        <div className={styles.root}>
            <Container maxWidth='lg'>
                <div className={styles.inner}>
                    <Link className={styles.logo} to='/'>
                        <div>Share</div>
                    </Link>
                    <div className={styles.buttons}>
                        {isAuth ? (
                            <>
                                <Button onClick={onClickLogout} variant='contained' color='error'>
                                    Выйти
                                </Button>
                                <Link to='/add-post'>
                                    <Button variant='contained'>Написать статью</Button>
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
    );
};

//TODO -сменить черный
//TODO -favicon