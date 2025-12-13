FROM node:22-slim


RUN apt-get update && \
    apt-get install -y git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /home/app
COPY package*.json .
RUN npm install 

COPY main.sh main.sh
COPY script.js script.js

RUN chmod +x main.sh
RUN chmod +x script.js


ENTRYPOINT ["/home/app/main.sh"]

