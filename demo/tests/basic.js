function testBasicStringify()
{
    console.info("Basic .stringify()");

    var array   = [undefined, null, 0, 1, 2, 3.4, -5, -6.7, true, false,
        "myString", "my\"String", [], {}, function() {}, new Date()];

    var results = map(stringify, array);

    results.push(stringify(array));

    return results;
}
function testBasicParse(strs)
{
    console.info("Basic .parse()");

    map(parse, strs);
}
