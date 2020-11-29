import * as React from "react";
import { usePrevious, useCounter } from "react-use";

interface StepperContextProps {
  currentPage: number;
  previousPage?: number;
  toggle: (page: number) => void;
  next: () => void;
  prev: () => void;
}

type UseStepperReturn = [StepperContextProps["currentPage"], Omit<StepperContextProps, "currentPage">];

const StepperContext = React.createContext<StepperContextProps>(undefined as any);

export function useStepper(pages: number, onStepChange?: (index: number) => any): UseStepperReturn {
  const [currentPage, { set }] = useCounter(0, pages - 1, 0);
  const previousPage = usePrevious(currentPage);

  const changePage = React.useCallback(
    async (index: number) => {
      set(index);
      if (onStepChange) {
        await onStepChange(index);
      }
    },
    [onStepChange, set]
  );

  const next = React.useCallback(() => {
    changePage(currentPage + 1);
  }, [changePage, currentPage]);

  const prev = React.useCallback(() => {
    changePage(currentPage - 1);
  }, [changePage, currentPage]);

  const toggle = React.useCallback(
    (page: number) => {
      changePage(page);
    },
    [changePage]
  );

  return [currentPage, { next, prev, toggle, previousPage }];
}

export function StepperProvider({ children, ...rest }: StepperContextProps & { children: React.ReactNode }) {
  return <StepperContext.Provider value={rest}>{children}</StepperContext.Provider>;
}

export function useStepperContext() {
  return React.useContext(StepperContext);
}
