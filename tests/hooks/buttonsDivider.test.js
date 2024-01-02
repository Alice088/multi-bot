import { describe, expect, test } from "@jest/globals";
import { buttonsDividerHook } from "../../hooks/buttonsDivider.hook.js";

describe("Hook buttonsDivider", () => { 
	test("splits an array on 3 parts", () => {
		const splitedArray = buttonsDividerHook([
			"button", "button", "button",
			"button", "button", "button",
			"button", "button", "button"
		]);
    
		expect(splitedArray.length).toBe(3);
	});
});