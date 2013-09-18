function addEvent(obj, type, callback, useCapture)
{
    if (obj.addEventListener)
        obj.addEventListener(type, callback, useCapture);
    else if (obj.attachEvent)
        obj.attachEvent("on" + type, callback);
    else
        obj["on" + type] = callback;
}
function last(array)
{
    return array[array.length - 1];
}
function main()
{
    console.log("MAIN");

    /* {
        data: &1:[{}, &0:{}],
        meta: *0,
        x: *1
    } */

    var a = [null, null, "data", "data"];
    var b = [a];
    var c = [a, b];

    var obj = {
        0: b,
        data: [c, c, c, b],
        x: c
    };

    var jStr = JSON.stringify(obj);
    console.log(jStr);

    var rStr = RON.stringify(obj);
    console.log(rStr);

    var jObj = JSON.parse(jStr);
    console.log(jObj, jObj[0], last(jObj.data), jObj[0] == last(jObj.data));

    var rObj = RON.parse(rStr);
    console.log(rObj, rObj[0], last(rObj.data), rObj[0] == last(rObj.data));

    var a = {};
    var b = [a];
    a.parent = b;

    var rStr2 = RON.stringify(a);
    console.log(rStr2);

    var rObj2 = RON.parse(rStr2);
    console.log(rObj2, rObj2.parent[0] == rObj2);

    function Element()
    {
        this.children = [];

        this.appendChild = function(el) //Introduce some nasty, but common reference cycles
        {
            el.parent = this;

            if (this.children.length)
            {
                el.previousSibling = last(this.children);
                last(this.children).nextSibling = el;
            }

            this.children.push(el);
        }
    }

    var p = new Element();
    p.appendChild(new Element());
    p.appendChild(new Element());

    console.log(RON.stringify(p));

    var Y;
    function reviver(k, v)
    {
        console.log(k, "::" , v);
        if (!Y && typeof v == "object")
            Y = v;
        return Y || v;
    }

    //function 

    var X = { x: "Some IMPORTANT value" };
    X.data = X;

    var xStr = (RON.stringify(X));
    console.log(xStr);

    var xObj = RON.parse(xStr, reviver);
    console.log(xObj);
}

addEvent(window, "DOMContentLoaded", main, false);
