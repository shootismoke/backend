// import { Location as ILocation, Resolvers } from '@shootismoke/graphql';
type ILocation = any;

import { HistoryItem, Location, Measurement } from '../models';

/**
 * List of known providers
 * @todo This should come from @shootismoke/dataproviders
 */
const PROVIDERS = ['aqicn', 'openaq', 'waqi'];

export const historyItemResolvers: any = {
  Mutation: {
    // @ts-ignore
    createHistoryItem: async (_parent, { input }): Promise<boolean> => {
      const {
        measurement: { location: locationId }
      } = input;
      const [provider, id] = locationId.split('|');

      if (!PROVIDERS.includes(provider) || !id) {
        throw new Error(
          `Only providers ${JSON.stringify(PROVIDERS)} are supported for now`
        );
      }

      let location = await Location.findOne({ location: locationId });

      if (!location) {
        location = await Location.create({
          city: input.measurement.city,
          country: input.measurement.country,
          location: input.measurement.location,
          sourceName: input.measurement.sourceName,
          sourceNames: input.measurement.sourceNames,
          sourceType: input.measurement.sourceType
        });
      }

      const measurement = await Measurement.create({
        attribution: input.measurement.attribution,
        averagingPeriod: input.measurement.averagingPeriod,
        coordinates: input.measurement.coordinates,
        date: input.measurement.date,
        locationId: location._id,
        mobile: input.measurement.mobile,
        parameter: input.measurement.parameter,
        // In GraphQL, we accept String for unit. We actually only would accept
        // 'µg/m³' and 'ppm', but if the user gives 'ugm3', we would still
        // accept it and cast to 'µg/m³'
        unit: input.measurement.unit.replace('ugm3', 'µg/m³'),
        value: input.measurement.value
      });

      await HistoryItem.create({
        measurementId: measurement._id,
        userId: input.userId
      });

      return true;
    }
  }
};
