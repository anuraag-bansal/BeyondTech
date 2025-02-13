import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2", // Blue (Primary Color)
        },
        secondary: {
            main: "#ff9800", // Orange (Secondary Color)
        },
    },
    typography: {
        fontFamily: "'Roboto', sans-serif",
        h4: {
            fontWeight: 600,
        },
    },
});

export default theme;
