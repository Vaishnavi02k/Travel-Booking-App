FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma/schema.prisma ./prisma/

RUN npx prisma generate

COPY . .

RUN npx prisma db push

RUN npm run build


EXPOSE 3000

CMD ["npm","start"]