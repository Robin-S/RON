function testDoubleReference()
{
    console.info("Double references");

    var a    = [],
        b    = {},
        obj  = [a, a, b, b],
        obj$ = parse(stringify(obj));

    console.log(obj$[0] == obj$[1] && obj$[2] == obj$[3]);
}
function testCircular()
{
    console.info("Circular data structures");

    var a = [],
        b = {};

    a.push(b);
    b.container = a;

    var a$ = parse(stringify(a));

    console.log(a$[0].container == a$);
}
