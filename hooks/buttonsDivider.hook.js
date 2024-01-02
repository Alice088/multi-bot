export function buttonsDividerHook(array) {
	const pages = [];
  
	let i = 0;

	while (i < array.length) {
		pages.push(array.slice(i, i + 3));
		i += 3;
	}
  
	return pages;
}