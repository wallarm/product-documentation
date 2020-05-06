# How Wallarm Analyzes Requests

We believe that for an effective request analysis, a Wallarm NG-WAF component should 
* work with the same data as the protected application and
* consider the context of data processing.

For instance, if an application provides a JSON API, the processed parameters will be also encoded in JSON format. To analyze requests to such an API, it is necessary to parse the JSON format to get the values that will be used by the application. There are also more complex cases where the data is encoded several times — for example, JSON to BASE64 to JSON.

Speaking of data processing contexts, it should be noted that the same parameter can be handled differently by different parts of the application. For instance, the parameter `name` can be passed in creation requests both as the product name and as a username. But the processing code for such requests could have been written by different developers according to different requirements. The term *endpoint* is commonly used in API descriptions, so we shall continue using it in this document.

In light of the above, we can assume that the analysis of requests includes the following stages:
* identifying the format and applying corresponding format parsers for each parameter;
* calculation of metrics that allow registering an attack for each parameter;
* identification of the application endpoint of the request; and
* comparison of the calculated metrics against the normal values for this endpoint.


## Parameter Parsing

Starting from the top level of the HTTP request, the filter node attempts to sequentially apply each of the suitable parsers to each parameter. The output from the parsers becomes an additional set of parameters that has to be analyzed in a similar way.

Parser output sometimes becomes a complex structure. All of those structures can be considered as a sequence of applied filters, each of which gives a single element, array, or associative array.

The list of applied parsers depends on the nature of the data and the results of the previous training of the system.

#### URL

Every HTTP request contains an URL.

To find attacks, the filter node processes the URL as follows: it analyzes both the original value and its individual components. When creating rules, it is preferable to use separate URL components because this allows the system to apply rules more efficiently.

The *URL* parser provides the following filters that apply to an HTTP request:

* **uri**: string with the original URL value;
* **path**: an array with URL parts separated by the `/` symbol (the last URL part is not included in the array). If there is only one part in the URL, the array will be empty;
* **action_name**: the last part of the URL after the `/` symbol and before the first period `.`. This part of the URL is always present in the request even if its value is an empty string;
* **action_ext**: the part of the URL after the last period `.`. It may be missing in the request;
* **get**: parameters after the `?` symbol. Read more about them below.

For example, in the request `/blogs/123/index.php?q=aaa`, there will be the following parameters:

* `[uri]`&nbsp;— `/blogs/123/index.php?q=aaa`
* `[path, 0]`&nbsp;— `blogs`
* `[path, 1]`&nbsp;— `123`
* `[action_name]`&nbsp;— `index`
* `[action_ext]`&nbsp;— `php`
* `[get, 'q']`&nbsp;— `aaa`


#### GET Parameters

If parameters are passed to the application using a *GET* encoding, their names and values are included directly in the request URL after the character `?`. Typically, values are passed in the key-value format, but a more complex structure can also be used.

For example, in the request `/?q=some+text&check=yes` the following parameters are passed:
* `[get, 'q']`&nbsp;— `some text`
* `[get, 'check']`&nbsp;— `yes`

An example of a complex structure of parameters in the `/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb` request:
* `[get, 'p1', hash, 'x']`&nbsp;— `1`
* `[get, 'p1', hash, 'y']`&nbsp;— `2`
* `[get, 'p2', array, 0]`&nbsp;— `aaa`
* `[get, 'p2', array, 1]`&nbsp;— `bbb`

In addition, some web servers support so-called «pollution» when the values of the parameters with the same name are combined. For example, if the web server supports pollution, then the parameters in `/?request?p3=1&p3=2` are arranged in the following form:
* `[get, 'p3', array, 0]`&nbsp;— `1`
* `[get, 'p3', array, 1]`&nbsp;— `2`
* `[get, 'p3', pollution]`&nbsp;— `1,2`


#### Headers

