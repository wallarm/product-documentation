[link-ext-logic]:       logic.md

# The Send Phase

<!-- -->
>   #### Info:: Scope of the phase
>      
>   This phase is obligatory for a nonmodifying extension to operate (the YAML file should contain the `send` section).
>   
>   Note that this phase is absent in a modifying extension because the Send phase would render other phases unusable (except for the Detect phase and implicit Collect phase) if combined with them.
>   
>   Read about the extension types in detail [here][link-ext-logic].

 This phase sends the predefined test requests to test a target application for vulnerabilities. The host that the test requests should be sent to is determined by the `Host` header value in incoming baseline requests.

The `send` section has the following structure:

```
send:
  - method: <HTTP method>
    url: <URI>
    headers:
    - header 1: value
    ...
    - header N: value
    body: <the request body>
  ...
  - method: <HTTP method>
    ...
```

The `send` section in the extension YAML file contains one or more parameter set. Each parameter is specified as a `<key: value>` pair. A given parameter set describes a single HTTP request to be sent as a test request. The following parameters are part of the set:

*   `method`: the HTTP method to be used by the request.

    This is a required parameter: it should be present in any parameter set.
    
    {% collapse title="List of the allowed parameter's values." %}
*   `GET`
*   `POST`
*   `PUT`
*   `HEAD`
*   `OPTIONS`
*   `PATCH`
*   `COPY`
*   `DELETE`
*   `LOCK`
*   `UNLOCK`
*   `MOVE`
*   `TRACE`
    {% endcollapse %}

    {% collapse title="Example." %}
`method: 'POST'`
    {% endcollapse %}

*   `url`: a URL string. The request will be targeted to this URI.

    This is a required parameter: it should be present in any parameter set.
    
    {% collapse title="Example." %}
`url: '/en/login.php'`
    {% endcollapse %}    

*   `headers`: an array that contains one or more HTTP headers in the `header name: header value` format.

    If the constructed HTTP request does not use any header, then this parameter can be omitted.
    
    FAST automatically adds the headers required for the resulting HTTP request to be correct (even if they are missing in the `headers` array); for example, `Host` and `Content-Length`.
    
    {% collapse title="Example." %}
```
headers:
- 'Accept-Language': 'en-US,en;q=0.9'
- 'Content-Type': 'application/xml'
```
    {% endcollapse %}
      
    >   #### Info:: Working with the `Host` header 
    >   
    >   You can add a `Host` header to a test request that differs from the one extracted from a baseline request, if necessary. 
    >   
    >   For example, it is possible to add the `Host: demo.com` header to a test request in the Send section.
    >   If the corresponding extension is running and the FAST node receives a baseline request with the `Host: example.com` header, then the test request with the header `Host: demo.com` will be sent to the `example.com` host. The resulting request is similar to this one:
    >   
    >   ```
    >   curl -k -g -X POST -L -H "Host: demo.com" -H "Content-Type: application/json" "http://example.com/app" --data "{"field":"value"}"
    >   ```
    <!-- -->
    
*   `body`: a string that contains the request's body. You can specify any required request body, as long as you escape special characters, if any, in the resulting string.

    This is a required parameter: it should be present in any parameter set.
    
    {% collapse title="Example." %}
`body: 'field1=value1&field2=value2`
    {% endcollapse %} 

If the `send` section is populated with `N` parameter sets describing the `N` HTTP requests, then for a single incoming baseline request, the FAST node will send `N` test requests to the target application that resides on a host specified in the `Host` header of the baseline request.