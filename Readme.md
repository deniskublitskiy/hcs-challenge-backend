# Human Care System Test Backend

[![CircleCI](https://circleci.com/gh/deniskublitskiy/hcs-challenge-backend/tree/develop.svg?style=svg)](https://circleci.com/gh/deniskublitskiy/hcs-challenge-backend/tree/develop)

API for task management.

## Getting started

Frontend is located in separate [repo](https://github.com/deniskublitskiy/hcs-challenge-frontend-react).

###

### Installing

Move to _deployment_ folder

```
cd deployment/
```

Pull docker images

```
docker-compose pull backend
docker-compose pull frontend
```

Deploy stack

```
docker-compose up
```

or

```
docker stack deploy -c docker-compose.yml hcs-test
```

to run containers in _Docker swarm_.

### Database

Seeds running before starting `backend` service.

To turn off this option change `command` in `backend` service in `docker-compose.yml` file.

Seeds created 5 user by default (name / password):

```
testuser1 / testuser1
testuser2 / testuser2
testuser3 / testuser3
testuser4 / testuser4
testuser5 / testuser5
```

Also created mock tasks with fake title, description and due date for each user.

### Testing

```
npm test
```