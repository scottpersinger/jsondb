GET /db/connect_dev/tables
  -> list of tables

POST /db/connect_dev/tables/users
  {'email':'scottp@heroku.com'
  'name':'Scott Persinger',
  'address':{'city':'orinda','state':'CA'}
  }

  ->
  {id: 'a123'}


POST /db/connect_dev/tables/photos
  {'url':'url1'
  'user_id':'a123',
  }

  ->
  {id: 'a123'}

GET /db/connect_dev/tables/users
  [{user dict1}, {user dict2}, ...]

GET /db/connect_dev/tables/users/a123
  {'email':'...', 'name':'...'}

GET /db/connect_dev/tables/users?email=scottp@heroku.com
  [{'email':'scottp@heroku.com', ...}]


GET /db/connect_dev/tables/users?address.state=CA
  [{'email':'scottp@heroku.com', ...},...]

GET /db/connect_dev/tables/users?include=user
  [{'email':'scottp@heroku.com', ...},...]

