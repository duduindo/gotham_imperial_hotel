
const values = [true, true, false, true];


Promise.all(
	values.map(val => {
		if (val === true) {
			return Promise.resolve();
		} else {
			return Promise.reject();
		}
	})
).then(() => console.log("Everything is true")).catch(() => console.log("Not everything is true"));


