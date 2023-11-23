cd root/backend

mvn install

cd ../../

cp ./react.env ./root/client/.env

docker build -t blunder/frontend ./root/client/

docker build -t blunder/backend ./root/backend/

docker compose up -d