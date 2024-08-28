[img-login]:                ../../../images/fast/dsl/common/extension-examples/ojs_broken.png
[img-wireshark]:            ../../../images/fast/dsl/common/extension-examples/wireshark.png

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-ojs-install-manual]:  https://pwning.owasp-juice.shop/companion-guide/latest/part1/running.html

#   Examination of the Sample Application

!!! info "A few words about the application"
    This guide uses the vulnerable [OWASP Juice Shop][link-juice-shop] application to demonstrate the capabilities of the FAST extension mechanism.
    
    It is assumed that an instance of this application is accessible via the `ojs.example.local` domain name. If a different domain name is assigned to the deployed application (see [installation instructions][link-ojs-install-manual]), please replace `ojs.example.local` with the appropriate domain name.
 To successfully construct a FAST extension, you need to understand the mechanism of operation of the web application or API that you need to test for vulnerabilities (the internal architecture of the application or API, request and response format, the logic of exception handling, etc).

Let us perform an inspection of the OWASP Juice Shop application to find out a few potential ways of exploiting vulnerabilities.

To do this, proceed to the login page (`http://ojs.example.local/#/login`) using a browser, enter the `'` symbol into the “Email” field and the `12345` password into the “Password” field, and press the “Log in” button. With the help of the browser's developer tools or Wireshark traffic capturing software, we can figure out that using the apostrophe symbol in the “Email” field causes an internal error in the server. 

After analyzing all information from the request to the server, we can come to the following conclusions:
* The REST API method `POST /rest/user/login` is called when a user is trying to log in.
* The credentials for logging in are transferred to this API method in JSON format as shown below.
    
    ```
    {
        "email": "'",
        "password": "12345"
    }
    ```
    
After analyzing all information from the server's response, we can come to the conclusion that the `email` and `password` values are used in the following SQL query: 
    
```
SELECT * FROM Users WHERE email = ''' AND password = '827ccb0eea8a706c4c34a16891f84e7b'
```

Therefore, we can assume that the OWASP Juice Shop could be vulnerable to SQL injection attacks (SQLi) through the login form.

![The OWASP Juice Shop application login form][img-login]

!!! info "Exploiting the vulnerability"
    The exploitable vulnerability: SQLi.
    
    The official documentation exploits the SQLi vulnerability by passing the `'or 1=1 -- ` email and any password into the login form.
    
    After this attack you will be logged in as the web application administrator.
    
    Alternatively, you can use the payload that contains the existing administrator's email as the `email` field value (the `password` field may contain any value).
    
    ```
    {
        "email": "admin@juice-sh.op'--",
        "password": "12345"
    }
    ```
 To understand how to detect the case of a successful vulnerability exploitation, log in to the site as the administrator using the email and password values mentioned above. Intercept the API server's response using the Wireshark application:
* The HTTP status of the response: `200 OK` (if there are any issues during login, then the server will respond with the `401 Unauthorized` status). 
* The server's response in JSON format that informs about a successful authentication:

    ```
    {
        "authentication": {
            "token": "some long token",     # token value is not important
            "bid": 1,                       # user's shopping cart identifier
            "umail": "admin@juice-sh.op"    # user's email address is stored in the umail parameter
        }
    }
    ```

![Intercepting the API server's response using the Wireshark application][img-wireshark]

