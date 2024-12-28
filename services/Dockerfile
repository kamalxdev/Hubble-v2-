
# build stage

FROM node:20 as Builder
WORKDIR /build
COPY *.json ./
RUN npm ci
COPY . .
RUN npx tsc



# production stage

FROM node:20-alpine
WORKDIR /app
COPY --from=Builder /build/node_modules ./node_modules
COPY --from=Builder /build/dist ./
COPY --from=Builder /build/*.json ./

CMD ["node", "index.js"]