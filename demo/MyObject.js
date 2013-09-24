function MyObject()
{
    Serializable.call(this);

    this.content = [];

    for (var i = 0; i < arguments.length; i++)
        this.add(arguments[i]);
}

Serializable.extend(MyObject,
{
    add: function add(value)
    {
        this.content.push(value);
    },
    contains: function contains(value)
    {
        return -1 < this.content.indexOf(value);
    }
});
