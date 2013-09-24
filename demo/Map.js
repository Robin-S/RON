/* {{{ Class: Map 
 */
function Map()
{
    var keys   = [],
        values = [],
        i$, k$;

    function getIndex(k)
    {
        if (k$ !== undefined && k$ === k)
            return i$;
        
        return i$ = indexOf(keys, k$ = k);
    }

    function containsKey(k)
    {
        return -1 < getIndex(k);
    }
    function get(k)
    {
        return containsKey(k) ? values[i$] : undefined;
    }
    function put(k, v)
    {
        if (containsKey(k))
            values[i$] = v;
        else
        {
            i$ = keys.length;
            keys.push(k$ = k);
            values.push(v);
        }
    }
    this.containsKey = containsKey;
    this.get = get;
    this.put = put;
}
// }}}
