import { IStickers } from "./IStickers.interface.js";

export class Stickers implements IStickers {
	private stickers: Map<string, string> = new Map();
  
	constructor(stickersIds: readonly [string, string][]) {
		for (const sticker of stickersIds) {
			this.stickers.set(sticker[0], sticker[1]);
		}
	}

	get(stikerName: string): string {
		const stickerId = this.stickers.get(stikerName);
		if (!stickerId) {
			console.error(new Error("Sticker doesn't exist"));
			return "CAACAgIAAxkBAAEo9wVlqOmjFmJ-3Z2UAS5oCzEzOGNdPAAC9Q8AAnPpOEnUF1MmQPE6ojQE";
		} else return stickerId;
	}
}

export const stickers = new Stickers([[
	"Colobok_durak",
	"CAACAgIAAxkBAAEo9wNlqOksEAwgmHbopr3Hd_2vawZDsQACSQEAAntOKhDSitDV6aV93zQE"
]]);