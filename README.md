# Digital Mafia

Digital Mafia is a full-stack employee dashboard application developed using Angular and Node.js for the 2024 Monkey and River Hackathon.

## Context
This project was developed during the Monkey and River Hackathon 2024.
The focus was on rapid delivery of a role-based onboarding and administration
platform within a constrained timeframe.

## How to run the app?

What you need to do is clone the git repository to your local workspace then ensure that you have the following dependencies installed:

On the `backend` folder:

| Backend Package                   | Version  |
| --------------------------------- | -------- |
| @angular-builders/custom-webpack  | 18.0.0   |
| @angular-devkit/build-angular     | 18.2.1   |
| @angular/animations               | 18.2.1   |
| @angular/cdk                      | 18.2.2   |
| @angular/cli                      | 18.2.2   |
| @angular/common                   | 18.2.1   |
| @angular/compiler-cli             | 18.2.1   |
| @angular/compiler                 | 18.2.1   |
| @angular/core                     | 18.2.1   |
| @angular/forms                    | 18.2.1   |
| @angular/material-moment-adapter  | 18.2.2   |
| @angular/material                 | 18.2.2   |
| @angular/platform-browser-dynamic | 18.2.1   |
| @angular/platform-browser         | 18.2.1   |
| @angular/platform-server          | 18.2.1   |
| @angular/router                   | 18.2.1   |
| @angular/ssr                      | 18.2.1   |
| @fortawesome/fontawesome-free     | 6.6.0    |
| @types/express                    | 4.17.21  |
| @types/jasmine                    | 5.1.4    |
| @types/node                       | 18.19.47 |
| angular-calendar                  | 0.31.1   |
| chart.js                          | 4.4.4    |
| date-fns                          | 3.6.0    |
| dotenv-webpack                    | 8.1.0    |
| express                           | 4.19.2   |
| jasmine-core                      | 5.2.0    |
| jsonwebtoken                      | 9.0.2    |
| karma-chrome-launcher             | 3.2.0    |
| karma-coverage                    | 2.2.1    |
| karma-jasmine-html-reporter       | 2.1.0    |
| karma-jasmine                     | 5.1.0    |
| karma                             | 6.4.4    |
| moment                            | 2.30.1   |
| ng2-charts                        | 6.0.1    |
| rxjs                              | 7.8.1    |
| tslib                             | 2.7.0    |
| typescript                        | 5.5.4    |
| zone.js                           | 0.14.10  |

The `backend` folder also requires a `.env` file with the following structure and names:

```
# database
DB_PASSWORD=`your password for MySQL root account running on localhost`
DB_DATABASE=DigitalMafia

# routing
PORT

# tokens
TOKEN_KEY
TOKEN_EXPIRY
```

On the `frontend` folder:

| Frontend Package | Version |
| ---------------- | ------- |
| bcrypt           | 5.1.1   |
| cors             | 2.8.5   |
| dotenv           | 16.4.5  |
| express          | 4.19.2  |
| jsonwebtoken     | 9.0.2   |
| mysql2           | 3.11.0  |
| nodemon          | 3.1.4   |
| sequelize        | 6.37.3  |

## How to use the app?

To access the app you can sign up on the `/register` page and fill in your details.

### Roles

Be mindful when you select the role, as when you select an admin role you will need to be authorized by a preexisting admin to be able to use the app. The log in details for initial preexisting admin are as follows:

```
email: "root@root.com"
password: "password123"
```

After logging in you will receive access to pages available according to your role.

## Contributers

Meet the team:

| Name                 | @github         |
| -------------------- | --------------- |
| Khomotso Kumalo      | @KhomotsoKumalo |
| Masilo Makola        | @Makola1Goated  |
| Siphamandla Mazibuko | @fawkesdbs      |
| Obakeng Mokgatle     | @sobb1e         |

We appreciate the opportunity given and we hope you enjoy the app.

