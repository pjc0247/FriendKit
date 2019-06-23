import { onHttpsCall } from "../common";
import { NotAuthorizedError, PermissionDeniedError } from "../error";
import { User } from "../controller/user";
import { Message } from "../controller/message";

export const message_get = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    const user = User.get(ctx.auth.uid);
    const messages = await Message.query(user);

    return {
        messages
    };
});
export const message_send = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    const sender = User.get(ctx.auth.uid);
    const receiver = User.get(data.uid);
    const message = Message.create(sender, receiver, {
        body: data.body,
        title: data.title
    });

    return {
    };
});
export const message_delete = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    const message = Message.get(data.mid);
    if (message.data!.receiverId !== ctx.auth.uid)
        throw new PermissionDeniedError();

    await message.delete();

    return {
    };
});