[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-yaml]:        https://yaml.org/spec/1.2/spec.html

# Points Building Principles

!!! warning "Reserved words"
    Do not use the following names and keys for the baseline request elements in order to prevent collisions with the reserved words:
        
        * Names and keys that match the names of the parsers
        * Names and keys that match the names of the filters
        * Names and keys that match the `name` and `value` service words 

There are several universal points building principles that must be considered when developing a custom extension.
* All Points are treated as regular expressions.
    
    **Example:**
    * The `HEADER_A.*_value` point refers to the header with the name starting with `A` if such a header is present in the request.
    * The `PATH_\d_value` point refers to the first 10 parts of the request's URI path.



* The parts of the point should be divided using the `_` symbol.
    
    **Example:** 
    
    `URI_value`.

* The names of parsers and filters should be added to the point in upper case.
    
    **Example:** 
    
    `ACTION_EXT_value`.

* The names of the request elements should be added to the point in exactly the same way as they appear in the baseline request.
    
    **Example:** 
    
    For the `GET http://example.com/login/?Uid=01234` request, the `GET_Uid_value` point refers to the `Uid` query string parameter.
    
    !!! info "Escaping special symbols"
        Some of the service symbols might require escaping when used in points. To get detailed information, proceed to the documentation on the [Ruby programming language regular expressions][link-ruby].

* A point can be placed into the extension in the following ways:
    * surrounded by the `"` symbols. 
        
        **Example:** 
        
        `"PATH_.*_value"`.
    
    * surrounded by the `'` symbols. 
        
        **Example:** 
        
        `'GET_.*_value'`.
    
    * not surrounded by any symbols. 
        
        **Example:** 
        
        `HEADER_.*_value`.
    
    !!! info "Surrounding points with symbols"
        YAML syntax defines the difference between using various symbols to surround points. To get detailed information, proceed to this [link][link-yaml].

* Points divided with the `,` symbol and surrounded by the `[` and the `]` symbols are treated as an array of points. 
    
    **Example:** 
    
    `[GET_uid_value, GET_passwd_value]`.

* The service word must always be present at the end of the point to indicate whether the extension should work with the name or the value of the request element. 
    * The `name` service word must be specified to work with the name of the request element. 
        
        The `name` service word can be used together with the following filters:
        * Xml_pi;
        * Xml_dtd_entity.
<br><br>
        
        **Example:** 
        
        The `POST_XML_XML_DTD_ENTITY_0_name` point refers to the name of the first DTD schema directive specified in XML data in the body of the request.
    
    * The `value` service word must be specified to work with the value of the request element.
        
        The `value` service word can be used together with any of the available FAST DSL filters and parsers.
        
        **Example:** 
        
        The `PATH_0_value` point refers to the value of the first request URI path part.