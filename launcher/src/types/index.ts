// launcher/src/types/index.ts
export interface LauncherOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface MenuItemProps {
  selected: boolean;
}

export interface LabelProps {
  selected: boolean;
}

export interface DescriptionProps {
  selected: boolean;
}

export interface ArrowProps {
  selected: boolean;
}