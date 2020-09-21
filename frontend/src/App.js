import React, { useState } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { ToastContainer, Slide } from 'react-toastify';
import { setDebug } from './common/consoleUtil.js';
import { defaultTheme, darkTheme } from './theme/themes.js';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import HeaderComponents from './header/headerComponents.js';
import MainComponents from './main/mainComponents.js';

setDebug(true);

const useDarkMode = () => {

  const [theme, setTheme] = useState(defaultTheme);

  const { palette: { type } } = theme;

  const toggleDarkMode = () => {
    const thisType = type === 'light' ? 'dark' : 'light';
    const updatedTheme = {
      ...theme,
      palette: {
        ...theme.palette,
        primary: (type === 'dark') ? defaultTheme.palette.primary : darkTheme.palette.primary,
        secondary: (type === 'dark') ? defaultTheme.palette.secondary : darkTheme.palette.secondary,
        type: thisType        
      }
    };
    setTheme(updatedTheme);
    // SnackbarService.info('Theme changed to ' + thisType);
  };

  return [theme, toggleDarkMode];
}
// const notistackRef = React.createRef();
// const onClickDismiss = key => () => {
//   debugLog('key=' + key);
//   notistackRef.current.closeSnackbar(key);
// };

function App() {

  // const userPreferenceMode = useMediaQuery('(prefers-color-scheme: light)');
  const [theme, toggleDarkMode] = useDarkMode();

  const themeConfig = createMuiTheme(theme);

  return (
    <ThemeProvider theme={themeConfig}>
      <ToastContainer
        position="top-right"
        autoClose={6000}
        limit={5}
        transition={Slide}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        draggable={false}
        pauseOnFocusLoss
        pauseOnHover
      />
      {/* <SnackbarProvider maxSnack={5}
        ref={notistackRef}
        action={(key) => (
          <IconButton style={{color: "#d3dff2"}} 
                      onClick={onClickDismiss(key)} 
                      aria-label="Dismiss" size="small">
            <CloseIcon />
          </IconButton>
        )}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}>
        <SnackbarServiceConfigurator /> */}

        <CssBaseline />

        <header>
          <HeaderComponents handler={toggleDarkMode} theme={theme} />
        </header>

        <main>
          <MainComponents theme={theme} />
        </main>

        <footer></footer>
            
      {/* </SnackbarProvider> */}
    </ThemeProvider>
  );
}

export default App;
