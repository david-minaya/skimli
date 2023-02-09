# Install dependencies only when needed
FROM 932577262394.dkr.ecr.us-west-2.amazonaws.com/web-base-repo:latest AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

COPY . .
ENV NODE_ENV production
ENV SENTRY_PROPERTIES  /app/sentry.properties

RUN yarn build

EXPOSE 80
ENV PORT 80

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start:prod"]