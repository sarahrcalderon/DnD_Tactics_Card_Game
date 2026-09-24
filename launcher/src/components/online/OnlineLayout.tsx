import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Button } from '../common/Button';
import { Feedback } from './Feedback';
import { loadoutService } from '../../services/loadoutService';
import {
  Brand,
  AccountAvatar,
  AccountIdentity,
  AvatarUploadButton,
  HiddenFileInput,
  Header,
  Layout,
  Main,
  Navigation,
  Row,
  World,
} from '../../styles/onlineStyles';

export function OnlineLayout() {
  const auth = useAuth();
  const location = useLocation();
  const [checkingCharacter, setCheckingCharacter] = useState(true);
  const [hasCharacter, setHasCharacter] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInput = useRef<HTMLInputElement>(null);
  const characterPortrait = (() => {
    try {
      return JSON.parse(localStorage.getItem('characterData') || 'null')?.raceImage as string | undefined;
    } catch {
      return undefined;
    }
  })();
  const avatarSource = auth.user?.avatar_url || characterPortrait;

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.[0];
    if (!image) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(image.type) || image.size > 3 * 1024 * 1024) {
      toast.error('Escolha uma imagem JPG, PNG ou WebP de até 3 MB.');
      event.target.value = '';
      return;
    }
    setUploadingAvatar(true);
    try {
      await auth.uploadAvatar(image);
      toast.success('Imagem de perfil atualizada.');
    } catch {
      toast.error('Não foi possível enviar a imagem. Tente novamente.');
    } finally {
      setUploadingAvatar(false);
      event.target.value = '';
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    if (!auth.token || auth.loading) return () => controller.abort();

    setCheckingCharacter(true);
    loadoutService.hasCharacters(controller.signal)
      .then((value) => !controller.signal.aborted && setHasCharacter(value))
      .catch(() => !controller.signal.aborted && setHasCharacter(false))
      .finally(() => !controller.signal.aborted && setCheckingCharacter(false));

    return () => controller.abort();
  }, [auth.token, auth.loading, location.pathname]);

  if (!auth.token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!auth.loading && checkingCharacter) {
    return <World><Main>Verificando seu personagem...</Main></World>;
  }

  if (!auth.loading && !checkingCharacter && !hasCharacter) {
    return <Navigate to="/class-select" replace />;
  }

  return (
    <World>
      <Header>
        <Brand>
          DUNGEONS TACTICS
          <small>CRÔNICAS DE UMA EXPEDIÇÃO</small>
        </Brand>

        <Row>
          <AccountIdentity>
            <AvatarUploadButton type="button" onClick={() => avatarInput.current?.click()} title="Trocar imagem de perfil">
              {avatarSource ? (
                <AccountAvatar src={avatarSource} alt={`Avatar de ${auth.user?.username || 'usuário'}`} />
              ) : (
                <AccountAvatar as="span" aria-label={`Avatar de ${auth.user?.username || 'usuário'}`}>
                  {auth.user?.username?.slice(0, 1).toUpperCase() || '?'}
                </AccountAvatar>
              )}
              <span>{uploadingAvatar ? '...' : 'Editar'}</span>
            </AvatarUploadButton>
            <HiddenFileInput ref={avatarInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatarChange} />
            <span>{auth.user?.username}</span>
          </AccountIdentity>
          <Button $tone="quiet" onClick={auth.logout}>
            Sair da conta
          </Button>
        </Row>
      </Header>

      <Layout>
        <Navigation aria-label="Menu online">
          <NavLink to="/online" end>
            Jogar
          </NavLink>
          <NavLink to="/online/friends">Amigos</NavLink>
          <NavLink to="/online/invites">Convites</NavLink>
          <NavLink to="/attribute-dist">Ficha do personagem</NavLink>
          <NavLink to="/online/decks">Deck</NavLink>
        </Navigation>

        <Main>
          <Feedback
            loading={auth.loading}
            error={auth.error}
            retry={auth.retry}
          />

          {!auth.loading && !auth.error && auth.user && <Outlet />}
        </Main>
      </Layout>
    </World>
  );
}
