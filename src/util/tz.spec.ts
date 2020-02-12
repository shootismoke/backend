import { findTimezonesAt } from './tz';

describe('findTimezonesAt', () => {
  it('should work correctly', () => {
    expect(findTimezonesAt(9, new Date('2020-02-12T00:28:54.488Z'))).toEqual([
      'America/Glace_Bay',
      'America/Goose_Bay',
      'America/Halifax',
      'America/Moncton',
      'America/Thule',
      'Atlantic/Bermuda',
      'America/St_Johns',
      'America/Sao_Paulo',
      'America/Argentina/La_Rioja',
      'America/Argentina/Rio_Gallegos',
      'America/Argentina/Salta',
      'America/Argentina/San_Juan',
      'America/Argentina/San_Luis',
      'America/Argentina/Tucuman',
      'America/Argentina/Ushuaia',
      'America/Buenos_Aires',
      'America/Catamarca',
      'America/Cordoba',
      'America/Jujuy',
      'America/Mendoza',
      'America/Araguaina',
      'America/Belem',
      'America/Cayenne',
      'America/Fortaleza',
      'America/Maceio',
      'America/Paramaribo',
      'America/Recife',
      'America/Santarem',
      'Antarctica/Rothera',
      'Atlantic/Stanley',
      'Etc/GMT+3',
      'America/Godthab',
      'America/Montevideo',
      'America/Bahia'
    ]);
  });
});