Headers are present in the HTTP request and some other formats (e.g., multipart).
The *header* filter is used to get request headers. It always converts header names to uppercase. Note that pollution is also supported for headers.

For example, in the following request:

```
GET / HTTP/1.1
Host: example.com
X-Test: aaa
X-Test: bbb
```

there will be the following parameters:
* `[header, 'HOST']`&nbsp;— `example.com`
* `[header, 'X-TEST', array, 0]`&nbsp;— `aaa`
* `[header, 'X-TEST', array, 1]`&nbsp;— `aaa`
* `[header, 'X-TEST', pollution]`&nbsp;— `aaa,bbb`


#### Request Body

If a body is present in an HTTP request, it is made available by the `[post]` filter.


#### Meta-Information

The following additional filters are supported for HTTP request information:
* **method**: an HTTP method of the request;
* **proto**: version of the HTTP Protocol;
* **scheme**: http/https;
* **instance**: ID of the application.


#### Base64

There is a *Base64* filter and a Base64 parser that can be applied to any string. 

For example, the options might look like this:
* `[get, 'token', base64]`
* `[post, multipart, 'data', base64]`


#### Cookies

The value of the *Cookie* header is processed in a special way by both the application and the filter node. The value is parsed using a cookie parser that provides a filter of the same name.

For example, in the following request:

```
GET / HTTP/1.1
Cookie: a=1; b=2
```

there will be the following parameters:
* `[header, 'COOKIE', cookie, 'a']` = `1`
* `[header, 'COOKIE', cookie, 'b']` = `2`


#### Form-Urlencoded

If the data in the request body is passed in the `application/x-www-form-urlencoded` format, then individual parameters will be available using the *form_urlencoded* filter. Names with complex structure and pollution are supported.

For example, in the following request:
```
...
p1=1&p2[a]=2&p2[b]=3&p3[]=4&p3[]=5&p4=6&p4=7
```

there will be the following parameters:
* `[post, form_urlencoded, 'p1']`&nbsp;— `1`
* `[post, form_urlencoded, 'p2', hash, 'a']`&nbsp;— `2`
* `[post, form_urlencoded, 'p2', hash, 'b']`&nbsp;— `3`
* `[post, form_urlencoded, 'p3', array, 0]`&nbsp;— `4`
* `[post, form_urlencoded, 'p3', array, 1]`&nbsp;— `5`
* `[post, form_urlencoded, 'p4', array, 0]`&nbsp;— `6`
* `[post, form_urlencoded, 'p4', array, 1]`&nbsp;— `7`
* `[post, form_urlencoded, 'p4', pollution]`&nbsp;— `6,7`


#### Gzip

The *Gzip* parser can be applied to any string and provides a filter of the same name.

For example, the options might look like this:
* `[get, 'token', base64, gzip]`
* `[post, multipart, 'data', gzip]`


#### JSON

JSON enables you to encode data with a complex structure and provides the following filters:
* **json_doc**: top-level container for JSON data.
* **json_array**:  array that can be referenced by the alias **array**;
* **json_obj**: an associative array that can be referenced by the alias **hash**.

For example, the following structure:
```
{"p1":"value","p2":["v1","v2"],"p3":{"somekey":"somevalue"}}
```

contains the following parameters:
* `[..., json_doc, hash, 'p1']`&nbsp;— `value`
* `[..., json_doc, hash, 'p2', array, 0]`&nbsp;— `v1`
* `[..., json_doc, hash, 'p2', array, 1]`&nbsp;— `v2`
* `[..., json_doc, hash, 'p3', hash, 'somekey']`&nbsp;— `somevalue`


#### Multipart

