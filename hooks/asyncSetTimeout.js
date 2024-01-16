export async function asyncSetTimeout(time) {
	await new Promise(res => setTimeout(res, time));
}