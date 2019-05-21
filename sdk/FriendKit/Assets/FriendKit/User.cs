using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using UnityEngine;

using Newtonsoft.Json;

namespace FriendKit
{
    public enum Presence
    {
        [EnumMember(Value = "online")]
        Online,
        [EnumMember(Value = "offline")]
        Offline
    }

    public class User
    {
        public string id;
        public string nickname;
        public string guildId;
        public Presence presence;

        public async static Task<User> GetMe()
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("user_getMe")
                .CallAsync(new Dictionary<string, object>()
                {
                });

            return Reinterpret<GetUserResponse>(resp.Data).user;
        }
        private static T Reinterpret<T>(object input)
        {
            var json = JsonConvert.SerializeObject(input);
            return JsonConvert.DeserializeObject<T>(json);
        }

        public async Task RequestFriend(User user)
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("user_requestFriend")
                .CallAsync(new Dictionary<string, object>()
                {
                    ["uid"] = user.id
                });
        }

        public async Task<User[]> GetFriendRequestsToMe()
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("user_getFriendRequestsToMe")
                .CallAsync(new Dictionary<string, object>()
                {
                });

            return Reinterpret<GetFriendsResponse>(resp.Data).friends;
        }
        public async Task<User[]> GetFriendRequestsFromMe()
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("user_getFriendRequestsFromMe")
                .CallAsync(new Dictionary<string, object>()
                {
                });

            return Reinterpret<GetFriendsResponse>(resp.Data).friends;
        }
        public async Task<User[]> GetFriends()
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("user_getFriends")
                .CallAsync(new Dictionary<string, object>()
                {
                });

            return Reinterpret<GetFriendsResponse>(resp.Data).friends;
        }
    }

    class GetUserResponse
    {
        public User user;
    }
    class GetFriendsResponse
    {
        public User[] friends;
    }
}