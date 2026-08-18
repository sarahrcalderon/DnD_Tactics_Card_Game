import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { GlobalStyle } from './styles/global';

import { LauncherPage } from './pages/LauncherPage';
import { ClassSelectPage } from './pages/ClassSelectPage';
import { RaceSelectPage } from './pages/RaceSelectPage';
import { CharacterPage } from './pages/CharacterPage';
import { BattlePage } from './pages/BattlePage';

function App() {
  return (
    <BrowserRouter>
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

      <Routes>
        <Route path="/" element={<LauncherPage />} />

        <Route path="/class-select" element={<ClassSelectPage />} />

        <Route path="/race-select" element={<RaceSelectPage />} />

        <Route path="/character" element={<CharacterPage />} />

        <Route path="/battle" element={<BattlePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
