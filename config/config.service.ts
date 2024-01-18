import { config, DotenvParseOutput } from "dotenv";
import { IConfigService } from "./IConfigService.js";

export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor() {
		const { error, parsed } = config();
		if(error) throw new Error("File .env not found.");
		else if(!parsed) throw new Error("Empty .env file.");
		else this.config = parsed;
	}

	get(key: string) {
		const res = this.config[key];
		if(!res) throw new Error("Key not found.");
		else return res;
	}
}