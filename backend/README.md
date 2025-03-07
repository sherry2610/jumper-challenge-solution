# 🚀 Jumper challenge backend

## 🛠️ Getting Started

### Step 1: 🚀 Initial Setup

- Install dependencies: `yarn`

### Step 2: ⚙️ Environment Configuration

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env`: Fill in necessary environment variables (specially the last three)

### Step 3: 🏃‍♂️ Running the Project

- Development Mode: `yarn run dev`
- Building: `yarn run build`
- Production Mode: Set `.env` to `NODE_ENV="production"` then `npm run build && npm run start`

## Addtional Information for the reviewer : (Important)

### Environment Configuration :

There are three additional environment variables which I've created additionally, you can see their names in `.env.template` file as follows :

- SIGN_MESSAGE
- JWT_SECRET=
- ETHERSCAN_API_KEY=

For your (the reviewer) convenience, I'll be providing the values of these three environment variables by writing them in the NOTES and also by attaching a file call addtional-three-values.txt through the submission form section.

Ofcourse you can always generate your own values for these three environment variables and use them as well. In that case you only have to make sure of one important thing, which is :

- The value you assign to this SIGN_MESSAGE environment variable should be exactly the same as the `NEXT_PUBLIC_SIGN_MESSAGE` environment variable from the frontend.
