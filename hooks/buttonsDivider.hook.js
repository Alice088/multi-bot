export function buttonsDividerHook(array) {
	const pages = [];
  
	let i = 0;

	if (array.length) {
		while (i < array.length) {
			pages.push(array.slice(i, i + 3));
			i += 3;
		}

		if (pages.at(-1).length !== 3) {
			pages.at(-1).push({ saved_TGNAME: null });
		}
	}

	return pages;
}