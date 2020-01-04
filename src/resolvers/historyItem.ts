import { Resolvers } from '@shootismoke/graphql';

import { HistoryItem, Location, Measurement } from '../models';

/**
 * List of known providers
 * @todo This should come from @shootismoke/dataproviders
 */
const PROVIDERS = ['aqicn', 'openaq', 'waqi'];

export const historyItemResolvers: Resolvers = {
  Mutation: {
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
        unit: input.measurement.unit,
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
