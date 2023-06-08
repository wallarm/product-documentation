[link-points]:      ../points/intro.md
[link-ext-logic]:   ../logic.md

[anchor1]:      parameters.md#oob
[anchor2]:      parameters.md#response
[anchor3]:      parameters.md#checking-the-http-statuses
[anchor4]:      parameters.md#checking-the-http-headers
[anchor5]:      parameters.md#checking-the-body-of-the-http-response
[anchor6]:      parameters.md#checking-the-html-markup


# The Detect Phase

<!-- -->
>   #### Info:: Scope of the phase
>   
>   This phase is obligatory for any FAST extension type to operate (the YAML file should contain the `detect` section).
>   
>   Read about the extension types in detail [here][link-ext-logic].

<!-- -->

> #### Info::  Request elements description syntax
> When creating a FAST extension, you need to understand the structure of the HTTP request sent to the application and that of the HTTP response received from the application in order to correctly describe the request elements that you need to work with using the points. 
> 
> To see detailed information, proceed to this [link][link-points].
<!-- -->

This phase specifies the parameters to look for in the server response in order to make a conclusion about whether a vulnerability was successfully exploited by a test request.

The `detect` section has the following structure:

```
detect:
  - oob:
    - dns
  - response:
    - status:
      - value 1
      - …
      - value S
    - headers:
      - header 1: 
        - value 1
        - …
        - value T
      - header …
      - header N:
        - value 1
        - …
        - value U
    - body:
      - html:
        - tag:
          - value 1
          - …
          - value V
        - attr:
          - value 1
          - …
          - value W
        - attribute:
          - value 1
          - …
          - value X
        - js:
          - value 1
          - …
          - value Y
        - href:
          - value 1
          - …
          - value Z
```

This section contains the set of the parameters. Each of the parameters describes a single element of the response. Some of the parameters can contain an array of other parameters as a value, creating a hierarchy.

The parameter may have the following characteristics:
*   Be optional (the parameter can be either present or absent from the request). All of the parameters in the `detect` section satisfy this characteristic.
 
    > #### Warning:: A note on the parameters that are required in the `detect` section
    > Despite the fact that both `oob` and `response` parameters are optional, one of them must be present in the `detect` section. Otherwise, the Detect phase will be unable to operate. The `detect` section might also contain both of these parameters.

*   Not have an assigned value.  
    
    {% collapse title="Example." %}
```
- response
```    
    {% endcollapse %}

*   Have a single value specified as a string or number.
    
    {% collapse title="Example." %}
```
- status: 500
```
    {% endcollapse %}

*   Have one of multiple assigned values that are specified as a string or number array. 
    
    {% collapse title="Example." %}
```
    - status: 
        - 404
        - 500
```
    {% endcollapse %}

*   Contain other parameters as a value (the parameters are specified as an array).
    
    {% collapse title="Example." %}
```
    - headers: 
        - "Cookie": "example"
        - "User-Agent":
            - "Mozilla"
            - "Chrome"
```
    {% endcollapse %}

The acceptable values for the parameters of the detect section are described in the following sections:
* [oob][anchor1],
* [response][anchor2],
    * [status][anchor3],
    * [headers][anchor4],
    * [body][anchor5],
        * [html][anchor6],
            * attr,
            * attribute,
            * href,
            * js,
            * tag.
