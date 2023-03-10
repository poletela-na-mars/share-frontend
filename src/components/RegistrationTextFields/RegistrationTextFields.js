import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import styles from '../../pages/Registration/Registration.module.scss';

const FULLNAME = 'fullName';
const EMAIL = 'email';
const PASSWORD = 'password';

export const RegistrationTextFields = ({ errors, register, showPassword, handleClickShowPassword }) => {
    console.log(errors);
    const errorMsg = errors.RegisterError?.message;

    const findErrorMsgWithParam = (param) => {
        return errorMsg instanceof Array
            ? errorMsg.find((msg) => msg.param === param)?.msg
            : param === PASSWORD && errorMsg?.message;
    };

    return (
        <>
            <TextField
                className={styles.field}
                label='Полное имя'
                placeholder='Щукова Елена'
                fullWidth
                required={true}
                error={Boolean(findErrorMsgWithParam(FULLNAME))}
                helperText={findErrorMsgWithParam(FULLNAME)}
                inputProps={{ maxLength: 40 }}
                {...register(FULLNAME, { required: 'Укажите полное имя' })}
            />
            <TextField
                className={styles.field}
                label='E-Mail'
                fullWidth
                error={Boolean(findErrorMsgWithParam(EMAIL))}
                helperText={findErrorMsgWithParam(EMAIL)}
                {...register('email', { required: 'Укажите e-mail' })}
                type='email'
                inputProps={{ maxLength: 40 }}
                required={true}
            />
            <TextField
                className={styles.field}
                label='Пароль'
                fullWidth
                error={Boolean(findErrorMsgWithParam(PASSWORD))}
                helperText={findErrorMsgWithParam(PASSWORD)}
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
