# serverlessbox

![image](https://github.com/zaki3mymy/serverlessbox/assets/91773180/74122d19-b714-4899-8912-395f3dfb4ec1)

serverlessbox is a file storage application using Amazon S3.


## Description

The motivation for this project is to build low cost, high-capacity shared storage. Most of the best storage services have limited storage space on their free plans. And it's just a little pricey for paid plans.

serverlessbox is a storage service that you can start with Amazon S3 usage fee (low cost!).
By building the application within your AWS account, storage charges are tied to your AWS charges.


## Architecture

![serverlessbox architecture](https://github.com/zaki3mymy/serverlessbox/assets/91773180/e69dc604-b146-42d7-ab43-a7e7e402236d)


## Requirement

- Amplify CLI
- npm


## Installation

Clone this repository.
```
git clone https://github.com/zaki3mymy/serverlessbox.git
cd serverlessbox
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

First, add a user to Cognito User Pools (named serverlessboxXXXXXXXX_userpool_XXXXXXXX-dev).

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
√ hosting bucket name · serverlessbox-yyyymmddhhMMss-hostingbucket
Static webhosting is disabled for the hosting bucket when CloudFront Distribution is enabled.

You can now publish your app using the following command:
Command: amplify publish

```

At the end.
```
amplify publish
```


## License

serverlessbox is under [MIT LICENSE](./LICENSE).
