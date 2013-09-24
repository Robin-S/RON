function testReviver(str, Classes)
{
    console.info("Using the reviver argument");

    var revive = (function()
    {
        var map = new Map(); //Basic key-value map, where keys can be objects

        return function revive(key, value)
        {
            if (typeof value != "object"
                    || !value
                    || !value.hasOwnProperty("constructor")
                    || !value.hasOwnProperty("data"))
                return value;

            if (map.containsKey(value))
                return map.get(value);

            var value$ = new (Classes[value.constructor] || Serializable)();

            for (var k in value.data)
                value$[k] = value.data[k];

            map.put(value, value$);

            return value$;
        };
    })();

    var obj = parse(str, revive);

    console.log(obj.contains(obj));
    
    return revive;
}
