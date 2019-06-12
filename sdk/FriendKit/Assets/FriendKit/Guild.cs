using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using UnityEngine;

using Newtonsoft.Json;

namespace FriendKit
{
    public class GuildModel
    {
        public string id;
        public string name;

        public UserModel[] users;
    }
    public class Guild : GuildModel
    {
        public async static Task<Guild> Get(string id)
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("guild_getGuild")
                .CallAsync(new Dictionary<string, object>()
                {
                    ["gid"] = id
                });

            return resp.Data.Reinterpret<GetGuildResponse>().guild;
        }
        public async static Task<Guild[]> Query(string name)
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("guild_queryGuild")
                .CallAsync(new Dictionary<string, object>()
                {
                    ["name"] = name
                });

            return resp.Data.Reinterpret<GetGuildsResponse>().guilds;
        }

        public async Task Update(GuildModel guild)
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("guild_updateProperty")
                .CallAsync(new Dictionary<string, object>()
                {
                    ["name"] = guild.name
                });
        }
        public async Task TransferOwnership(User user)
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("guild_transferOwnership")
                .CallAsync(new Dictionary<string, object>()
                {
                    ["gid"] = id,
                    ["uid"] = user.id
                });
        }
        public async Task GrantSubownership(User user)
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("guild_grantSubownership")
                .CallAsync(new Dictionary<string, object>()
                {
                    ["gid"] = id,
                    ["uid"] = user.id
                });
        }

        public async Task AcceptRequest(User user)
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("guild_acceptRequest")
                .CallAsync(new Dictionary<string, object>()
                {
                    ["gid"] = id,
                    ["uid"] = user.id
                });
        }
        public async Task RejectRequest(User user)
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("guild_rejectRequest")
                .CallAsync(new Dictionary<string, object>()
                {
                    ["gid"] = id,
                    ["uid"] = user.id
                });
        }
    }

    class GetGuildResponse
    {
        public Guild guild;
    }
    class GetGuildsResponse
    {
        public Guild[] guilds;
    }
}