/* {{{ Module: RON 
 * Copyright (c) 2013, Robin Smit
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 *  Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *  Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *  Neither the name of the Robin Smit nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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
    function Decoder(str, reviver)
    {
        var i      = 0,
            refs   = [];
        var X      = [],
            X$ = [];
        var Memory = [];

        /* {{{ Class: E 
         */
        function E(m)
        {
            this.m = m;

            function equals(e)
            {
                return m == e.m;
            }
            this.equals = equals;
        }
        // }}}
        /* {{{ Method: findInMemory 
         */
        function findInMemory(obj)
        {
            var Y = [obj];
            f(obj);

            function f(obj)
            {
                if (typeof obj == "object" && obj)
                {
                    for (var k in obj)
                    {
                        var v = obj[k];
                        var i = indexOf(Memory, v);

                        if (-1 < i)
                            X$.push([obj, k, v]);
                        else if (-1 == indexOf(Y, v))
                        {
                            Y.push(v);
                            f(v);
                        }
                    }
                }
            }
        }
        // }}}
        /* {{{ Method: revive 
         */
        function revive(target, key, e)
        {
            var value  = valueOf(e);
            var value$ = reviver(key, value);

            if (key in target)
                target[key] = value$;

            if (e instanceof E && value$ != value)
            {
                findInMemory(value$);

                for (var i = X$.length - 1; i >= 0; i--)
                {
                    if (X$[i][2] == value)
                    {
                        X$[i][0][X$[i][1]] = value$;
                        X$.shift();
                    }
                }
            }

            return value$;
        }
        // }}}
        /* {{{ Method: valueOf 
         */
        function valueOf(e)
        {
            return e instanceof E ? valueOf(Memory[e.m]) : e;
        }
        // }}}

        /* {{{ Method: parse 
         */
        function parse()
        {
            var obj = parse_val();

            if (typeof obj != "object" || obj == null)
                return obj;

            /*
            console.log(Memory);
            console.log(S(X)); //*/

            if (!reviver)
                return Memory[0];

            X.push([{}, "", obj]);

            while (X.length)
            {
                var x = X.shift();
                var y = revive.apply(this, x);
                //console.log(valueOf(y));
                //console.log(" ");
            }

            return y;
        }
        // }}}
        /* {{{ Method: parse_val 
         */
        function parse_val(j)
        {
            switch (str[i])
            {
                case 'f':
                case 't': return parse_bool();
                case 'n': return parse_null();
                case '"': return parse_str();

                case '{': return parse_obj(j);
                case '[': return parse_arr(j);

                case '&': return refs[i++, j = parse_number()] = (i++, parse_val(j))
                case '*': return refs[i++, j = parse_number()];

                case '-': 
                default:  return parse_number();
            }
        }
        // }}}
        /* {{{ Method: parse_arr 
         */
        function parse_arr(j)
        {
            var arr = [],
                k   = 0, v,
                m   = Memory.push(arr) - 1,
                e   = new E(m);

            if (j !== undefined)
                refs[j] = e;

            if (str[++i] != ']')
            {
                arr.push(valueOf(v = parse_val()));
                X.push([arr, k++, v]);
            }

            while (str[i++] == ',')
            {
                arr.push(valueOf(v = parse_val()));
                X.push([arr, k++, v]);
            }

            return e;
        }
        // }}}
        /* {{{ Method: parse_bool 
         */
        function parse_bool()
        {
            if (str.substr(i, 5) == "false")
                return i += 5, false;
            else if (str.substr(i, 4) == "true")
                return i += 4, true;
        }
        // }}}
        /* {{{ Method: parse_null 
         */
        function parse_null()
        {
            if (str.substr(i, 4) == "null")
                return i += 4, null;
        }
        // }}}
        /* {{{ Method: parse_number 
         */
        function parse_number()
        {
            var nr_str = str.substr(i).match(/^\-?\d+(?:\.\d+)?/)[0];
            i += nr_str.length;
            return parseFloat(nr_str);
        }
        // }}}
        /* {{{ Method: parse_obj 
         */
        function parse_obj(j)
        {
            var obj = {}, k, v,
                m   = Memory.push(obj) - 1,
                e   = new E(m);

            if (j !== undefined)
                refs[j] = e;

            if (str[++i] != '}')
            {
                obj[k = parse_str()] = (i++, valueOf(v = parse_val()));
                X.push([obj, k, v]);
            }

            while (str[i++] == ',')
            {
                obj[k = parse_str()] = (i++, valueOf(v = parse_val()));
                X.push([obj, k, v]);
            }

            return e;
        }
        // }}}
        /* {{{ Method: parse_str 
         */
        function parse_str()
        {
            var match = str.substr(i).match(/"(\\.|[^"])*"/);
            i += match[0].length;
            return JSON.parse(match[0]);
        }
        // }}}

        this.parse = parse;
    }
    // }}}
    /* {{{ Class: Encoder 
     */
    function Encoder()
    {
        var map = new Map(), refs = [];

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

                case "boolean":
                case "number":
                case "string":
                    return [JSON.stringify(obj)];

                default:
                    return ["null"];
            }
        }
        function encode_obj(obj)
        {
            var s = ['{'], i = 0;

            for (var k in obj)
            {
                if (typeof obj[k] != "function")
                {
                    if (0 < i++)
                        s.push(',');
                    
                    s.push(encode(k), ':', register(obj[k]));
                }
            }

            s.push('}');

            return s;
        }
        function encode_arr(obj)
        {
            var s = ['['],
                i = 0;

            while (i < obj.length && typeof obj[i] == "function")
                i++;

            if (i < obj.length)
                s.push(register(obj[i++]));

            while (i < obj.length)
            {
                if (typeof obj[i] != "function")
                    s.push(',', register(obj[i]));
                i++;
            }

            s.push(']');

            return s;
        }
        function register(obj)
        {
            var i, r;

            if (typeof obj == "object" && obj && "toJSON" in obj && typeof obj.toJSON  == "function")
                obj = obj.toJSON();

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
            }
            else if (obj && typeof obj == "object")
            {
                r = new RepresentationArray();
                map.put(obj, r);
                var s = encode(obj);
                r.representations[0] = r.representations[0].concat(s);
            }
            else
                r = encode(obj);

            return r;
        }
        this.register = register;
    } //}}}
    /* {{{ Class: Map 
     */
    function Map() {

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

    /* {{{ Method: indexOf 
     */
    function indexOf(array, el)
    {
        if (array.indexOf)
            return array.indexOf(el);

        var i = 0;
        while (i < array.length && array[i] !== el)
            i++;

        return i < array.length ? i : -1;
    }
    // }}}
    /* {{{ Method: parse 
     */
    function parse(str, reviver)
    {
        return (new Decoder(str, reviver)).parse();
    }
    // }}}
    /* {{{ Method: stringify 
     */
    function stringify(obj)
    {
        return (new Encoder()).register(obj).toString();
    }
    // }}}
    this.parse     = parse;
    this.stringify = stringify;

}).call(RON);
// }}}
