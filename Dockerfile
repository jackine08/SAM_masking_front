FROM node:22.4.1

WORKDIR /app

RUN git clone https://github.com/jackine08/SAM_masking_front.git /app

RUN npm install

RUN npm install axios

EXPOSE 3000

CMD ["npm", "start"]