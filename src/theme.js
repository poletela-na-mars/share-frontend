import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    shadows: ['none'],
    palette: {
        primary: {
            main: '#003333',
        },
    },
    typography: {
        button: {
            textTransform: 'none',
            fontWeight: 400,
        },
    },
});

theme.shadows[1] = theme.shadows[0];
