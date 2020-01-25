import { AllProviders } from '@shootismoke/dataproviders';
import { Resolvers } from '@shootismoke/graphql';

import { HistoryItem, Location, Measurement, User } from '../models';
import { logger } from '../util';

export const historyItemResolvers: Resolvers = {
  Mutation: {
    createHistoryItem: async (_parent, { input }): Promise<boolean> => {
      const {
        measurement: { location: locationId }
      } = input;
      const [provider, id] = locationId.split('|');

      if (!AllProviders.includes(provider) || !id) {
        const e = new Error(
          `Only providers ${JSON.stringify(AllProviders)} are supported for now`
        );
        logger.debug(e.message);
        throw e;
      }

      const user = await User.findById(input.userId);
      if (!user) {
        const e = new Error(`User ${input.userId} does not exist in database`);
        logger.debug(e.message);
        throw e;
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