Data in the request body can be transmitted in *multipart* format. In a request similar to the example for *Form-Urlencoded*, the following parameters are
* `[post, multipart, 'p1']`&nbsp;— `1`
* `[post, multipart, 'p2', hash, 'a']`&nbsp;— `2`
* `[post, multipart, 'p2', hash, 'b']`&nbsp;— `3`
* `[post, multipart, 'p3', array, 0]`&nbsp;— `4`
* `[post, multipart, 'p3', array, 1]`&nbsp;— `5`
* `[post, multipart, 'p4', array, 0]`&nbsp;— `6`
* `[post, multipart, 'p4', array, 1]`&nbsp;— `7`
* `[post, multipart, 'p4', pollution]`&nbsp;— `6,7`

In addition, each parameter can have its own headings. If a file name is specified in the `Content-Disposition` header, the file is considered to be loaded in this parameter, and the parameter will look like this:
* `[post, multipart, 'someparam', file]`&nbsp;— file contents

#### Percent

The parser *Percent* is applied to the source string with the URL and generates a URL decoding of the symbols.

The parameter structure is as follows:
* `[url, percent]`


#### Viewstate

The *Viewstate* parser is designed to analyze the session state, the technology used by Microsoft ASP.NET.

This parser provides the following filters:
* **viewstate** is a top-level container for viewstate data.
* **viewstate_array** is an array.
* **viewstate_pair** is an array.
* **viewstate_triplet** is an array.
* **viewstate_dict** is an associative array.
* **viewstate_dict_key** is a string.
* **viewstate_dict_value** is a string.
* **viewstate_sparse_array** is an associative array.


#### XML

XML enables you to encode data with a complex structure and provides the following filters:
* **xml** is the top-level container for the XML data.
* **xml_comment** is an array with comments in the body of an XML document.
* **xml_dtd** is the address of the external DTD schema being used.
* **xml_dtd_entity** is an array defined in the Entity DTD document.
* **xml_pi** is an array of instructions to process.
* **xml_tag** is an associative array of tags.
* **xml_tag_array** is an array of tag values; you can use the alias **array**.
* **xml_attr** is an associative array of attributes. Can only be used after the tag filter.


The XML parser does not differentiate between the contents of the tag and the first element in the array of values for the tag. That is, the parameters `[..., xml, xml_tag, 't1']` and `[..., xml, xml_tag, 't1', array, 0]` are identical and interchangeable.

For example, the following XML data:

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<methodCall>
  <methodName>&xxe;</methodName>
  <methodArgs check="true">123</methodArgs>
  <methodArgs>234</methodArgs>
</methodCall>
```

contains the following parameters:
* `[..., xml, xml_dtd_entity, 0]`&nbsp;— name = `xxe`, value = `aaaa`
* `[..., xml, xml_pi, 0]`&nbsp;— name = `xml-stylesheet`, value = `type="text/xsl" href="style.xsl"`
* `[..., xml, xml_comment, 0]`&nbsp;— ` test `
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodName']`&nbsp;— `aaaa`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs']`&nbsp;— `123`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', xml_attr, 'check']`&nbsp;— `true`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', array, 1]`&nbsp;— `234`


## Endpoints and Their Norms

To make a decision about blocking a request, the filter instance verifies that the metric calculated for each parameter does not exceed the pre-defined limits. Acceptable metric limits or metric norms are specified in the LOM file for each endpoint.

Endpoints are described using a set of HTTP request parameters and conditions. As a condition, you can use an exact match check, a match check against a regular expression, or the absence of a parameter in the request.

For example, in order to describe the endpoint to request `example.com/admin/index.php` we need to establish the following conditions:
* `[header, 'HOST']` `=` `example.com`
* `[path, 0]` `=` `admin`
* `[path, 1]` is missing
* `[action_name]` `=` `index`
* `[action_ext]` `=` `php`

To speed up endpoint identification, the LOM file uses an analogue of the decision tree. When describing partially overlapping endpoints, the size of the LOM file can dramatically increase due to combinatorial explosion.

Norms can be described for
* values of the parameters, for example, `[get 'id']`;
* values of all parameters, for example, `[get_all]`;
* default values, such as `[get_default]`;
* parameter names, such as `[get_name]`.

