# Stage 1 - get production environment
FROM nginx:alpine as base
EXPOSE 80

# Stage 2 - get build environment & build
FROM node:12.17.0 as build

RUN npm i -g npm@7.0.14

WORKDIR /app
COPY ["./package.json", "./"]
COPY ["./.npmrc", "./"]
RUN npm cache clean --force
RUN npm install --legacy-peer-deps
COPY ["./", "./"]
RUN npm run build

# Stage 3 - copy files in production enviroment
FROM base AS final
COPY --from=build /app/build /usr/share/nginx/html
# --------- only for those using react router ----------
# if you are using react router 
# you need to overwrite the default nginx configurations
# remove default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf
# replace with custom one
COPY nginx/nginx.conf /etc/nginx/conf.d
# --------- /only for those using react router ----------
CMD ["nginx", "-g", "daemon off;"]


