run:
	docker run -d -p 3000:3000 -v userData:/app/dataUsers --env-file ./.env --name multi-bot-v3.1 multi-bot-image:v3.1

run-dev:
	docker run -d -p 3000:3000 -v C:/Users/zona3/projects/multi-bot:/app -v /app/node_modules -v userData:/app/dataUsers --env-file ./.env --name multi-bot-v3.1 multi-bot-image:v3.1.1
image:
	docker build -t multi-bot-image:v3.1.1 .
