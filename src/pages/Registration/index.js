import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import { Navigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { RegistrationTextFields } from '../../components';

import styles from './Registration.module.scss';

export const Registration = () => {
    const [showPassword, setShowPassword] = useState(false);
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
        },
        mode: 'onChange',
    });

    const onSubmit = async (values) => {
        try {
            setIsSubmitting((prevState) => !prevState);
            const data = await dispatch(fetchRegister(values));
            setIsSubmitting((prevState) => !prevState);

            if (data.meta.requestStatus === 'rejected') {
                await Promise.reject(data.error.message);
            } else if ('token' in data?.payload) {
                window.localStorage.setItem('token', data.payload.token);
            }
        } catch (err) {
            console.log(err);
            setError('RegisterError', { type: 'custom', message: JSON.parse(err) });
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
                Создание аккаунта
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <RegistrationTextFields errors={errors} register={register} showPassword={showPassword}
                                        handleClickShowPassword={handleClickShowPassword} />
                <Button
                    type='submit'
                    size='large'
                    variant='contained'
                    disabled={!isValid || isSubmitting}
                    fullWidth
                >
                    Зарегистрироваться
                </Button>
            </form>
        </Paper>
    );
};
