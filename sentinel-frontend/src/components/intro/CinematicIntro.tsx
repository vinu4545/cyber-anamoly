import React from "react";
import { CinematicIntroTransition } from "./CinematicIntroTransition";

interface CinematicIntroProps {
  onIntroComplete: () => void;
  onProgressChange?: (progress: number) => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = (props) => {
  return (
    <CinematicIntroTransition
      onTransitionComplete={props.onIntroComplete}
      onProgressChange={props.onProgressChange}
    />
  );
};

export { CinematicIntroTransition };
