## Server

[api-docs](https://exapmle.app/api-docs/#/)

### Installation

Server:
```
npm install
npm run start
```
### Environment

Please create .env file with next values or set env variables of you server

#### Front-end application URL
- APP_URL = \[http://localhost]

#### Stripe keys
- STRIPE_SECRET = \[Stripe secret key]

#### Facebook application account

- FACEBOOK_APP_ID = \[Facebook app ID]
- FACEBOOK_APP_SECRET = \[Facebook app Secret]

#### Database credentials
- DB_HOST=\[db_host]
- DB_USER=\[db_user]
- DB_PASSWORD=\[dp_pass]
- DB_NAME=\[db_name]
- DB_PORT=\[db_port]

### Development

#### Naming Conventions

##### Use lowerCamelCase for variables, properties and function names

Variables, properties and function names should use `lowerCamelCase`.  They
should also be descriptive. Single character variables and uncommon
abbreviations should generally be avoided.

##### Use UpperCamelCase for class names

Class names should be capitalized using `UpperCamelCase`.


##### Use UPPERCASE for Constants

Constants should be declared as regular variables or static class properties,
using all uppercase letters.

##### Use kebab-case for file names.

There is no official rule that you have to follow while naming your js file,
but the practice of using a hyphenated name like "some-name.js" is the most widely followed naming convention.