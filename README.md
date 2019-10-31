# express_joi
Uses express and joi to add users, events temporarily on server. 

Uses port environment port or 3000.  /api/user adds a user with {email, password, phone (opt)} sent 
/api/users returns all users.  
/api/event adds a user with {email, event} sent 
/api/events returns events with {show: all, one or last, email: } sent 
