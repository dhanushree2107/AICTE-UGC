# Stage 1: Build Angular application
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN node node_modules/@angular/cli/bin/ng build --configuration=production

# Stage 2: Serve using Nginx
FROM nginx:alpine
COPY --from=build /app/dist/aicte-ug-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
