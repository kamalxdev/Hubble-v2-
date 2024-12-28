
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
COPY --from=Builder /build/dist ./
CMD ["node", "index.js"]