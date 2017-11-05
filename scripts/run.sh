docker rm story
docker run -v $(pwd):/work --name story story
docker rm story
