import { Aqi } from '../../types';
import { Breakpoints, createAqiFromBreakpoints } from '../../util';
import breakpoints from './breakpoints.json';

/**
 * AQI (CN)
 * @see https://kjs.mep.gov.cn/hjbhbz/bzwb/dqhjbh/jcgfffbz/201203/t20120302_224166.htm
 */
export const chnMep: Aqi = {
	displayName: 'AQI (CN)',
	...createAqiFromBreakpoints('chnMep', breakpoints as Breakpoints),
};
