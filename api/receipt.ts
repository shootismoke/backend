import { NowRequest, NowResponse } from '@now/node';
// import { Expo } from 'expo-server-sdk';

// import { PushTicket } from '../src/models';
// import { } from '../src/push';
// import { connectToDatabase, logger, sentrySetup } from '../src/util';

// sentrySetup();

// const expo = new Expo();

export default async function(
  _req: NowRequest,
  _res: NowResponse
): Promise<void> {
  //   try {
  //     await connectToDatabase(process.env.MONGODB_ATLAS_URI);
  //     const tickets = await PushTicket.find({
  //       receiptId: { $exists: true }
  //     });
  //     const receiptIds = tickets.map(({ receiptId }) => receiptId);
  //     const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  //   } catch (error) {
  //     logger.error(error);
  //     res.send(
  //       JSON.stringify({
  //         status: 'error',
  //         details: error.message
  //       })
  //     );
  //   }
}
