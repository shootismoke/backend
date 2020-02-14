import { NowRequest, NowResponse } from '@now/node';
import { Expo, ExpoPushReceiptId } from 'expo-server-sdk';

import { IPushTicket, PushTicket } from '../src/models';
import { handleReceipts, whitelistIPMiddleware } from '../src/push';
import { chain, connectToDatabase, logger, sentrySetup } from '../src/util';

sentrySetup();

/**
 * Handle push notifications receipts.
 */
async function receipts(_req: NowRequest, res: NowResponse): Promise<void> {
  try {
    await connectToDatabase(process.env.MONGODB_ATLAS_URI);

    const tickets = await PushTicket.find({
      receiptId: { $exists: true }
    });
    // Mapping of receiptId->userId
    const receiptsMapping = tickets.reduce((acc, ticket) => {
      acc[ticket.receiptId as ExpoPushReceiptId] = ticket.userId;

      return acc;
    }, {} as Record<ExpoPushReceiptId, string>);

    // Handle the receiptIds
    const receiptIds: ExpoPushReceiptId[] = tickets.map(
      ticket => ticket.receiptId as ExpoPushReceiptId
    );
    const okReceiptIds: ExpoPushReceiptId[] = []; // Store the ids that are good
    const errorReceipts: IPushTicket[] = []; // Store the receipts that are bad
    await handleReceipts(
      new Expo(),
      receiptIds,
      receiptId => {
        okReceiptIds.push(receiptId);
      },
      (receiptId, receipt) => {
        errorReceipts.push({
          ...receipt,
          receiptId,
          userId: receiptsMapping[receiptId]
        });
      }
    );

    await PushTicket.deleteMany({
      receiptId: {
        $in: okReceiptIds
      }
    });

    res.send({
      status: 'ok',
      details: `Cleaned ${okReceiptIds.length} push tickets`
    });
  } catch (error) {
    logger.error(error);

    res.status(500);
    res.send({
      status: 'error',
      details: error.message
    });
  }
}

export default chain(whitelistIPMiddleware)(receipts);
