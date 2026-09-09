import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GlobalStyle } from './styles/global';
import { AudioProvider } from './contexts/AudioContext';
import { CharacterCreationProvider } from './contexts/CharacterCreationContext';
import { LauncherPage } from './pages/LauncherPage';
import { ClassSelectPage } from './pages/ClassSelectPage';
import { OptionsPage } from './pages/OptionsPage';
import { RaceSelectPage } from './pages/RaceSelectPage';
import { DeitySelectPage } from './pages/DeitySelectPage';
import { DeckSelectPage } from './pages/DeckSelectPage';
import { DeckViewPage } from './pages/DeckViewPage';
import { NameSelectPage } from './pages/NameSelectPage';
import { AttributeDistPage } from './pages/AttributeDistPage';
import { EquipmentPage } from './pages/EquipamentPage';
import { BagPage } from './pages/BagPage';
import { MapScreen } from './pages/MapScreen';
import { BestiaryPage } from './pages/BestiaryPage';

function App() {
  return (
    <BrowserRouter>
      <AudioProvider>
        <CharacterCreationProvider>
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
            <Route path="/options" element={<OptionsPage />} />
            <Route path="/race-select" element={<RaceSelectPage />} />
            <Route path="/deity-select" element={<DeitySelectPage />} />
            <Route path="/deck-select" element={<DeckSelectPage />} />
            <Route path="/deck-view" element={<DeckViewPage />} />
            <Route path="/name-select" element={<NameSelectPage />} />
            <Route path="/attribute-dist" element={<AttributeDistPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/bag" element={<BagPage />} />
            <Route path="/map" element={<MapScreen />} />
            <Route path="/bestiary" element={<BestiaryPage />} />
          </Routes>
        </CharacterCreationProvider>
      </AudioProvider>
    </BrowserRouter>
  );
}

export default App;
