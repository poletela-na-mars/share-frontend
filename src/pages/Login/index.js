import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { fetchAuth, selectIsAuth } from '../../redux/slices/auth';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import styles from './Login.module.scss';
import { EmailTextField, PasswordTextField } from '../Registration';

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();

    const {register, handleSubmit, setError, formState: {errors, isValid}} = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange',
    });

    const onSubmit = async (values) => {
        const data = await dispatch(fetchAuth(values));

        //TODO - сделать попап с ошибкой
        if (!data.payload) {
            return alert('Не удалось авторизоваться');
        }

        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token);
        }
    };

    if (isAuth) {
        return <Navigate to='/'/>;
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Paper classes={{root: styles.root}}>
            <Typography classes={{root: styles.title}} variant='h5'>
                Вход в аккаунт
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <EmailTextField errors={errors} register={register}/>
                <PasswordTextField showPassword={showPassword} handleClickShowPassword={handleClickShowPassword}
                                   errors={errors} register={register}/>
                <Button
                    type="submit"
                    size='large'
                    variant='contained'
                    disabled={!isValid}
                    fullWidth
                >
                    Войти
                </Button>
            </form>
        </Paper>
    );
};
