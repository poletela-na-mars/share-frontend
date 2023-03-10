import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    shadows: ['none'],
    palette: {
        primary: {
            main: '#003333',
            light: '#006666',
        },
        gray: {
            dark: 'rgba(0,0,0,.1)',
        },
        light: {
            light: '#FFF',
        },
    },
    typography: {
        button: {
            textTransform: 'none',
            fontWeight: 400,
        },
    },
    shape: {
        lightRoundedBorderRadius: '20px',
        roundedBorderRadius: '50px',
        borderRadius: 6,
    },
});

theme.shadows[1] = theme.shadows[0];
theme.shadows[8] = theme.shadows[0];
