import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { LoginTextFields } from '../../components';
import Avatar from '@mui/material/Avatar';

import { fetchAuth, selectIsAuth } from '../../redux/slices/auth';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import styles from './Login.module.scss';

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange',
    });

    const onSubmit = async (values) => {
        try {
            setIsSubmitting((prevState) => !prevState);
            const data = await dispatch(fetchAuth(values));
            setIsSubmitting((prevState) => !prevState);

            console.log(data);
            if (data.meta.requestStatus === 'rejected') {
                await Promise.reject(data.error.message);
            } else if ('token' in data?.payload) {
                window.localStorage.setItem('token', data.payload.token);
            }
        } catch (err) {
            console.log(err);
            setError('LoginError', { type: 'custom', message: err });
        }
    };

    if (isAuth) {
        return <Navigate to='/' />;
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Paper classes={{ root: styles.root }}>
            <Avatar
                alt='Logo'
                sx={{ width: 56, height: 56, marginBottom: '20px' }}
                src={'/logo.png'}
            />
            <Typography classes={{ root: styles.title }} variant='h5'>
                ???????? ?? ??????????????
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <LoginTextFields errors={errors} register={register} showPassword={showPassword}
                                 handleClickShowPassword={handleClickShowPassword} />
                <Button
                    type="submit"
                    size='large'
                    variant='contained'
                    disabled={!isValid || isSubmitting}
                    fullWidth
                >
                    ??????????
                </Button>
            </form>
        </Paper>
    );
};
