import { CryptoPunks } from "generated";

CryptoPunks.Assign.handler(async ({ event, context }) => {
  const userAddress = event.params.to.toLowerCase();
  const punkIndex = event.params.punkIndex.toString();
  const timestamp = BigInt(event.block.timestamp);

  let user = await context.User.get(userAddress);
  if (!user) {
    context.User.set({
      id: userAddress,
    });
  }

  let assign = await context.Assign.get(punkIndex);
  if (!assign) {
    context.Assign.set({
      id: punkIndex,
      punk_id: punkIndex,
      user_id: userAddress,
      timeStamp: timestamp,
    });
  }

  let punk = await context.Punk.get(punkIndex);
  if (!punk) {
    context.Punk.set({
      id: punkIndex,
      birthTime: timestamp,
      creator_id: userAddress,
      owner_id: userAddress,
    });
  }
});

CryptoPunks.PunkTransfer.handler(async ({ event, context }) => {
  const punkIndex = event.params.punkIndex.toString();
  const from = event.params.from.toLowerCase();
  const to = event.params.to.toLowerCase();
  const timestamp = BigInt(event.block.timestamp);

  let fromUser = await context.User.get(from);
  if (!fromUser) {
    context.User.set({ id: from });
  }

  let toUser = await context.User.get(to);
  if (!toUser) {
    context.User.set({ id: to });
  }

  let punk = await context.Punk.get(punkIndex);
  if (!punk) {
    context.Punk.set({
      id: punkIndex,
      birthTime: timestamp,
      creator_id: from,
      owner_id: to,
    });
  } else {
    context.Punk.set({ ...punk, owner_id: to });
  }

  let punkTransfer = await context.PunkTransfer.get(punkIndex);
  if (!punkTransfer) {
    context.PunkTransfer.set({
      id: punkIndex,
      punk_id: punkIndex,
      from_id: from,
      to_id: to,
      timeStamp: timestamp,
    });
  }
});

CryptoPunks.PunkBought.handler(async ({ event, context }) => {
  const toAddress = event.params.toAddress.toLowerCase();
  const fromAddress = event.params.fromAddress.toLowerCase();
  const punkIndex = event.params.punkIndex.toString();
  const amount = event.params.value;
  const timestamp = BigInt(event.block.timestamp);
  const hash = event.transaction.hash;

  let buyerUser = await context.User.get(toAddress);
  if (!buyerUser) {
    context.User.set({ id: toAddress });
  }

  let sellerUser = await context.User.get(fromAddress);
  if (!sellerUser) {
    context.User.set({ id: fromAddress });
  }

  context.PunkBought.set({
    id: hash,
    punk_id: punkIndex,
    buyer_id: toAddress,
    seller_id: fromAddress,
    price: amount,
    timeStamp: timestamp,
  });

  let punk = await context.Punk.get(punkIndex);
  if (!punk) {
    context.Punk.set({
      id: punkIndex,
      birthTime: timestamp,
      creator_id: fromAddress,
      owner_id: toAddress,
    });
  } else {
    context.Punk.set({ ...punk, owner_id: toAddress });
  }
});
