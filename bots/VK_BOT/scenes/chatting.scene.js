import { asyncSetTimeout } from "../../../hooks/asyncSetTimeout.js";
import { addSavedPeople, checkDuplicateSavedPeople } from "../../../db/contollers/SavedPeople.controller.js";
import { getUserByUsername } from "../../../db/contollers/User.controller.js";
import { messageRequest, queueOfRequests } from "../../../index.js";

export function chattingScene() {
	this.bot.updates.on("message_new", async (ctx, next) => {
		if (ctx.text === "начать общение") {
			return ctx.scene.enter("Chatting");
		} else {
			return next();
		}
	});
	
	this.sceneManager.addScenes([
		new this.StepScene("Chatting", [
			async function startChatting(ctx) {
				const currentUser = this.userContext.users[ctx.senderId];
				if (currentUser.interlocutor) return ctx.scene.step.next();

				const homeButtonButton = { keyboard: this.Keyboard.keyboard([this.Keyboard.homeButton]).inline() };

				if (ctx.text === "Домой") {
					ctx.reply("конец общения", {
						keyboard: this.Keyboard.keyboard(this.Keyboard.defaultKeyboard).oneTime()
					});
					return ctx.scene.leave();
				}

				if ((ctx.scene.step.firstTime || !ctx.text)) {
					return ctx.reply("Напишите корректный @@Юзернейм человека из телеграма", homeButtonButton);
				} else if (!ctx.text.startsWith("@@")) {
					return ctx.reply("Неккоректный @@Юзернейм, он должен содержать '@@' в начале", homeButtonButton);
				}	

				ctx.scene.state.interlocutorUsername = `"${ctx.text}"`;
				return ctx.scene.step.next();
			}.bind(this),

			async function checkUsername(ctx) {
				const currentUser = this.userContext.users[ctx.senderId];
				if (currentUser.interlocutor) return ctx.scene.step.next();
				if (ctx.text === "Домой") {
					ctx.reply("конец общения", {
						keyboard: this.Keyboard.keyboard(this.Keyboard.defaultKeyboard).oneTime()
					});
					return ctx.scene.leave();
				}
				
				const interlocutor = await getUserByUsername(ctx.scene.state.interlocutorUsername);
				
				switch (interlocutor.result) {
				case false: {						
					await ctx.scene.leave();
					await ctx.reply(interlocutor.text);
					await asyncSetTimeout(1000);
					await ctx.scene.enter("Chatting");
					break;
				}
					
				case true: {
					currentUser.interlocutor = {};
					currentUser.interlocutor.username = ctx.scene.state.interlocutorUsername;
					currentUser.interlocutor.ID = interlocutor.rows[0].ID;

					const isDuplicates = await checkDuplicateSavedPeople(currentUser.rows.ID, ctx.scene.state.interlocutorUsername);
					if (!isDuplicates && currentUser.rows.ID !== interlocutor.rows[0].ID) {
						await addSavedPeople(currentUser.rows.ID, interlocutor.rows[0].ID, ctx.scene.state.interlocutorUsername, null);
					} 
					await asyncSetTimeout(1000);
				
					await ctx.send("Ожидание собеседника!...");
					await ctx.scene.step.next();
					break;
				}
				}
			}.bind(this),

			function mainChatting(ctx) {
				const currentUser = this.userContext.users[ctx.senderId];

				if (!currentUser.chatting) {
					currentUser.chatting = {};

					currentUser.chatting.clearNumber = setInterval(() => {
						const messageRequestsForCurrentUser = queueOfRequests.getOneFromQueue(currentUser.rows.ID, currentUser.interlocutor.ID);

						if (messageRequestsForCurrentUser) {
							for (const messagesText of messageRequestsForCurrentUser.messages) {
								ctx.send(`${messagesText.text} \n отправлено: ${new Date(messagesText.timeStamp).toLocaleString("ru-RU") }`, {
									keyboard: this.Keyboard.keyboard([this.Keyboard.homeButton]).inline()
								});
							}

							queueOfRequests.deleteAllRequestFromOneUserForOneUser(currentUser.rows.ID, currentUser.interlocutor.ID);
						}
					}, 2000);
				}

				if (ctx.scene.step.firstTime) {
					queueOfRequests.addInQueue(currentUser.interlocutor.ID, messageRequest.createMessageRequest({
						text: "Ожидание собеседника окончено, ваш собеседник: " + currentUser.firstName + "!",
					}, currentUser.rows.ID));
				}

				if (!ctx.isOutbox && (ctx.text | ctx.text !== "Домой") && !ctx.scene.step.firstTime) {
					queueOfRequests.addInQueue(currentUser.interlocutor.ID, messageRequest.createMessageRequest(ctx, currentUser.rows.ID));
				}

				if (ctx.text === "Домой") {
					ctx.reply("конец общения", {
						keyboard: this.Keyboard.keyboard(this.Keyboard.defaultKeyboard).oneTime()
					});

					queueOfRequests.addInQueue(currentUser.interlocutor.ID, messageRequest.createMessageRequest({
						text: `Собеседник ${currentUser.firstName} вышел из разговора`,
					}, currentUser.rows.ID));
					queueOfRequests.deleteAllRequestFromOneUserForOneUser(currentUser.rows.ID, currentUser.interlocutor.ID);

					clearInterval(currentUser.chatting.clearNumber);
					currentUser.chatting = null;
					currentUser.interlocutor = null;
					return ctx.scene.leave();
				}
			}.bind(this)
		])
	]);
}