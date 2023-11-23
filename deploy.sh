cd root/backend

mvn install

cd ../../

docker build -t blunder/frontend ./root/client/

docker build -t blunder/backend ./root/backend/

docker compose up -d

docker compose up -d