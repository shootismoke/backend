import { NowRequest, NowResponse } from '@now/node';

import { connectToDatabase } from '../../src/util';

export default async function push(
  req: NowRequest,
  res: NowResponse
): Promise<void> {
  await connectToDatabase();
}
