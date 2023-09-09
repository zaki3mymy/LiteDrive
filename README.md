# LiteDrive

![image](https://github.com/zaki3mymy/LiteDrive/assets/91773180/56fbd33e-0b57-4277-b852-f18bb8259ca0)

LiteDrive is a file storage application using Amazon S3.


## Description

The motivation for this project is to build low cost, high-capacity shared storage. Most of the best storage services have limited storage space on their free plans. And it's just a little pricey for paid plans.

LiteDrive is a storage service that you can start with Amazon S3 usage fee (low cost!).
By building the application within your AWS account, storage charges are tied to your AWS charges.


## Architecture

![LiteDrive architecture](https://github.com/zaki3mymy/LiteDrive/assets/91773180/45fcfa46-06f9-48a7-8a85-ccdf55c03a97)


## Requirement

- Amplify CLI
- npm


## Installation

Clone this repository.
```
git clone https://github.com/zaki3mymy/LiteDrive.git
cd LiteDrive
```

Install dependencies.
```
npm install
```

Building a backend for the development environment.
```
amplify init
amplify push
```


## Usage

First, add a user to Cognito User Pools (named LiteDriveXXXXXXXX_userpool_XXXXXXXX-dev).

Next, run the command below to access http://localhost:8080 and sign in.

```
npm run dev
```

Then, click the add icon at the bottom right and create a folder or upload a file. After that, you can operate it intuitively!


## Deployment

If you want to deploy as a production environment, execute the following command.

```
$ amplify hosting add

√ Select the plugin module to execute · Amazon CloudFront and S3
√ hosting bucket name · LiteDrive-yyyymmddhhMMss-hostingbucket
Static webhosting is disabled for the hosting bucket when CloudFront Distribution is enabled.

You can now publish your app using the following command:
Command: amplify publish

```

At the end.
```
amplify publish
```


## License

LiteDrive is under [MIT LICENSE](./LICENSE).
