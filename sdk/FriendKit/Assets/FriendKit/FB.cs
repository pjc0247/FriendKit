using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using Firebase;
using Firebase.Auth;
using Firebase.Functions;

namespace FriendKit
{
    public class FB
    {
        private static FirebaseApp _App;
        public static FirebaseApp App
        {
            get
            {
                if (_App == null)
                {
                    _App = FirebaseApp.Create(new AppOptions()
                    {
                        ApiKey = "AIzaSyBTB9nagH2-TSZcVswSVHeUHlkXfo1LYAs",
                        AppId = "modplayer-kr",
                        ProjectId = "modplayer-kr"
                    });
                }
                return _App;
            }
        }

        private static FirebaseAuth _Auth;
        public static FirebaseAuth Auth
        {
            get
            {
                if (_Auth == null)
                    _Auth = FirebaseAuth.GetAuth(App);
                return _Auth;
            }
        }

        private static FirebaseFunctions _Functions;
        public static FirebaseFunctions Functions
        {
            get
            {
                if (_Functions == null)
                    _Functions = FirebaseFunctions.GetInstance(App);
                return _Functions;
            }
        }
    }
}