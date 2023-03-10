import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import styles from '../../pages/Registration/Registration.module.scss';

export const LoginTextFields = ({ errors, register, showPassword, handleClickShowPassword }) => {
    console.log(errors);
    return (
        <>
            <TextField
                className={styles.field}
                label='E-Mail'
                fullWidth
                error={Boolean(errors.LoginError?.message)}
                helperText={errors.email?.message}
                {...register('email', { required: 'Укажите e-mail' })}
                type='email'
                inputProps={{ maxLength: 40 }}
                required={true}
            />
            <TextField
                className={styles.field}
                label='Пароль'
                fullWidth
                error={Boolean(errors.LoginError?.message)}
                helperText={errors.LoginError?.message}
                {...register('password', { required: 'Укажите пароль' })}
                type={showPassword ? 'text' : 'password'}
                required={true}
                inputProps={{ maxLength: 40 }}
                InputProps={{
                    endAdornment:
                        <InputAdornment position='end' sx={{ marginRight: 1 }}>
                            <IconButton
                                onClick={handleClickShowPassword}
                                edge='end'
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                }}
            />
        </>
    )
};
