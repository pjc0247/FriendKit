import { NotAuthorizedError, PermissionDeniedError, InvalidOperationError } from '../error';
import { onHttpsCall } from '../common';
import { User } from '../controller/user';
import { Guild } from '../controller/guild';

export const guild_getGuild = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    let guild = Guild.get(data.gid);
    await guild.ensureDataExistInLocal();

    return {
        guild
    };
});
export const guild_queryGuild = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    let guilds = await Guild.query(data.name);
    for (const guild of guilds)
        await guild.ensureDataExistInLocal();

    return {
        guilds
    };
});
export const guild_transferOwnership = onHttpsCall(async (data, ctx) => {
    if (!ctx.auth) throw new NotAuthorizedError();

    let guild = Guild.get(data.gid);
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

    let guild = Guild.get(data.id);
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