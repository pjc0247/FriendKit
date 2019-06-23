import { NotAuthorizedError, PermissionDeniedError, InvalidOperationError } from '../error';
import { onHttpsCall } from '../common';
import { User } from '../controller/user';
import { Guild } from '../controller/guild';

export const guild_getGuild = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    const guild = Guild.get(data.gid);
    await guild.ensureDataExistInLocal();

    const users = await guild.getUsers();
    return {
        ...guild,
        users
    };
});
export const guild_queryGuild = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    const guilds = await Guild.query(data.name);
    await Promise.all(
        guilds.map(x => x.ensureDataExistInLocal())
    );

    return {
        guilds
    };
});

export const guild_requestJoin = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    const guild = Guild.get(data.gid);
    const user = User.get(ctx.auth.uid);

    await guild.requestJoin(user);

    return {
    };
});
export const guild_acceptRequest = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    const guild = Guild.get(data.gid);
    if (guild.data!.owner != ctx.auth.uid)
        throw new PermissionDeniedError();

    const user = User.get(data.uid);
    await guild.acceptRequest(user);
    
    return {
    };
});
export const guild_rejectRequest = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    const guild = Guild.get(data.gid);
    if (guild.data!.owner != ctx.auth.uid)
        throw new PermissionDeniedError();

    const user = User.get(data.uid);
    await guild.rejectRequest(user);
    
    return {
    };
});

export const guild_updateProperty = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    const guild = Guild.get(data.gid);
    await guild.ensureDataExistInLocal();

    if (guild.data!.owner != ctx.auth.uid)
        throw new PermissionDeniedError();

    await guild.update(data);

    return {
        guild
    };
});
export const guild_transferOwnership = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    const guild = Guild.get(data.gid);
    await guild.ensureDataExistInLocal();

    if (guild.data!.owner != ctx.auth.uid)
        throw new PermissionDeniedError();

    await guild.update({
        owner: data.uid
    });

    return {
        guild
    };
});
export const guild_grantSubownership = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    const guild = Guild.get(data.id);
    await guild.ensureDataExistInLocal();

    if (guild.data!.owner != ctx.auth.uid)
        throw new PermissionDeniedError();

    if (!guild.data!.subOwner1) {
        await guild.update({
            subOwner1: data.uid
        });    
    }
    else if (!guild.data!.subOwner2) {
        await guild.update({
            subOwner2: data.uid
        });    
    }
    else 
        throw new InvalidOperationError('No place to add');

    return {
        guild
    };
});