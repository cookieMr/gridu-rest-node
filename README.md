## Requirements

* **Done**: The API should return data in JSON format.
* **Done**: You can POST to `/api/users` with form data username to create a
  new user. The returned response will be an object with username and `_id`
  properties.
* **Done**: You can make a GET request to `/api/users` to get an array of all
  users. Each element in the array is an object containing a user's username
  and `_id`.
* **Done**: You can POST to `/api/users/:_id/exercises` with form data
  `description`, `duration`, and optionally `date`. If no date is supplied,
  the current date will be used. The response returned will be the user object
  with the exercise fields added.
* **Done**: You can make a GET request to `/api/users/:_id/logs` to retrieve
  a full exercise log of any user. The returned response will be the user
  object with a log array of all the exercises added. Each log item has the
  `description`, `duration`, and `date` properties.
* **Done**: A request to a user’s log (`/api/users/:_id/logs`) returns an
  object with a `count` property representing the total number of exercises
  without limits. For example, this might be needed for pagination where we
  display a number of exercises on the page but want to know how many items
  there are overall.
* **Done**: You can add `from`, `to` and `limit` parameters to a
  `/api/users/:_id/logs` request to retrieve part of the log of any user.
  `from` and `to` are dates in `yyyy-mm-dd` format. `limit` is an integer of
  how many logs to send back.

---

## Running App in Docker
Just run the following command
```bash
docker-compose down && docker-compose up --build
```

and then start using Postman Collection `grid_u_node.postman_collection.json`.

---

## Endpoints

* [Home page](http://localhost:8080/)
* [PHP MySQL Web Console](http://localhost:8082/)
