import { useEffect, useRef, useState } from 'react';
import type { FlowBeat } from '../game/flowFeedback.ts';

/** Observe real changes, never replay a stored lever state on load or resume. */
export function useFlowChange(diverted: boolean, clock: number, active: boolean) {
  const previous = useRef(diverted);
  const [beat, setBeat] = useState<FlowBeat | null>(null);
  useEffect(() => {
    if (!active) setBeat(null);
    else if (previous.current !== diverted) setBeat({ at: clock, toDiverted: diverted });
    previous.current = diverted;
  }, [active, clock, diverted]);
  return beat;
}
