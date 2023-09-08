[link-markers]:         markers.md

[img-oob]:              ../../../images/fast/dsl/en/phases/detect/oob.png
[img-response]:         ../../../images/fast/dsl/en/phases/detect/response.png
[img-http-status]:      ../../../images/fast/dsl/en/phases/detect/http-status.png
[img-headers]:          ../../../images/fast/dsl/en/phases/detect/headers.png
[img-body]:             ../../../images/fast/dsl/en/phases/detect/body.png
[img-html]:             ../../../images/fast/dsl/en/phases/detect/html.png

[anchor1]:      #oob

#   The Detect Phase Parameters Description

!!! warning "Detecting a vulnerability in the Detect phase"
    To detect vulnerability in the Detect phase using a server's response, it is necessary either for the response to contain one of the response elements described in the `response` parameter or for one of the Out-of-Band DNS markers described in the `oob` parameter to trigger (see the detailed information about out-of-band markers [below][anchor1]). Otherwise, it will be assumed that no vulnerabilities were found.

!!! info "Markers operation logic"
    If the Detect phase detects a marker from any payload in the server's response, then the attack is successful, meaning that the vulnerability was successfully exploited. To see detailed information about the Detect phase operating with markers, proceed to this [link][link-markers].

##  OOB

The `oob` parameter checks the triggering of Out-Of-Band markers by the test request. 

![`oob` parameter structure][img-oob]

!!! info "Detecting the OOB marker in the server response"
    If the OOB marker is detected in the server's response, then it will be assumed that the vulnerability was found in the target application. 

* If only `oob` is specified, at least one of the Out-of-Band markers triggering is expected.
    
    ```
    - oob 
    ```

* You can also specify the exact type of Out-of-Band marker to check for its triggering.
    
    At least one of the `DNS_MARKER` markers triggering is expected:
    
    ```
    - oob:
      - dns
    ```

    !!! info "Available OOB markers"
        Currently, there is only one Out-of-Band marker available: `DNS_MARKER`.

!!! info "The Out-of-Band attack mechanism"
    The Out-of-Band (resource load) attack mechanism fully corresponds to its name. When performing the attack, the malefactor forces the server to download malicious content from the external source.
    
    For example, when performing an OOB DNS attack, the malefactor can embed the domain name into the `<img>` tag as follows: `<img src=http://vulnerable.example.com>`.
    
    Upon receiving the malicious request, the server resolves the domain name using DNS and addresses the resource controlled by the malefactor.

##  Response

This parameter checks whether the necessary elements are present in the server's response to a test request. If at least one of these elements is found, then it is assumed that a vulnerability was detected.

![`response` parameter structure][img-response]

* The response should contain any marker.
    
    ```
    - response
    ```

### Checking the HTTP Statuses

![`HTTP Status` parameter structure][img-http-status]

* The response should contain a certain HTTP status.
    ```
    - response:
      - status: value
    ```
    
    ??? info "Example"
        `- status: 500` — the status should have the value of `500`.
            
        `- status: '5\d\d'` — this regular expression covers all the `5xx` statuses.

* The response should contain any of the HTTP statuses from the list.
    
    ```
    - response:
      - status:
        - value 1
        - …
        - value S
    ```
    
    ??? info "Example"
        The HTTP status should contain one of the following values: `500`, `404`, any of the `2xx` statuses.
            
        ```
            - response:
              - status:
                - '500'
                - '404'
                - '2\d\d'
        ```    

### Checking the HTTP headers

![`headers` parameter structure][img-headers]

* The response headers should contain any marker.
    
    ```
    - response:
      - headers
    ```

* The response headers should contain certain data (the `value` can be a regular expression).
    
    ```
    - response:
      - headers: value
    ```
    
    ??? info "Example"
        * At least one of the HTTP headers should contain `qwerty` as a substring.
                
            ```
                - response:
                  - headers: "qwerty"
            ```
            
        * This regular expression covers any header that has a numeric value.
                
            ```
                - response:
                  - headers: '\d+'
            ```    
    
* The certain response header should contain certain data (the `header_#` and `header_#_value` can be regular expressions).
    
    ```
    - response:
      - headers:
        - header_1: header_1_value
        - …
        - header_N: header_N_value
    ```
    
    ??? info "Example"
        The `Cookie` header should contain the `uid=123` data. All of the headers starting with `X-` should not contain any data.
          
        ```
            - response:
              - headers: 
                - "Cookie": "uid=123"
                - 'X-': ""
        ```    
    
* The certain response headers should contain data from the specified list (the `header_#` and `header_#_value_#` can be regular expressions).

    ```
    - response:
      - headers:
        - header_1:
          - header_1_value_1
          - …
          - header_1_value_K
        - …
        - header_N: 
          - header_N_value_1
          - …
          - header_N_value_K
    ```
    
    ??? info "Example"
        The `Cookie` header should contain one of the following data options: `"test=qwerty"`, `"uid=123"`. All of the headers starting with `X-` should not contain any data.
            
        ```
            - response:
              - headers: 
                - "Cookie": 
                  - "uid=123"
                  - "test=qwerty"
                - 'X-': "" 
        ```
    
