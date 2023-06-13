[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-ext-logic]:       logic.md

# The Match Phase

!!! info "Scope of the phase"  
    This phase is used in a modifying extension and is optional for its operation (the `match` section may be either absent or present in the YAML file).

    This phase should be absent from the non-modifying extension's YAML file.
    
    Read about the extension types in detail [here][link-ext-logic].

!!! info "Request element description syntax"
     When creating a FAST extension, you need to understand the structure of the HTTP request sent to the application and that of the HTTP response received from the application in order to correctly describe the request elements that you need to work with, using the points. 
    
    To see detailed information, proceed to this [link][link-points].
 
 This phase checks if an incoming baseline request matches specified criteria.

The `match` section in the extension YAML file contains an array of `<key: value>` pairs. Each pair describes a certain element of the request (the key) and this element's data (the value). The key and the value may contain regular expressions in the [Ruby regular expression format][link-ruby-regexp].

The Match phase looks for matches for all the given `<key: value>` pairs in the baseline request.
* The request is checked against the presence of the required elements (for example, the path value in the URL, the GET parameter, or the HTTP header) with the required data. 
    
    {% collapse title="Example 1." %}
`'GET_a_value': '^\d+$'` — the GET parameter named `a` with a value containing only digits should be present in the request.
    {% endcollapse %}
    
    {% collapse title="Example 2." %}
`'GET_b*_value': '.*'` — the GET parameter with the name starting with `b`, with any value (including the empty value), should be present in the request.
    {% endcollapse %}
    
* If the value is set to `null` for a given key, then the absence of the corresponding element is checked in the request.
    
    {% collapse title="Example." %}
`'GET_a': null` — the GET parameter named `a` should be absent from the request.
    {% endcollapse %}

For the baseline request to get through the Match phase, it is necessary that the request satisfy all of the `<key: value>` pairs in the `match` section. If no match for any of the `<key: value>` pairs described in the `match` section is found in the baseline request, then the request will be discarded.

{% collapse title="Example." %}
The `match` section shown below contains the list of the `<key: values>` pairs. For the baseline request to get through the Match phase, it has to satisfy all of these pairs.

```
match:
  - 'HEADER_HOST_value': 'example.com'
  - 'GET_password_value': '^\d+$'
  - 'HEADER_CONTENT-TYPE_value': null
```

1. The baseline request should contain the HTTP header named `Header`, with the value containing `example.com` as a substring.
2. The `password` GET parameter's value should contain digits only.
3. The `Content-Type` header should be absent.
{% endcollapse %}