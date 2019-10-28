import { gql } from '../util';

export const CREATE_HISTORY_ITEM = gql`
  mutation($input: CreateHistoryItemInput!) {
    createHistoryItem(input: $input)
  }
`;
