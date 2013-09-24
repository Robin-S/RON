
function testToJSON()
{
    console.info("Using the .toJSON() method");

    var myObject = new MyObject("Some string"); //Inherits from Serializable

    myObject.add(myObject);

    var myObject_str = stringify(myObject);
    var myObject$    = parse(myObject_str);

    console.log(myObject$.data.content[1] == myObject$);

    return myObject_str;
}
