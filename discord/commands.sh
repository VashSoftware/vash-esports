docker buildx build --platform linux/amd64 -t europe-docker.pkg.dev/vash-esports/discord/discord:1.0 .
docker push europe-docker.pkg.dev/vash-esports/discord/discord:1.0
kubectl rollout restart deployment discord-deployment

docker run --env-file .env europe-docker.pkg.dev/vash-esports/discord/discord:1.0