#Demo 01 - Binding Directly to Promise

Up to [angular 1.1.5](https://code.angularjs.org/1.1.5/), you can bind directly to services that returns a promise.
After 1.1.5, you can no longer do this.

```javascript
function foo() {
	var dfd = $q.defer();
	dfd.resolve("Foo");
	return dfd.promise;
}

var foo1 = foo();
$log.info(foo1);	//will return "Foo" in angular 1.1.5
					//Does not work in later versions.
```