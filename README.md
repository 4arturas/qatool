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

# Docker
````
docker build -f DockerfileAPI -t qatoolapi .
docker run -e DATABASE_URL=postgres://postgres:password@192.168.49.2:30432/postgres?connection_limit=1 -p 8080:8911 qatoolapi
````

## TODO
* Integrate jwt
* Use websockets for informing user what is going on the backend whe tests are running
