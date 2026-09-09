import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { characterStorageService } from '../services/characterStorageService';
import { saveService } from '../services/saveService';
import type { AttributeDistributionRouteState } from '../types/attributeDist.types';
import type { Attributes, DerivedStats } from '../types/character.types';
import { TOTAL_POINTS } from '../data/attributeDistData';

interface UseCharacterPersistenceParams {
  attributes: Attributes;
  derivedStats: DerivedStats;
  className: string;
  classId: string;
  raceId?: string;
  raceName?: string;
  raceImage?: string;
  raceIcon?: string;
  deityId?: string;
  deityName?: string;
  deckId: string;
  pointsRemaining: number;
  onLoadAttributes: (attributes: Attributes, pointsRemaining: number) => void;
}

export const useCharacterPersistence = ({
  attributes,
  derivedStats,
  className,
  classId,
  raceId,
  raceName,
  raceImage,
  raceIcon,
  deityId,
  deityName,
  deckId,
  pointsRemaining,
  onLoadAttributes,
}: UseCharacterPersistenceParams) => {
  const location = useLocation();

  // Estados internos
  const [characterName, setCharacterName] = useState('');
  const [imageError, setImageError] = useState(false);
  const [isCharacterSaved, setIsCharacterSaved] = useState(false);
  const [saveId, setSaveId] = useState<string | null>(null);
  const [storedDeckId, setStoredDeckId] = useState<string | null>(null);
  const [deckName, setDeckName] = useState(''); // <-- AGORA DECLARADO
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPersistenceLoaded, setIsPersistenceLoaded] = useState(false);

  // Carregar dados ao montar / quando location.state mudar
  useEffect(() => {
    const state = location.state as AttributeDistributionRouteState | null;
    const savedData = characterStorageService.load();
    const hasRoutedAttributes = Boolean(state?.attributes);

    if (state?.attributes) {
      onLoadAttributes(
        state.attributes,
        state.pointsRemaining ?? TOTAL_POINTS,
      );
    }

    // Dados recebidos da navegação (personagem já salvo)
    if (state?.isSaved && state?.characterName) {
      setIsCharacterSaved(true);
      setCharacterName(state.characterName);
      if (state.saveId) setSaveId(state.saveId);
      if (state.deckName) setDeckName(state.deckName); // <-- AGORA FUNCIONA
      if (state.deckId) setStoredDeckId(state.deckId);
      if (state.attributes) {
        onLoadAttributes(state.attributes, state.pointsRemaining ?? 0);
      }
      toast.success('Personagem carregado!', { duration: 1500 });
      setIsPersistenceLoaded(true);
      return;
    }

    // Dados salvos localmente (storage)
    const isNewCharacterFlow = Boolean(state?.characterName && !state?.isSaved);
    if (
      !isNewCharacterFlow &&
      !hasRoutedAttributes &&
      savedData &&
      savedData.attributes
    ) {
      setCharacterName(savedData.name || '');
      setIsCharacterSaved(savedData.isSaved || savedData.isFinalized || false);
      if (savedData.deckName) setDeckName(savedData.deckName);
      if (savedData.deckId) setStoredDeckId(savedData.deckId);
      if (savedData.saveId) setSaveId(savedData.saveId);
      onLoadAttributes(
        savedData.attributes,
        savedData.isSaved || savedData.isFinalized
          ? 0
          : (savedData.pointsRemaining ?? TOTAL_POINTS),
      );
      if (savedData.isFinalized) {
        toast.success('Personagem carregado!', { duration: 1500 });
      }
    }

    // Se veio nome da navegação (novo personagem)
    if (state?.characterName && !state?.isSaved) {
      setCharacterName(state.characterName);
    }
    if (state?.deckId) {
      setStoredDeckId(state.deckId);
    }
    setIsPersistenceLoaded(true);
  }, [location.state, onLoadAttributes]);

  // Persistir personagem atual (salvar progresso)
  const persistCurrentCharacter = useCallback(() => {
    const currentName = characterName || raceName || 'Herói';
    const currentDeckName = deckName || 'Seu Deck';

    characterStorageService.save({
      name: currentName,
      characterName: currentName,
      className,
      classId,
      raceId: raceId || '',
      raceName: raceName || '',
      raceImage: raceImage || '',
      raceIcon: raceIcon || '',
      deityId: deityId || '',
      deityName: deityName || '',
      level: 1,
      attributes,
      derivedStats,
      equipment: {},
      deckId,
      deckName: currentDeckName,
      pointsRemaining,
      totalPoints: TOTAL_POINTS,
      isSaved: isCharacterSaved,
      isFinalized: isCharacterSaved,
      saveId,
      progress: 0,
      location: 'Acampamento Inicial',
      createdAt: new Date().toISOString(),
    } as any);
  }, [
    characterName,
    raceName,
    className,
    classId,
    raceId,
    raceImage,
    raceIcon,
    deityId,
    deityName,
    attributes,
    derivedStats,
    deckId,
    deckName,
    pointsRemaining,
    isCharacterSaved,
    saveId,
  ]);

  // Finalizar e salvar personagem
  const saveCharacter = useCallback(
    (onSuccess?: () => void) => {
      if (pointsRemaining > 0) {
        toast.error(
          `Você ainda tem ${pointsRemaining} ponto(s) para distribuir!`
        );
        return;
      }

      setLoading(true);
      const loadingToast = toast.loading('Salvando personagem...');

      const currentDeckName = deckName || 'Deck Inicial';
      const characterData = {
        characterName: characterName || 'Herói',
        className,
        classId,
        raceId: raceId || '',
        raceName: raceName || '',
        raceImage: raceImage || '',
        raceIcon: raceIcon || '',
        deityId: deityId || '',
        deityName: deityName || '',
        level: 1,
        attributes,
        derivedStats,
        equipment: {},
        deckId,
        deckName: currentDeckName,
        progress: 0,
        location: 'Acampamento Inicial',
        pointsRemaining: 0,
      };

      const saved = saveService.saveGame(characterData);
      setSaveId(saved.id);

      const fullData = {
        ...characterData,
        name: characterName || 'Herói',
        saveId: saved.id,
        isFinalized: true,
        isSaved: true,
        createdAt: new Date().toISOString(),
        pointsRemaining: 0,
      };

      characterStorageService.save(fullData as any);
      setIsCharacterSaved(true);

      setTimeout(() => {
        toast.dismiss(loadingToast);
        toast.success('Personagem salvo com sucesso!');
        setLoading(false);
        if (onSuccess) onSuccess();
      }, 800);
    },
    [
      pointsRemaining,
      characterName,
      className,
      classId,
      raceId,
      raceName,
      raceImage,
      raceIcon,
      deityId,
      deityName,
      attributes,
      derivedStats,
      deckId,
      deckName,
    ]
  );

  // Deletar personagem
  const deleteCharacter = useCallback(
    (onSuccess?: () => void) => {
      if (!isCharacterSaved) {
        toast.error('Nenhum personagem salvo para deletar!');
        return;
      }

      const confirmDelete = window.confirm(
        'Tem certeza que deseja deletar este personagem?\n\nEsta ação não pode ser desfeita!'
      );
      if (!confirmDelete) return;

      setIsDeleting(true);
      const loadingToast = toast.loading('Deletando personagem...');

      characterStorageService.delete();
      if (saveId) {
        try {
          saveService.deleteSave(saveId);
        } catch (error) {
          console.error('Erro ao deletar save:', error);
        }
      }

      setIsCharacterSaved(false);
      setSaveId(null);
      setStoredDeckId(null);
      setDeckName(''); // reseta também

      setTimeout(() => {
        toast.dismiss(loadingToast);
        toast.success('Personagem deletado com sucesso!');
        setIsDeleting(false);
        if (onSuccess) onSuccess();
      }, 800);
    },
    [isCharacterSaved, saveId]
  );

  return {
    characterName,
    setCharacterName,
    imageError,
    setImageError,
    isCharacterSaved,
    setIsCharacterSaved,
    saveId,
    storedDeckId,
    setStoredDeckId,
    deckName,
    setDeckName, // exposto para sincronizar com o deck gerado
    loading,
    isDeleting,
    isPersistenceLoaded,
    persistCurrentCharacter,
    saveCharacter,
    deleteCharacter,
  };
};
