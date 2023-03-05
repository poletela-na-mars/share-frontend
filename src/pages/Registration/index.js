import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import { Navigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Registration.module.scss';
import { InputAdornment } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ModalWindow } from '../../components/ModalWindow/ModalWindow';

export const EmailTextField = ({errors, register}) => {
    return (
        <TextField
            className={styles.field}
            label='E-Mail'
            fullWidth
            error={Boolean(errors.email?.message)}
            helperText={errors.email?.message}
            {...register('email', {required: 'Укажите e-mail'})}
            type='email'
            inputProps={{maxLength: 40}}
            required={true}
        />
    )
};

export const PasswordTextField = ({errors, showPassword, register, handleClickShowPassword}) => {
    return (
        <TextField
            className={styles.field}
            label='Пароль'
            fullWidth
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            {...register('password', {required: 'Укажите пароль'})}
            type={showPassword ? 'text' : 'password'}
            required={true}
            inputProps={{maxLength: 40}}
            InputProps={{
                endAdornment:
                    <InputAdornment position='end' sx={{marginRight: 1}}>
                        <IconButton
                            onClick={handleClickShowPassword}
                            edge='end'
                        >
                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                        </IconButton>
                    </InputAdornment>
            }}
        />
    )
};

export const Registration = () => {
    const [showPassword, setShowPassword] = useState(false);
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();

    const [openPopup, setOpenPopup] = useState(false);
    const [errorText, setErrorText] = useState('');

    const openPopupHandler = () => {
        setOpenPopup(true);
    };

    const closePopupHandler = () => {
        setOpenPopup(false);
    };

    //TODO - setError - добавить ошибки валидации из бэка + в Login
    const {register, handleSubmit, setError, formState: {errors, isValid}} = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
        },
        mode: 'onChange',
    });

    const onSubmit = async (values) => {
        try {
            const data = await dispatch(fetchRegister(values));

            if (!data.payload) {
                setErrorText('Не удалось зарегистрироваться.\nПерезагрузите страницу и попробуйте снова.');
                openPopupHandler();
            }

            if ('token' in data.payload) {
                window.localStorage.setItem('token', data.payload.token);
            }
        } catch (err) {
            console.error(err);
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
            <ModalWindow openPopup={openPopup}
                         closePopupHandler={closePopupHandler}
                         text={errorText}
                         error={true}
            />
            <Avatar
                alt='logo'
                sx={{ width: 56, height: 56, marginBottom: '20px' }}
                src={'/logo.png'}
            />
            <Typography classes={{root: styles.title}} variant='h5'>
                Создание аккаунта
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label='Полное имя'
                    placeholder='Щукова Елена'
                    fullWidth
                    required={true}
                    error={Boolean(errors.fullName?.message)}
                    helperText={errors.fullName?.message}
                    inputProps={{maxLength: 40}}
                    {...register('fullName', {required: 'Укажите полное имя'})}
                />
                <EmailTextField errors={errors} register={register}/>
                <PasswordTextField showPassword={showPassword} handleClickShowPassword={handleClickShowPassword}
                                   errors={errors} register={register}/>
                <Button
                    type='submit'
                    size='large'
                    variant='contained'
                    disabled={!isValid}
                    fullWidth
                >
                    Зарегистрироваться
                </Button>
            </form>
        </Paper>
    );
};
