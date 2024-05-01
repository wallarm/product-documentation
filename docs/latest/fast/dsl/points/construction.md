[link-http]:                    parsers/http.md
[link-uri]:                     parsers/http.md#uri-filter
[link-path]:                    parsers/http.md#path-filter
[link-actionname]:              parsers/http.md#action_name-filter
[link-actionext]:               parsers/http.md#action_ext-filter
[link-get]:                     parsers/http.md#get-filter
[link-header]:                  parsers/http.md#header-filter
[link-post]:                    parsers/http.md#post-filter
[link-formurlencoded]:          parsers/form-urlencoded.md
[link-multipart]:               parsers/multipart.md
[link-cookie]:                  parsers/cookie.md
[link-xml]:                     parsers/xml.md
[link-xmlcomment]:              parsers/xml.md#xml_comment-filter
[link-xmldtd]:                  parsers/xml.md#xml_dtd-filter
[link-xmldtdentity]:            parsers/xml.md#xml_dtd_entity-filter
[link-xmlpi]:                   parsers/xml.md#xml_pi-filter
[link-xmltag]:                  parsers/xml.md#xml_tag-filter
[link-xmltagarray]:             parsers/xml.md#xml_tag_array-filter
[link-xmlattr]:                 parsers/xml.md#xml_attr-filter
[link-jsondoc]:                 parsers/json.md
[link-jsonobj]:                 parsers/json.md#json_obj-filter
[link-jsonarray]:               parsers/json.md#json_array-filter
[link-array]:                   parsers/array.md
[link-hash]:                    parsers/hash.md
[link-gzip]:                    parsers/gzip.md
[link-base64]:                  parsers/base64.md

# How to Build a Point
Let us recall the list of FAST DSL parsers and filters available for use in the point.
* [HTTP parser][link-http]:
    * [URI filter][link-uri];
    * [Path filter][link-path];
    * [Action_name filter][link-actionname];
    * [Action_ext filter][link-actionext];
    * [Get filter][link-get];
    * [Header filter][link-header];
    * [Post filter][link-post];
* [Form_urlencoded parser][link-formurlencoded];
* [Multipart parser][link-multipart];
* [Cookie parser][link-cookie];
* [XML parser][link-xml]:
    * [Xml_comment filter][link-xmlcomment];
    * [Xml_dtd filter][link-xmldtd];
    * [Xml_dtd_entity filter][link-xmldtdentity];
    * [Xml_pi filter][link-xmlpi];
    * [Xml_tag filter][link-xmltag];
    * [Xml_tag_array filter][link-xmltagarray];
    * [Xml_attr filter][link-xmlattr];
* [Json_doc parser][link-jsondoc]:
    * [Json_obj filter][link-jsonobj];
    * [Json_array filter][link-jsonarray];
* [GZIP parser][link-gzip];
* [Base64 parser][link-base64];
* [Array filter][link-array];
* [Hash filter][link-hash].

It is recommended that points be assembled from right to left for an easier understanding of which parsers and filters should be included in the point. Move from smaller to larger parts of the request when building a point.

!!! info "Point parts divider"
    The parts of the point must be divided using the `_` symbol.

## Example 1 

Let us suppose that you need to build a point that refers to the decoded value of the `uid` parameter in the following request:

```
GET http://example.com/main/login/?uid=MDEyMzQ=
```

where `MDEyMzQ=` is the Base64-encoded `01234` string.

1.   Because the point must refer to the *value* of the request element, we need to include the `value` service word in the point.

    The current state of the point: `value`.

2.   The point must refer to the decoded value, but the desired value is encoded with the *Base64* encoding in the request. The `BASE64` parser name has to be added to the left side of the point to decode the value.
       
    The current state of the point: `BASE64_value`.

3.   The point must refer to the *`uid`* parameter value. Add the `uid` parameter name to the left side of the point to refer to the desired parameter value. 
    
    The current state of the point: `uid_BASE64_value`.

4.   The point must refer to the value of the parameter that is passed in the baseline request *query string*. Add the `GET` filter name to the left side of the point to refer to the query string parameter value. 
    
    The current state of the point: `GET_uid_BASE64_value`.



To meet the conditions of the example, the point obtained in the fourth step can be added to the extension in one of the following ways:
* not surrounded by any of the service symbols.
* surrounded by apostrophes (`'GET_uid_BASE64_value'`).
* surrounded by quotation marks (`"GET_uid_BASE64_value"`).



## Example 2

Let us suppose that you need to build a point that refers to the `01234` value of the `passwd` parameter in the 

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

request with the

```
username=admin&passwd=01234.
```

body.

1.   Because the point must refer to the *value* of the request element, we need to include the `value` service word in the point.
    
    The current state of the point: `value`.

2.   The point must refer to the *`passwd`* parameter value. Add the `passwd` parameter name to the left side of the point to refer to the desired parameter value. 
    
    The current state of the point: `passwd_value`.

3.   The point must refer to the value of the parameter that is passed in the *form-urlencoded format*. This can be derived from the value of the Content-Type header in the baseline request. Add the name of the Form_urlencoded parser in upper case to the left side of the point in order to refer to the value of the parameter passed in the form-urlencoded value. 
    
    The current state of the point: `FORM_URLENCODED_passwd_value`.

4.   The point must refer to the value of the parameter that is passed in the *request body*. Add the name of the `POST` parser to the left side of the point to refer to the value of the request body parameter.
    
    The current state of the point: `POST_FORM_URLENCODED_passwd_value`.



To meet the conditions of the example, the point obtained in the fourth step can be added to the extension in one of the following ways:
* not surrounded by any of the service symbols.
* surrounded by apostrophes (`'POST_FORM_URLENCODED_passwd_value'`).
* surrounded by quotation marks (`"POST_FORM_URLENCODED_passwd_value"`).



## Example 3

Let us suppose that you need to build a point that refers to the `abcde` value of the `secret-word` cookie in the following request:

```
GET /main/index.php HTTP/1.1
Host: example.com
Cookie: username=John. secret-word=abcde.
```

1.   Because the point must refer to the *value* of the request element, we need to include the `value` service word into the point.

    The current state of the point: `value`.

2.   The point must refer to the *`secret-word`* cookie value. Add the `secret-word` name of the cookie to the left side of the point to refer to the desired cookie value.
    
    The current state of the point: `secret-word_value`.

3.   The point must refer to the value of the *cookie*. Add the name of the `COOKIE` parser to the left side of the point to refer to the cookie value.
    
    The current state of the point: `COOKIE_secret-word_value`.

4.   The point must refer to the value that is passed in the *Cookie header*. Add the name of the `Cookie` header to the left side of the point to refer to the header named Cookie. 
    
    The current state of the point: `Cookie_COOKIE_secret-word_value`.

5.   The point must refer to the value that is passed in the *header*. Add the name of the `HEADER` filter to the left side of the point to refer to the header value.
    
    The current state of the point: `HEADER_Cookie_COOKIE_secret-word_value`.



To meet the conditions of the example, the point obtained in the fourth step can be added to the extension in one of the following ways:
* not surrounded by any of the service symbols.
* surrounded by apostrophes (`'HEADER_Cookie_COOKIE_secret-word_value'`).
* surrounded by quotation marks (`"HEADER_Cookie_COOKIE_secret-word_value"`).

