import { NotAuthorizedError } from '../error';
import { onHttpsCall } from '../common';
import { User } from '../controller/user';
import * as admin from 'firebase-admin';
import * as iap from 'in-app-purchase';

iap.config(require('../config/iap.json'));
const iapSetupProm = iap.setup();

async function waitForIapSetup(){
    await iapSetupProm;
}
async function validateReceipt(receipt: string) {
    await waitForIapSetup();
    const data = await iap.validate({});
}

export const iap_claim = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    const receipt = data.receipt;

    let user = User.get(ctx.auth.uid);
    await user.ensureDataExistInLocal();

    return {
        user
    };
});