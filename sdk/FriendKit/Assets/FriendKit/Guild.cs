using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using UnityEngine;

using Newtonsoft.Json;

namespace FriendKit
{
    public class Guild
    {
        public string id;
        public string name;

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
    }

    class GetGuildResponse
    {
        public Guild guild;
    }
}