import { useContext } from 'react';
import { BestiaryContext } from '../contexts/BestiaryContext';

export const useBestiary = () => {
  const context = useContext(BestiaryContext);
  if (!context) 
    throw new Error('useBestiary must be used inside BestiaryProvider');
  return context;
};
