export function quickParse(parseObject) {
	if (parseObject) {
		return JSON.parse(parseObject);
	} else {
		return false;
	}
}