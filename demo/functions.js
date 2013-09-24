function addEvent(obj, type, callback, useCapture)
{
    if (obj.addEventListener)
        obj.addEventListener(type, callback, useCapture);
    else if (obj.attachEvent)
        obj.attachEvent("on" + type, callback);
    else
        obj["on" + type] = callback;
}
function extendClass(A, B, methods)
{
    B.prototype = new A();
    B.prototype.constructor = B;

    if (methods)
        for (var name in methods)
            B.prototype[name] = methods[name];
}
function hasMethod(obj, methodName)
{
    return typeof obj == "object" && obj && methodName in obj && typeof obj[methodName] == "function";
}
function indexOf(array, el)
{
    if (hasMethod(array, "indexOf"))
        return array.indexOf(el);

    var i = 0;
    
    while (i < array.length && array[i] !== el)
        i++;

    return i < array.length ? i : -1;
}
function last(array)
{
    return array[array.length - 1];
}
function map(f, obj)
{
    if (hasMethod(obj, "map"))
        return obj.map(f);

    if (obj.hasProperty("length"))
    {
        try
        {
            var results = new obj.constructor();

            for (var i = 0; i < obj.length; i++)
                results[i] = f.call(this, obj[i], i, obj);

            return results;
        }
        catch (e)
        {
            return map(f, S(obj));
        }
    }
    else
    {
        var results = {};

        for (var k in obj)
            results[k] = f.call(this, obj[k], k, obj);

        return results;
    }
}
function slice(obj /*, a, b */)
{
    return Array.prototype.slice.apply(obj, Array.prototype.slice.call(arguments, 1));
}
