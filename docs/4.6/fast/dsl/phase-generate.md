[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-logic]:           logic.md
[link-markers]:         detect/markers.md
[link-ext-logic]:       logic.md

[img-generate-methods]:     ../../images/dsl/en/phases/generate-methods.png
[img-generate-payload]:     ../../images/dsl/en/phases/generate-payload.png

#  The Generate Phase

!!! info "Scope of the phase"
    This phase is used in a modifying extension and is optional for its operation (the `generate` section may be either absent or present in the YAML file).

    This phase should be absent from the non-modifying extension's YAML file.
    
    Read about the extension types in detail [here][link-ext-logic].

 !!! info "Request element description syntax"
     When creating a FAST extension, you need to understand the structure of the HTTP request sent to the application and that of the HTTP response received from the application in order to correctly describe the request elements that you need to work with using the points. 
     
     To see detailed information, proceed to this [link][link-points].
 
 This phase specifies a payload to be inserted in the particular parameters of a baseline request to create a test requests that are based on this request.

The `generate` section has the following structure:

```
generate:
  - into:
    - parameter 1
    - parameter 2
    - …
    - parameter N
  - method:
    - postfix
    - prefix
    - random
    - replace
  - payload:
    - payload 1
    - payload 2
    - …
    - payload N
```

*   The `into` parameter allows the specification of single or multiple request elements that the payload should be inserted into. This parameter's value can be a string or an array of strings. You can use a [Ruby-formatted regular expression][link-ruby-regexp] as the `into` parameter's value.
    
    This parameter is optional and it may be absent in the section. If the `into` parameter is omitted, the payload is inserted into the request element that is allowed to be modified according to the given test policy.
    
    Let us suppose that the following mutable request elements were extracted from the baseline request according to the test policy:
    *   `GET_uid_value`
    *   `HEADER_COOKIE_value`
<br><br>
    
    The extension will sequentially process all of the mutable elements (also known as insertion points). 
    
    If the `into` parameter is absent, then the payloads will be sequentially pasted into the `GET_uid_value` parameter and the produced test requests will be used to check the target application for vulnerabilities. Then, after the test request results are processed, the extension processes the `HEADER_COOKIE_value` parameter and similarly inserts the payloads into this parameter.
    
    If the `into` parameter contains the `GET_uid_value` request parameter, as shown in the following example, then the payload will be inserted into the `GET_uid_value` parameter but not the `HEADER_COOKIE_value` parameter.
    
    ```
    into: 
      - 'GET_uid_value'
    ```
    Because the following example contains only one parameter, the into parameter value may be written in one line:
    
    `into: 'GET_uid_value'`

*   `method` — this optional parameter specifies the list of the methods that will be used to insert the payload into the baseline request element. 
    *   `prefix` — insert the payload before the baseline request element value.
    *   `postfix` — insert the payload after the baseline request element value.
    *   `random` — insert the payload into a random place in the baseline request element value.
    *   `replace` — replace the baseline request element value with the payload.
    
    ![!Payload insertion methods][img-generate-methods]
    
    If the `method` parameter is absent, the `replace` method will be used by default.
    
    The number of test requests created depends on the number of specified `methods`: one test request per insertion method.
    
    For example, if the following insertion methods are specified:
    
    ```
    method:
      - prefix
      - replace
    ```
    
    then for a single payload, two test requests are created; for two payloads, four test requests are created (two test requests for each payload), and so on.

*   The `payload` parameter specifies the list of payloads to be inserted into the request parameter to create a test request that will then test the target application for vulnerabilities.
    
    This parameter is obligatory, and it should always be present in the section. The list should contain at least one payload. If there are multiple payloads, the FAST node sequentially inserts payloads into the request parameter and tests the target application for vulnerabilities using each of the test requests created.
    
    ![!Payload generation][img-generate-payload]
    
    The payload is a string that is inserted into one of the parameters during the request processing.
    
    {% collapse title="Example of multiple payloads." %}
```
payload:
  - "') or 1=('1"
  - "/%5c../%5c../%5c../%5c../%5c../%5c../%5c../etc/passwd/"
```
    {% endcollapse %}
    
    You can use special markers as a part of the payload to further expand the possibilities of vulnerability detection.
    *   **`STR_MARKER`** — insert a random string into the payload exactly in the position where the `STR_MARKER` is specified. 
        
        For example, the `STR_MARKER` can be used to check the application for an XXS vulnerability.
        
        {% collapse title="Example." %}
`'userSTR_MARKER'`
        {% endcollapse %}
    
    *   **`CALC_MARKER`** — insert a string containing a random arithmetic expression (for example, `1234*100`) into the payload exactly in the position where the `CALC_MARKER` is specified.
        
        For example, the `CALC_MARKER` can be used to check the application for an RCE vulnerability.
        
        {% collapse title="Example." %}
`'; bc <<< CALC_MARKER'`
        {% endcollapse %}
    
    *   **`DNS_MARKER`** — insert a string containing a random domain (for example, `r4nd0m.wlrm.tl`) into the payload exactly in the position where the `DNS_MARKER` is specified.
        
        For example, the `DNS_MARKER` can be used to check the application for DNS Out-of-Bound vulnerabilities.

        {% collapse title="Example." %}
`'; ping DNS_MARKER'`
    {% endcollapse %}
    
    !!! info "Markers operation logic"
        If the Detect phase detects a marker from any payload in the server's response, then the attack is successful, meaning that the vulnerability was successfully exploited. To see detailed information about the Detect phase operating with markers, proceed to this [link][link-markers].