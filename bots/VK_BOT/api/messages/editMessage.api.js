import axios from "axios";
import { ConfigService } from "../../../../config/configService.class.js";

const configService = new ConfigService();

export async function editMessageApi(params) {
	const { data } = await axios({
		method: "get",

		params: {
			...params,
			access_token: configService.get("TOKEN_VK")
		},

		url: "https://api.vk.com/method/messages.edit"
	}).catch(data => {
		console.error(data.error);
		return data.error;
	});

	if (data.error) {
		console.error(data.error);
		return data.error;
	} else {
		return data.repsonse;
	}
}