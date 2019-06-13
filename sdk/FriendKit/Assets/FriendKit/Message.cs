using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using UnityEngine;

using Newtonsoft.Json;

namespace FriendKit
{
    public class MessageModel
    {
        public string id;

        public User sender;
        public User receiver;

        public string title;
        public string body;
    }
    public class Message : MessageModel
    {
        public async static Task<Message[]> Query(string name)
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("message_query")
                .CallAsync(new Dictionary<string, object>()
                {
                });

            return resp.Data.Reinterpret<GetMessagesResponse>().messages;
        }

        public async Task Delete()
        {
            var func = FB.Functions;
            var resp = await func.GetHttpsCallable("message_delete")
                .CallAsync(new Dictionary<string, object>()
                {
                    ["mid"] = id
                });
        }
    }

    class GetMessagesResponse
    {
        public Message[] messages;
    }
}