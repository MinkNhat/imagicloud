
- node v22.14.0.
- next js 15.
- tailwindcss v3.
- extension 'ES7+ React/Redux/React-Native snippets'.

____________________________________________________________________________________________________________________________________

1. clone git repo
2. cài node và npm nếu chưa có ( v22.14.0 )
3. mở terminal, chạy npm install để cài thư viện 
4. tạo file .env.local ở thư mục gốc ( ngang với app, package.json, ....)
5. chạy project bằng 'npm run dev'

____________________________________________________________________________________________________________________________________

- Next js sử dụng serverless enviroment -> dễ mở rộng hơn -> tuy nhiên kh duy trì kết nối, phải tạo lại kết nối với mongodb mỗi lần request.
- Để đồng bộ user ở db (mongo) với user ở clerk, dùng webhooks -> tạo endpoints 


____________________________________________________________________________________________________________________________________

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
