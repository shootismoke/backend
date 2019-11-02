import { NowRequest, NowResponse } from '@now/node';

import { connectToDatabase } from '../../src/util';

export default async function push(
  _req: NowRequest,
  _res: NowResponse
): Promise<void> {
  await connectToDatabase();
}
