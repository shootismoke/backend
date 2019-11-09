/**
 * Doing a mongodb aggregation on HistoryItem
 */
export const aggregation = [
  // Group all historyItem by userId, take last historyItem in each group
  {
    $group: {
      _id: '$userId',
      historyItem: { $last: '$$ROOT' }
    }
  },
  // Populate user
  {
    $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: '_id',
      as: 'users'
    }
  },
  // $lookup gives an array, we take the 1st (and only) element. Similar to
  // findOne
  {
    $project: {
      historyItem: 1,
      user: { $arrayElemAt: ['$users', 0] }
    }
  },
  // Filter only the users that have notifications set up
  {
    $match: {
      'user.expoPushToken': { $exists: true, $ne: null },
      'user.notifications': { $ne: 'never' }
    }
  },
  // Populate the station
  {
    $lookup: {
      from: 'stations',
      localField: 'historyItem.stationId',
      foreignField: '_id',
      as: 'stations'
    }
  },
  // $lookup gives an array, we take the 1st (and only) element. Similar to
  // findOne
  {
    $project: {
      historyItem: 1,
      user: 1,
      station: { $arrayElemAt: ['$stations', 0] }
    }
  },
  // Nicer output
  {
    $project: {
      expoPushToken: '$user.expoPushToken',
      universalId: '$station.universalId'
    }
  }
];
