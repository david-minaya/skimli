import { Account } from '~/graphqls/schema/account.type';

export interface State {
  account?: Account;
}

export interface Action {
  type: 'account'
  data: any;
}

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'account': {
      state.account = action.data;
      break;
    }
  }
}
