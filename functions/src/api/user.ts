import { NotAuthorizedError } from '../error';
import { onHttpsCall } from '../common';
import { User } from '../user';

export const user_getMe = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    let user = User.get(ctx.auth.uid);
    await user.ensureDataExistInLocal();

    return {
        user
    };
});

export const user_requestFriend = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    let user = User.get(ctx.auth.uid);
    await user.requestFriend(User.get(data.uid));

    return {
    };
});
export const user_acceptFriendRequest = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    let user = User.get(ctx.auth.uid);
    await user.acceptRequest(User.get(data.uid));

    return {
    };
});
export const user_rejectFriendRequest = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    let user = User.get(ctx.auth.uid);
    await user.rejectRequest(User.get(data.uid));

    return {
    };
});

export const user_getFriends = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    let user = User.get(ctx.auth.uid);
    let friends = await user.getFriends();

    return {
        friends
    };
});
export const user_getFriendRequestsFromMe = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    let user = User.get(ctx.auth.uid);
    let friends = await user.getFriendRequestsFromMe();

    return {
        friends
    };
});
export const user_getFriendRequestsToMe = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    let user = User.get(ctx.auth.uid);
    let friends = await user.getFriendRequestsToMe();

    return {
        friends
    };
});