import { testConversion } from '../util/testUtil';

describe('Convert pm25', () => {
  testConversion('pm25', 'US', 25, 6);
  testConversion('pm25', 'US', 39, 9.35);
  testConversion('pm25', 'US', 57, 15);
  testConversion('pm25', 'US', 75, 23.5);
  testConversion('pm25', 'US', 125, 45.2);
  testConversion('pm25', 'US', 175, 102);
  testConversion('pm25', 'US', 250, 199.9);
  testConversion('pm25', 'US', 285, 235.4);
  testConversion('pm25', 'US', 350, 299.9);
  testConversion('pm25', 'US', 450, 424.5);
  testConversion('pm25', 'US', 550, 550);
});
