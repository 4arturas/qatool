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

# Docker compose
```bash
docker-compose build
````

```bash
docker-compose up
````

# Docker local registry
https://medium.com/swlh/how-to-run-locally-built-docker-images-in-kubernetes-b28fbc32cc1d
```bash
docker run -d -p 5000:5000 --name registry registry:2.7
````
````
minikube docker-env
````
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://192.168.49.2:2376"
export DOCKER_CERT_PATH="/home/arturas/.minikube/certs"
export MINIKUBE_ACTIVE_DOCKERD="minikube"
````
````
eval $(minikube -p minikube docker-env)
````

```bash
docker build -f DockerfileAPI -t qatoolapi . && docker tag qatoolapi localhost:5000/qatoolapi && docker push localhost:5000/qatoolapi
````

```bash
docker build -f DockerfileWEB -t qatoolweb . && docker tag qatoolweb localhost:5000/qatoolweb && docker push localhost:5000/qatoolweb
````
````

```bash
docker build -f DockerfileAPI -t qatoolapi . && docker tag qatoolapi arturix/qatoolapi && docker push arturix/qatoolapi
````

```bash
docker build -f DockerfileWEB -t qatoolweb . && docker tag qatoolweb arturix/qatoolweb && docker push arturix/qatoolweb
````

```bash
kubectl apply -f argocd/k8s.yaml
````

```bash
kubectl delete -f argocd/k8s.yaml
````

```bash
kubectl logs -f --selector=platform=qatoolapi
````

```bash
kubectl get pod qatoolapi-5846559fdc-cwm84
````

```bash
kubectl exec --stdin --tty qatoolapi-5846559fdc-h4brb -- /bin/sh
````

http://192.168.49.2:32647/graphql

# Docker Postgress
```bash
docker run -itd -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -v /data:/var/lib/postgresql/data --name postgresql postgres
````
# Docker
````
docker build -f DockerfileAPI -t qatoolapi .
docker run -e DATABASE_URL=postgres://postgres:password@192.168.49.2:30432/postgres?connection_limit=1 -p 8080:8911 qatoolapi
docker run -p 8080:8911 qatoolapi
````

## TODO
* Integrate jwt
* Use websockets for informing user what is going on the backend whe tests are running
