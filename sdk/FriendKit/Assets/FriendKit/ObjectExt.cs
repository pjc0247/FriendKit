using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using Newtonsoft.Json;

public static class ObjectExt
{
    public static T Reinterpret<T>(this object input)
    {
        var json = JsonConvert.SerializeObject(input);
        return JsonConvert.DeserializeObject<T>(json);
    }
}
