use admin;

db.createUser({
    'user': 'url-shortener',
    'pwd': 'pass',
    'roles': [{ 'role': 'userAdminAnyDatabase', 'db': 'url-shortener'}]
});