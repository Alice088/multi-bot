/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Scenes } from "telegraf";
import { Composer } from "telegraf";
import { sessionData } from "../Context/Context.interface.js";

export abstract class Scene {
	public abstract scene: Scenes.WizardScene<Scenes.WizardContext<Scenes.WizardSessionData>>;
	protected abstract stepHandler: Composer<Scenes.WizardContext<Scenes.WizardSessionData>>;
	protected abstract usersSession: sessionData | undefined

	constructor() {}

	protected abstract enterScene(): void
	protected abstract leaveHandler(): void
}