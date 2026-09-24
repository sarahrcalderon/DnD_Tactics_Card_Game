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
import { AuthProvider } from './contexts/AuthContext';
import { OnlineLayout } from './components/online/OnlineLayout';
import { LoginPage } from './pages/LoginPage';
import { OnlineMenuPage } from './pages/OnlineMenuPage';
import { FriendsPage } from './pages/FriendsPage';
import { InvitationsPage } from './pages/InvitationsPage';
import { CreateMatchPage } from './pages/CreateMatchPage';
import { OnlineCharactersPage } from './pages/OnlineCharactersPage';
import { OnlineDecksPage } from './pages/OnlineDecksPage';
import { LobbyPage } from './pages/LobbyPage';
import { PasswordResetPage } from './pages/PasswordResetPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage register />} />
            <Route path="/forgot-password" element={<PasswordResetPage />} />
            <Route path="/reset-password" element={<PasswordResetPage confirm />} />
            <Route path="/online" element={<OnlineLayout />}>
              <Route index element={<OnlineMenuPage />} />
              <Route path="friends" element={<FriendsPage />} />
              <Route path="invites" element={<InvitationsPage />} />
              <Route path="characters" element={<OnlineCharactersPage />} />
              <Route path="decks" element={<OnlineDecksPage />} />
              <Route path="create" element={<CreateMatchPage />} />
              <Route path="lobby/:matchId" element={<LobbyPage />} />
            </Route>
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
