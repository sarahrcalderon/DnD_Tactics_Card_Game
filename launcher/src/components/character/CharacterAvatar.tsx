import React, { useState } from 'react';
import {
  AvatarContainer,
  AvatarImage,
  AvatarFallback,
  CharacterName,
  CharacterInfo,
} from '../../styles/attributeDistStyles';

interface CharacterAvatarProps {
  name: string;
  className: string;
  raceName: string;
  deityName: string;
  imageSrc: string;
  icon: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  name,
  className,
  raceName,
  deityName,
  imageSrc,
  icon,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <AvatarContainer>
      {!imageError ? (
        <AvatarImage
          src={imageSrc}
          alt={raceName || 'Personagem'}
          onError={() => setImageError(true)}
        />
      ) : (
        <AvatarFallback>{icon}</AvatarFallback>
      )}
      <CharacterName>{name}</CharacterName>
      <CharacterInfo>
        {className}
        {raceName ? ` • ${raceName}` : ''}
        {deityName ? ` • ${deityName}` : ''}
      </CharacterInfo>
    </AvatarContainer>
  );
};
