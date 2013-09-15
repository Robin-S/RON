/* {{{ Module: RON 
 */
/** RON - Robin's Object Notation
 *
 * This module is similar to JSON, but preserving
 *  internal references. Note: regular JSON parsers
 *  will most likely break parsing input containing
 *  such references.
 */
var RON = new (function RON() {})();

(function Setup_RON()
{
    /* {{{ Class: Decoder 
     */
    function Decoder(str)
    {
        var i = 0;
        var refs = [];

        function parse(j)
        {
            switch (str[i])
            {
                case '{': return parse_obj(j);
                case '[': return parse_arr(j);
                case '&': return refs[i++, j = parse_number()] = (i++, parse(j));
                case '*': return refs[i++, parse_number()];
                case '"': return parse_str(j);
                default:  return !isNaN(str[i]) ? parse_number() : parse_null();
            }
        }
        P(this, parse);

        function parse_arr(j)
        {
            var arr = [];

            if (j !== undefined)
                refs[j] = arr;

            if (str[++i] != ']')
                arr.push(parse());

            while (str[i++] == ',')
                arr.push(parse());

            return arr;
        }
        function parse_null()
        {
            i += 4;
            return null;
        }
        function parse_number()
        {
            var match = str.substr(i).match(/^\d+(?:\.\d+)?/);
            var nr_str = match[0]
            i += nr_str.length;
            return parseFloat(nr_str);
        }
        function parse_obj(j)
        {
            var obj = {};

            if (j !== undefined)
                refs[j] = obj;

            if (str[++i] != '}')
                obj[parse_str()] = (i++, parse());

            while (str[i++] == ',')
                obj[parse_str()] = (i++, parse());

            return obj;
        }
        function parse_str()
        {
            var match = str.substr(i).match(/"(\\.|[^"])*"/);
            i += match[0].length;
            return JSON.parse(match[0]);
        }
    } //}}}
    /* {{{ Class: Encoder 
     */
    function Encoder()
    {
        var map = M(), refs = [];
        var N = 0;

        function encode(obj)
        {
            switch (typeof obj)
            {
                case "object":
                    if (!obj)
                        return ["null"];
                    else if ("length" in obj)
                        return encode_arr(obj);
                    else
                        return encode_obj(obj);

                case "string":
                    return ['"' + obj.replace(/"/g, "\\\"") + '"'];
            }
        }
        P(this, encode);

        function encode_obj(obj)
        {
            var s = ['{'], i = 0;

            for (var k in obj)
            {
                if (0 < i++)
                    s.push(',');
                
                s.push(encode(k), ':', register(obj[k]));
            }

            s.push('}');

            return s;
        }
        function encode_arr(obj)
        {
            var s = ['['];

            if (obj.length)
                s.push(register(obj[0]));

            for (var i = 1; i < obj.length; i++)
                s.push(',', register(obj[i]));

            s.push(']');

            return s;
        }
        /**
         * {{{ Method: register 
         * @return: RepresentationArray
         */
        function register(obj)
        {
            var i, r;

            /*
            if (N++ < 50)
                console.log("register", obj, map.containsKey(obj));
            */

            if (map.containsKey(obj))
            {
                r = map.get(obj);
                i = indexOf(refs, obj);

                if (i == -1) //obj has not been doubly referenced
                {
                    i = refs.push(obj) - 1;
                    r.representations[0].unshift('&' + i + ':');
                }

                r.representations.push(['*' + i]);
                //console.log("Added reference", r);
            }
            else
            {
                r = new RepresentationArray();
                map.put(obj, r);
                var s = encode(obj);
                //console.log(s);
                r.representations[0] = r.representations[0].concat(s);
                //console.log(map.getContent());
            }

            return r;
        } //}}}
        P(this, register);
    } //}}}
    /* {{{ Class: RepresentationArray 
     */
    function RepresentationArray()
    {
        var i = 0;
        this.representations = [[]]; //Start with an empty representation

        this.toString = function() {
            return this.representations[i++].join("");
        };
    } //}}}

    /* {{{ Method: parse 
     */
    function parse(str)
    {
        return (new Decoder(str)).parse();
    } //}}}
    /* {{{ Method: stringify 
     */
    function stringify(obj)
    {
        return (new Encoder()).register(obj).toString();
        //return (new Encoder()).encode(obj).join("");
    } //}}}
    P(this, parse, stringify);

}).call(RON); //}}}
