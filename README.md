# RON.js
(Robin's Object Notation)
This is a fun little project that expands on regular JSON by adding a pointer-like feature to the stringified representation of JavaScript objects.
It preserves cyclic references by adding labels (`&{i}`, where `{i}` is an integer) to stringified objects and pointers (`*{i}`, where `{i}` is an integer) where that value should occur.

RON.js includes its own parser/serializer and does not require additional libraries.

## Example

### Including RON.js
```html
<script type="text/javascript" src="RON.js"></script>
```

### Using RON.js
```javascript
var parent = {}, child = {};
parent.child = child;
child.parent = parent;

var JSONstring = JSON.stringify(parent); // TypeError
var RONstring = RON.stringify(parent); // '&0:{"child":{"parent":*0}}'

var reconstructedParent = RON.parse(RONstring);
console.log(reconstructedParent.child.parent === reconstructedParent); // true
```
