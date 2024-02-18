FROM node:18.5.0
ARG DOMAIN_NAME=example.com
ARG API_KEY=
WORKDIR /app
COPY ./package.json ./
RUN yarn install && yarn cache clean --force
ENV PATH=/app/node_modules/.bin:$PATH
ENV VITE_APP_API_BASE_URL=https://$DOMAIN_NAME
ENV VITE_JSON_API_BASE_URL=https://$DOMAIN_NAME/
ENV VITE_API_KEY=${API_KEY}
# Will be overwritten with the contents of src folder when running via docker-compose-dev.yml
COPY ./tools/imagemin.cjs ./tools/imagemin.cjs
COPY ./tools/imagemin-dev.cjs ./tools/imagemin-dev.cjs
WORKDIR /app/src
COPY . .
RUN yarn build
RUN node /app/tools/imagemin.cjs
CMD [ "yarn", "dev" ]
