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

    public class UserModel
    {
        public string id;
        public string name;
        public string guildId;
        public Presence presence;
    }
    public class User : UserModel
    {
        public async static Task<User> GetMe()
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("user_getMe")
                .CallAsync(new Dictionary<string, object>()
                {
                });

            return resp.Data.Reinterpret<GetUserResponse>().user;
        }
        public async static Task<User> GetByEmail(string email)
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("user_getUserByEmail")
                .CallAsync(new Dictionary<string, object>()
                {
                    ["email"] = email
                });

            return resp.Data.Reinterpret<GetUserResponse>().user;
        }

        public async Task Update(UserModel user)
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("user_updateProperty")
                .CallAsync(new Dictionary<string, object>()
                {
                    ["name"] = user.name
                });
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
        public async Task AcceptFriendRequest(User user)
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("user_acceptFriendRequest")
                .CallAsync(new Dictionary<string, object>()
                {
                    ["uid"] = user.id
                });
        }
        public async Task RejectFriendRequest(User user)
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("user_rejectFriendRequest")
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

            return resp.Data.Reinterpret<GetFriendsResponse>().friends;
        }
        public async Task<User[]> GetFriendRequestsFromMe()
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("user_getFriendRequestsFromMe")
                .CallAsync(new Dictionary<string, object>()
                {
                });

            return resp.Data.Reinterpret<GetFriendsResponse>().friends;
        }
        public async Task<User[]> GetFriends()
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("user_getFriends")
                .CallAsync(new Dictionary<string, object>()
                {
                });

            return resp.Data.Reinterpret<GetFriendsResponse>().friends;
        }

        public async Task UpdatePresence()
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("user_updatePresence")
                .CallAsync(new Dictionary<string, object>()
                {
                });
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