* The Detect phase can also check whether a certain header is absent from the server's response. To do this, assign `null` to the certain header's value.
    
    ```
    - response:
      - headers:
        - header_X: null
    ```

### Checking the Body of the HTTP Response

![`body` parameter structure][img-body]

* The body of the response should contain any marker.
    
    ```
    - response:
      - body
    ```

* The body of the response should contain certain data (the `value` can be a regular expression).
    
    ```
    - response:
      - body: value
    ```
    
    ??? info "Example"
        The body of the response should contain either the `STR_MARKER` or the `demo_string` substring.
            
        ```
            - response:
              - body: 'STR_MARKER'
              - body: 'demo_string'
        ```

### Checking the HTML Markup

![`html` parameter structure][img-html]

* The HTML markup should contain the `STR_MARKER`.
    
    ```
    - response:
      - body:
        - html
    ```

* The HTML tag in the response should contain the `STR_MARKER`.
    
    ```
    - response:
      - body:
        - html:
          - tag
    ```

* The HTML tag in the response should contain certain data (the `value` can be a regular expression).
    
    ```
    - response:
      - body:
        - html:
          - tag: value
    ```
    
    ??? info "Example"
        The HTML markup of the response should contain the `а` tag.
            
        ```
            - response:
              - body:
                - html:
                  - tag: 'a'
        ```

* The HTML tag in the response should contain any data from the specified list (the `value_#` can be a regular expression).
    
    ```
    - response:
      - body:
        - html:
          - tag: 
            - value_1
            - …
            - value_R
    ```
    
    ??? info "Example"
        The HTML markup of the response should contain one of the following tags: `а`, `img`, or `tr`.
            
        ```
            - response:
              - body:
                - html:
                  - tag:
                    - 'a'
                    - 'img'
                    - 'tr'
        ```    
    
* The HTML attribute of the response should contain the `STR_MARKER`.
    
    ```
    - response:
      - body:
        - html:
          - attribute
    ```

* The HTML attribute should contain certain data (the `value` can be a regular expression).
    
    ```
    - response:
      - body:
        - html:
          - attribute: value
    ```
    
    ??? info "Example"
        The HTML attribute of the response should either contain `abc` as a substring or the calculation marker.
            
        ```
            - response:
              - body:
                - html:
                  - attribute: '(abc|CALC_MARKER)'
        ```    

* The HTML attribute of the response should contain any of the data from the specified list (the `value_#` can be a regular expression):
    
    ```
    - response:
      - body:
        - html:
          - attribute: 
            - value_1
            - …
            - value_F
    ```
    
    ??? info "Example"
        The HTML markup should contain one of the following attributes: `src`, `id`, or `style`.
            
        ```
            - response:
              - body:
                - html:
                  - attribute:
                    - 'src'
                    - 'id'
                    - 'style'
        ```    

!!! info "The shortened version of the `attribute` parameter"
    Instead of using the `attribute` parameter, you can use the shortened version — `attr`.

* The HREF link of the response should contain the `STR_MARKER`.
    
    ```
    - response:
      - body:
        - html:
          - href
    ```

* The HREF link of the response should contain certain data (the `value` can be a regular expression).
    
    ```
    - response:
      - body:
        - html:
          - href: value
    ```
    
    ??? info "Example"
        The HREF link should contain the DNS marker.
            
        ```
            - response:
              - body:
                - html:
                  - href: 'DNS_MARKER'
        ```    
    
* The HREF link of the response should contain any data from the specified list (the `value_#` can be a regular expression).
    
    ```
    - response:
      - body:
        - html:
          - href: 
            - value_1
            - …
            - value_J
    ```
    
    ??? info "Example"
        The HREF link of the response should contain either `google` or `cloudflare` as a substring.
            
        ```
            - response:
              - body:
                - html:
                  - href:
                    - 'google'
                    - 'cloudflare'
        ```

* The JavaScript tokens of the response should contain the `STR_MARKER`.
    
    ```
    - response:
      - body:
        - html:
          - js
    ```
    
    !!! info "JavaScript tokens"
        The JavaScript token is any JavaScript code script that lies within the `<script>` and `</script>` tags.
        
        For example, the following script contains a token with the `wlrm` value:
        
        ```
        <body>
            <script>
            s='123'; 
            wlrm=1;
            </script>
        </body>
        ```

* The JavaScript tokens of the response should contain certain data (the value can be a regular expression).
    
    ```
    - response:
      - body:
        - html:
          - js: value
    ```
    
    ??? info "Example"
        The JavaScript token should contain the `wlrm` value.
            
        ```
            - response:
              - body:
                - html:
                  - js: 'wlrm'
        ```

* The JavaScript tokens of the response should contain any data from the specified list (the `value_#` can be a regular expression).
    
    ```
    - response:
      - body:
        - html:
          - js: 
            - value_1
            - …
            - value_H
    ```
    
    ??? info "Example"
        The JavaScript token should contain either the `wlrm` or the `test` value.
            
        ```
            - response:
              - body:
                - html:
                  - js:
                    - 'wlrm'
                    - 'test'
        ```    
