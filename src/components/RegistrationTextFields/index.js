import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import styles from '../../pages/Registration/Registration.module.scss';

const Credentials = {
    FullName: 'fullName',
    Email: 'email',
    Password: 'password',
};

export const RegistrationTextFields = ({ errors, register, showPassword, handleClickShowPassword }) => {
    console.log(errors);
    const errorMsg = errors.RegisterError?.message;

    const findErrorMsgWithParam = (param) => {
        return errorMsg instanceof Array
            ? errorMsg.find((msg) => msg.param === param)?.msg
            : param === Credentials.Password && errorMsg?.message;
    };

    return (
        <>
            <TextField
                className={styles.field}
                label='Полное имя'
                placeholder='Щукова Елена'
                fullWidth
                required={true}
                error={Boolean(findErrorMsgWithParam(Credentials.FullName))}
                helperText={findErrorMsgWithParam(Credentials.FullName)}
                inputProps={{ maxLength: 40 }}
                {...register(Credentials.FullName, { required: 'Укажите полное имя' })}
            />
            <TextField
                className={styles.field}
                label='E-Mail'
                fullWidth
                error={Boolean(findErrorMsgWithParam(Credentials.Email))}
                helperText={findErrorMsgWithParam(Credentials.Email)}
                {...register(Credentials.Email, { required: 'Укажите e-mail' })}
                type='email'
                inputProps={{ maxLength: 40 }}
                required={true}
            />
            <TextField
                className={styles.field}
                label='Пароль'
                fullWidth
                error={Boolean(findErrorMsgWithParam(Credentials.Password))}
                helperText={findErrorMsgWithParam(Credentials.Password)}
                {...register(Credentials.Password, { required: 'Укажите пароль' })}
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
