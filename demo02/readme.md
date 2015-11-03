#Demo 02 - Promise Chaining

- Serial Chain

```javascript
	fetchPartA()
		.then(bindPartA)
		.then(fetchPartB)
		.then(bindPartB)
		.catch(handleProblem);
```

- Parallel Chain

```javascript
	$q.all([
		fetchPartA()
		fetchPartB()])
		.then(bindAllParts)
		.catch(handleProblem);
```

