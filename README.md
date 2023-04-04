# BackEnd-Learning

---

## Notes from Authentication Section -

1. **Picking Database** - We are choosing MongoDB for this course but don't really know why _NOSQL_ and not _SQL_

2. **Why we need Mongoose - ODM**

   - Helps to interact with MongoDB directly without the need to write your own validation and other checks methods.
   - Remember this flow ->
     > Data from the internet is received
     > Then, it is processed by the Backend -> Various validations and some business logic is applied before sending it to the Database.
   - Read [this](https://mongoosejs.com/docs/)
   - **Benefits**
     i. Custom validation checks
     ii. Custom error messages
     iii. Queries are just methods

3. **Data Modeling**

   - What fields are going to be there in the DB?
   - Can be done on pen/paper or some online tools
     **Questions to Ask** - What are the various models - What are the fields for each model

4. **Authentication Part** (Explain the folder _Authentication_)
   - We exported app in app.js and imported it in index.js as sometimes app.js becomes very big and it is often good to add _server.listen_ in _index.js_
   - ==_model_ Folder==
     - It contains user.js (one of the models, as decided in the data modeling phase)
     - We use **mongoose** in _user.js_ to define the ==schema==
     - See [this](https://mongoosejs.com/docs/guide.html) for more details.
     - What are the steps for _registering a user_?
       1. Get all information
       2. Check mandatory fields
       3. Already registered
       4. Take care of password
       5. Generate token or send success message
   - **Understanding middleware**
     - Exactly what it means, something done in between
     - Some check/functionality injected in between
     - ==Next() Keyword==
     - Read about Middleware from Express or Mongoose documentation
     - _Handling Password Situation_
       - Mongoose provides _pre_ and _post_ middlewares
       - Also known as _lifecycle hooks_
       - We'll be using **bcryptjs** library for hashing password and also checking it later while authentication
       - _Finally_ using ==JSON Web Tokens==
       - Key points -
         - Treat token as your car key
         - Expire the token
         - Contains - ==Header, Payload, Signature==
         - [Read More](https://jwt.io/introduction)
       - Login also completed
       - Understanding _Protected Routes_
         - Say, we need to protect the route '/dashboard'
         - **Middlewares** will be useful in this case
         - What are the Key Points?! ->
           - Use middleware _(See "/dashboard" in app.js to understand how auth is called as middleware)_
           - Check for token presence
           - Verify the token _(JWT library provides a method for the same)_
           - Extract info from payload _(See auth.js in middleware directory)_
           - NEXT() _(See auth.js)_
         - ==Mobile Vs Web==
           1. Just send the token to FrontEnd and let the FrontEnd deal with it.
           2. Send in cookie, httpOnly so it is only accessible by the backend.
           3. Send in headers.
           4. In the body.
         - **Implementation and checking of protected route** ->
           1. Login using email as "test@test.com" and password as "123456", using postman. Use route "/login" and give json in _Body -> raw_
           2. Then go in "/dashboard" route and in _Headers_ create a Key as _Authorization_ and then in the value column, enter _Bearer `token from login response (valid for 2 Hrs. only)`_
           3. The response will show _This is some secret information_
         - **Send token in cookies (only for browsers)**
           1. Read everything about cookies [here](https://www.section.io/engineering-education/what-are-cookies-nodejs/)
           2. For cookies, we first create an 'options' object.
           3. Then, we use that object to create cookies. (**see app.js in _/login_)**
           4. We pass a string _"token"_ and this represents the property we use in _auth.js_ to access the value of the token from the cookie.
           5. **Remember** - A JWT token cannot be expired manually and hence can't be used for logout feature. Thus, we instead send an empty cookie in _/logout_ route. (See _/logout_ in app.js)
