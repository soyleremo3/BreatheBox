// Static 5-4-3-2-1 sensory grounding sequence. No timing logic, no
// personalization, no AI — pre-written copy only (see PROJECT.md).
export type GroundingStep = {
  id: string;
  count: number;
  sense: string;
  prompt: string;
};

export const GROUNDING_SEQUENCE: GroundingStep[] = [
  {
    id: 'see',
    count: 5,
    sense: 'see',
    prompt: 'Name 5 things you can see around you right now.',
  },
  {
    id: 'touch',
    count: 4,
    sense: 'touch',
    prompt: 'Name 4 things you can feel or touch.',
  },
  {
    id: 'hear',
    count: 3,
    sense: 'hear',
    prompt: 'Name 3 things you can hear.',
  },
  {
    id: 'smell',
    count: 2,
    sense: 'smell',
    prompt: 'Name 2 things you can smell.',
  },
  {
    id: 'taste',
    count: 1,
    sense: 'taste',
    prompt: 'Name 1 thing you can taste.',
  },
];
