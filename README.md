# Conbfuscate

Conbfuscate is a middle-man that hides your email from bots when you only have access to a front-end.
## Usage
Example exposing email address to the world:
```html
<a href="mailto:your-email@example.com">Send me a message.</a>
```

HTML example:
```html
<form method="post" action="https://example-server-1.herokuapp.com/message">
    <input name="email"/>
    <textarea name="message"></textarea>
    <button>Submit</button>
</form>
```

Programatically:
```js
let email = "john@example.com";
let message = "Hello,\nwe need to talk😊";
fetch(`https://example-server-1.herokuapp.com/message/${email}/${message}`);
```
Result:

Subject|```msg from john@example.com```
--:|---
To|```your-email@example.com```
From|```your-bot@gmail.com```
Message|```Hello,```<br>```we need to talk😊```

## Setup
### 1. Setup a bot gmail account

Create a gmail account for your bot.

Gmail will block your bot's login attempt by default. Log into gmail as your bot and visit: ```https://myaccount.google.com/lesssecureapps``` to enable your bot.

![](https://i.imgur.com/zB0NV2s.png)

### 2. Setting up bot's server environment

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.
Create a ```.env``` file and add the following:
```
NM_TRANS_EMAIL=yourBotsGmail@gmail.com
NM_TRANS_PASS=yourBotsGmailPassword
NM_TARGET=yourEmail@gmail.com
```

If you want to use Heroku, log into Heroku and add each line:
```sh
$ heroku login
$ heroku config:set NM_TRANS_EMAIL=yourBotsGmail@gmail.com
$ heroku config:set NM_TRANS_PASS=yourBotsGmailPassword
$ heroku config:set NM_TARGET=yourEmail@gmail.com
```
#### Port
If you need to use a custom port locally, you can set the ```PORT``` environmental variable. *Do not* set the port on Heroku, as Heroku passes your app a custom port each run. The ```.env``` file is never pushed to Heroku.

### 3. Deploying to Heroku
#### First run
```sh
$ heroku login
$ heroku create
$ git push heroku master
$ heroku open
```
Your server should now be running, test it out! In case conbfuscate is updated, you will need to push updates:

#### Push Updates
```sh
$ git push heroku master
$ heroku open
```



## Security
Conbfuscate provides extra security in that it does not expose an email address to client front-ends. A malicious actor could send the Heroku server repeated message requests that would result in your emails being flooded, and your heroku account being rate-limited or charged, in an amplification attack for example.

## Caveats
Free Heroku apps are down for maintainance 1 hour per week.

## Contributing
Pull requests are welcome, please submit a pull request first, then create an issue explaining your modifications. Kindly link your pull request in your Issue.

### Development
Install from GitHub:
```sh
$ git clone https://github.com/Exac/conbfuscate.git
$ cd conbfuscate
$ git fork
```
#### Running the app
##### Locally
```sh
$ npm install
$ npm dev
```

##### Heroku
```sh
$ heroku login
$ heroku local web
```

##### Remotley
```sh
$ npm install
$ npm run start
```

