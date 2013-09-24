function stringify(value)
{
    var str = RON.stringify(value);

    console.log(value, " --> ", str);

    return str;
}
function parse(str, reviver)
{
    var value = RON.parse(str, typeof reviver == "function" && reviver);

    console.log(str, " --> ", typeof value, value);

    return value;
}


function main()
{
    console.log("MAIN");

    //*  tests/basic.js
    var strs = testBasicStringify();
               testBasicParse(strs); //*/

    //*  tests/basic2.js
    testDoubleReference();
    testCircular(); //*/

    //*  tests/toJSON.js
    var myObject_str = testToJSON();
    var classes      = { MyObject: MyObject };

    testReviver(myObject_str, classes); //*/
}

addEvent(window, "DOMContentLoaded", main, false);
