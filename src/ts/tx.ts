import { utils, providers } from 'ethers';
import { contracts } from './index';
export async function approve(signer: providers.JsonRpcProvider) {
  console.log(`zomg approve ghst:`, signer);
  const tx = await contracts.ghst
    .connect(signer)
    .approve(
      '0x6c383Ef7C9Bf496b5c847530eb9c49a3ED6E4C56',
      utils.parseEther('100000000')
    );
  console.log(`Approve tx: `, tx);
  // pendingTx = tx.hash;
  // const conf = await tx.wait();
  // console.log(`Approve conf: `, conf);
  // if (conf) {
  //   user.approveGhstContract = true;
  //   updateBalances();
  // }
}
