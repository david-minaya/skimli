This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or run frontend only and connect to graphql api in aws
next dev -p 3001 # or yarn dev:client
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

Graphql playground can be accessed at http://localhost:3001/api/graphql

## Set AWS Credentials

1. Run `aws configure sso`
2. set SSO start URL: https://skimli.awsapps.com/start
3. set SSO Region: us-west-2
4. select skimli-env-dev-shared
5. select the available role
6. set CLI default client Region: us-west-2
7. set CLI default output format: json
8. set CLI profile name: dev

After configuring, export AWS_PROFILE=dev. Incase the token is expired run `aws sso login --profile dev` to refresh the token
