export async function promiseSetTimeout(time) {
	await new Promise(res => setTimeout(res, time));
}