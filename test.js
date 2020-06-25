let o1 = {a: 1, b: 2};

let o2 = { ...o1, b: undefined };

let o3 = Object.entries(o1).reduce((acc, [key, val]) => key !== 'b' ? [ ...acc, ...val ]  : acc, []);

console.log(o1, o2, o3)