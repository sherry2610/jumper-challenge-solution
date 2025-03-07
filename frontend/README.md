# 🚀 Jumper challenge backend

## 🛠️ Getting Started

### Step 1: 🚀 Initial Setup

- Install dependencies: `yarn`

### Step 2: ⚙️ Environment Configuration

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env`: Fill in necessary environment variables

### Step 3: 🏃‍♂️ Running the Project

- Development Mode: `yarn run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Addtional Information for the reviewer : (Important)

### Environment Configuration :

There is one environment variable which I've created additionally, you can see its names in `.env.template` file as `NEXT_PUBLIC_SIGN_MESSAGE`.

For your (the reviewer) convenience, I'll be providing the value of this environment variable by writing it in the NOTES and also by attaching a file call FE-addtional-one-value.txt through the submission form section.

Ofcourse you can always generate your own value for this environment variable and use it as well. In that case you only have to make sure of one important thing, which is :

- The value you assign to this `NEXT_PUBLIC_SIGN_MESSAGE` environment variable should be exactly the same as the `SIGN_MESSAGE` environment variable from the backend.
