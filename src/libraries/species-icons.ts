import { faShieldCat, faShieldDog, faDove, faHorseHead, faFrog, faCow, faFish, faWorm, faSpider, faDragon } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const speciesIcons: Record<string, IconDefinition> = {
    'shield-dog': faShieldDog,
    'shield-cat': faShieldCat,
    'dove': faDove,
    'fish-fins': faFish,
    'horse-head': faHorseHead,
    'cow': faCow,
    'frog': faFrog,
    'worm': faWorm,
    'spider': faSpider,
    'dragon': faDragon
};

// export type SpeciesIconKey = keyof typeof speciesIcons;
export default speciesIcons;