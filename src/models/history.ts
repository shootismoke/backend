import * as t from 'io-ts';

export const HistoryItem = t.type({
  stationId: t.string,
  rawPm25: t.number,
  createdAt: t.string
});
