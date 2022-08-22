# Quality Assurance Tool
The purpose of the program is to test banking API

##
```terminal
python3 /usr/local/bin/pagekite.py --signup
```
```terminal
python3 /usr/local/bin/pagekite.py http://localhost:8911 qa1.pagekite.me
```
https://qa1.pagekite.me/IncomingPayment


## Secret
````
yarn rw g secret
````
add to .env
SESSION_SECRET=LCmqLkujp...


## Run Scheduler
```bash
yarn rw exec experimentsQueue --param1 true
```

## TODO
* Integrate jwt
* Use websockets for informing user what is going on the backend whe tests are running
