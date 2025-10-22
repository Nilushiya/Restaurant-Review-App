# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the ngrok use cmd then get https url use this in the keycloud AuthProvider and google cloud credentials -> https://lucina-headed-manifoldly.ngrok-free.dev -> http://localhost:9090     port should be keyclock port

   ```bash
   ngrok http 9090  
   ```

3. Start the keyclock with ngrok url

   ```bash
   1. https://lucina-headed-manifoldly.ngrok-free.dev/admin/master/console 
   2. realm - restaurant-review
   3. create client 
         Client ID : reactNative-app
         Valid redirect URIs : exp://*
                              exp://172.20.108.47:8081
                              https://lucina-headed-manifoldly.ngrok-free.dev/*
         Web origins : *
   4.save

   user tab create user
   1.userName
   2.Email
   3.create
   4.set password

   add provider
   1.select provider
   2.go to the google cloud credential
   3.click credential
   4.select auth client ID
   5.Application type select web application
   6.give one name in the Name tab
   7copy the keyclock redirect url that show after click provider 
   8.create 
   9.add 
   10.save the client id and secret
   11.go to the keyclock then add client id and secret
   12.Scopes : openid email profile
   13.save
   ```

4. Start the app

   ```bash
   npx expo start --lan -c
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
