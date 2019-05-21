using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace FriendKit
{
    public class Auth : MonoBehaviour
    {
        public static User me { get; private set; }

        [RuntimeInitializeOnLoadMethod]
        private static void Initialize()
        {
            var gobj = new GameObject("FK_Auth");
            gobj.AddComponent<Auth>();
        }
        public static void Login()
        {

        }

        void OnEnable()
        {
            StartCoroutine(SendPresence());
        }
        /// <summary>
        /// Automatically updates presence status in background
        /// </summary>
        IEnumerator SendPresence()
        {
            while (true)
            {
                yield return new WaitForSeconds(30);

                if (FB.Auth.CurrentUser == null)
                    continue;
                if (me == null)
                {
                    GetMe();
                    continue;
                }

                me.UpdatePresence();
            }
        }
        private async void GetMe()
        {
            me = await User.GetMe();
        }
    }
}