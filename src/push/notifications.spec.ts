import { getTimezones, usersPipeline } from './notifications';

describe('getTimezones', () => {
  it('should work for daily frequencies', () => {
    expect(
      getTimezones('daily', new Date('2020-02-14T10:43:19.625Z'))
    ).toEqual([
      'America/Scoresbysund',
      'Atlantic/Azores',
      'Atlantic/Cape_Verde',
      'Etc/GMT+1'
    ]);
  });

  it('should return timezones for weekly frequencies on Sunday', () => {
    expect(
      getTimezones('weekly', new Date('2020-02-16T10:43:19.625Z'))
    ).toEqual([
      'Antarctica/Macquarie',
      'Etc/GMT-11',
      'Pacific/Efate',
      'Pacific/Guadalcanal',
      'Pacific/Kosrae',
      'Pacific/Noumea',
      'Pacific/Ponape',
      'Asia/Sakhalin',
      'Asia/Ust-Nera',
      'Asia/Vladivostok'
    ]);
  });

  it('should return empty for weekly frequencies on Friday', () => {
    expect(
      getTimezones('weekly', new Date('2020-02-14T10:43:19.625Z'))
    ).toEqual([]);
  });

  it('should return timezones for monthly frequencies on the 1st of the month', () => {
    expect(
      getTimezones('monthly', new Date('2020-02-01T10:43:19.625Z'))
    ).toEqual([
      'Antarctica/Macquarie',
      'Etc/GMT-11',
      'Pacific/Efate',
      'Pacific/Guadalcanal',
      'Pacific/Kosrae',
      'Pacific/Noumea',
      'Pacific/Ponape',
      'Asia/Sakhalin',
      'Asia/Ust-Nera',
      'Asia/Vladivostok'
    ]);
  });

  it('should return empty for monthly frequencies on the 15th of the month', () => {
    expect(
      getTimezones('monthly', new Date('2020-02-15T10:43:19.625Z'))
    ).toEqual([]);
  });
});

describe('usersPipeline', () => {
  it('should return a correct pipeline', () => {
    expect(
      usersPipeline('daily', new Date('2020-02-14T10:43:19.625Z'))
    ).toEqual([
      {
        $match: {
          'notifications.frequency': 'daily',
          'notifications.timezone': {
            $in: [
              'America/Scoresbysund',
              'Atlantic/Azores',
              'Atlantic/Cape_Verde',
              'Etc/GMT+1'
            ]
          }
        }
      },
      {
        $lookup: {
          as: 'pushTickets',
          foreignField: 'userId',
          from: 'pushtickets',
          localField: '_id'
        }
      },
      {
        $match: {
          pushTickets: {
            $size: 0
          }
        }
      }
    ]);
  });
});
