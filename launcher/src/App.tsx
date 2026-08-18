// launcher/src/App.tsx
import { Toaster } from 'react-hot-toast';
import { GlobalStyle } from './styles/global';
import { LauncherPage } from './pages/LauncherPage';

function App() {
  return (
    <>
      <GlobalStyle />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1730',
            color: '#ffffff',
            border: '1px solid #3e3752',
          },
        }}
      />
      <LauncherPage />
    </>
  );
}

export default App;
