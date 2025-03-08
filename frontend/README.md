# 🚀 Jumper challenge frontend

## 🛠️ Getting Started

### Step 1: 🚀 Initial Setup

- Install dependencies: `yarn`

### Step 2: ⚙️ Environment Configuration\*

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env`: Fill in necessary environment variables

### Step 3: 🏃‍♂️ Running the Project

- Development Mode: `yarn run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Addtional Information for the reviewer : (Important)\*

### Environment Configuration :

There is one environment variable which I've created additionally, you can see its names in `.env.template` file as `NEXT_PUBLIC_SIGN_MESSAGE`.

For your (the reviewer) convenience, I'll be providing the value of this environment variable by writing it in the NOTES and also by attaching a file called **`FE-addtional-one-value.txt`** through the submission form section.

Ofcourse you can always generate your own value for this environment variable and use it as well. In that case you only have to make sure of one **important thing**, which is :

- The value you assign to this `NEXT_PUBLIC_SIGN_MESSAGE` environment variable should be exactly the same as the `SIGN_MESSAGE` environment variable from the backend.

## Folder Structure Brief Explanation :

Only necessary files and folders are mentioned below with their brief descriptions.

### ./frontend folder structure

    .
    ├── .next                           # Compiled files (alternatively `dist`)
    ├── public                          # some static assets
    ├── src                             # main src folder
    │   ├── app                         # includes RootLayout and homepage screen
    |   |   └── layout.tsx              # RootLayout wrapped around multiple necessary providers along with Header and Footer.
    |   |   └── page.tsx                # Main Homepage UI.
    │   ├── components                  # Common and Unique components.
    │   └── config                      # config files
    |   |   └── wagmiConfig.ts          # setup wagmi configurations.
    │   ├── contexts                    # Custom Context Providers (e.g RateLimitContext.tsx)
    │   ├── hooks                       # custome hooks
    |   |   └── useAccountVerification  # custom hook for generating signature and verifying account.
    |   |   └── useToast.ts             # custom hook for managing ToastNotifications.
    │   └── services                    # independent methods which includes API calling.
    |   |   └── checkSession.ts         # for validating session by hitting api/account/session endpoint.
    |   |   └── fetchTokens.ts          # for fetching ERC20 tokens holdings by hitting api/tokens endpoint.
    |   |   └── verifyAccount.ts        # for signature verification by hitting api/account/create endpoint
    │   └── utils                       # general and specific functions use all over the app
    |   |   └── helpers.ts              # small functions with common enhancements.
    |   |   └── setupAxiosInterceptor   # for updating RateLimitContext value by intercepting any axios request which has 429 status code.
    ├── .env.template                   # for generating .env from it
    ├── next.config.mjs                 # server url proxy config
    └── README.md                       # info about frontend folder
