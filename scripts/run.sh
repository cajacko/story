docker stop story
docker rm story
docker run -v $(pwd):/work --name story story
docker stop story
docker rm story
