import { createContext, Dispatch, ReactNode, useCallback, useContext, useState } from 'react';
import { useImmerReducer } from 'use-immer';
import { Account } from '~/graphqls/schema/account.type';
import { reducer, State, Action } from './reducer';

export const StateContext = createContext({} as State);
export const DispatchContext = createContext<Dispatch<Action>>(() => {});

interface Props {
  children: ReactNode;
}

export function Provider(props: Props) {

  const { children } = props;

  const [state, dispatch] = useImmerReducer<State, Action>(reducer, {});

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export function useAccount() {
  return useContext(StateContext).account;
}

export function useSetAccount() {
  const dispatch = useContext(DispatchContext);
  return useCallback((account: Account) => {
    dispatch({ type: 'account', data: account });
  }, [dispatch]);
}
