/* {{{ Class: Serializable 
 */
function Serializable()
{
    var state = { constructor: this.constructor.name };

    function toJSON()
    {
        var data = {};

        for (var k in this)
            if (typeof this[k] != "function")
                data[k] = this[k];

        state.data = data;

        return state; //Always return the same object
    }

    this.toJSON = toJSON;
}
Serializable.extend = function extend(F, methods)
{
    extendClass(Serializable, F, methods);
};
// }}}
