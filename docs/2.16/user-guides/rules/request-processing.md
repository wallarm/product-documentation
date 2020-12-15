# Analyzing and parsing requests

## Principles of analyzing and parsing requests

For an effective request analysis, Wallarm WAF uses the principles:

* Work with the same data as the protected application. For example:
    If an application provides a JSON API, then the processed parameters will be also encoded in JSON format. To get parameter values, Wallarm WAF uses JSON parser. There are also more complex cases where the data is encoded several times — for example, JSON to Base64 to JSON. Such cases require decoding with several parsers.

* Consider the context of data processing. For example:

    The parameter `name` can be passed in creation requests both as the product name and as a username. However, the processing code for such requests can be different. To define the method of analyzing such parameters, Wallarm WAF may use the URL from which the requests were sent to or other parameters.

## Identifying and parsing the request parts

Starting from the top level of the HTTP request, the WAF node attempts to sequentially apply each of the suitable parsers to each part. The list of applied parsers depends on the nature of the data and the results of the previous training of the system.

The output from the parsers becomes an additional set of parameters that has to be analyzed in a similar way. Parser output sometimes becomes a complex structure like JSON, array, or associative array.

!!! info "Parser tags"
    Each parser has an identifier (tag). For example, `header` for the parser of request headers. The set of tags used in the request analysis is displayed in Wallarm Console within the event details. This data demonstrates the request part with the detected attack and parsers that were used.

    For example, if an attack was detected in the `SOAPACTION` header:

    ![!Tag example](../../images/user-guides/rules/tags-example.png)

### URL

Each HTTP request contains an URL. To find attacks, the WAF node analyzes both the original value and its individual components: **path**, **action_name**, **action_ext**, **get**.

The following tags correspond to the URL parser:

* **uri** for the original URL value without the domain (for example, `/blogs/123/index.php?q=aaa` for the request sent to `http://example.com/blogs/123/index.php?q=aaa`).
* **path** for an array with URL parts separated by the `/` symbol (the last URL part is not included in the array). If there is only one part in the URL, the array will be empty.
* **action_name** for the last part of the URL after the `/` symbol and before the first period (`.`). This part of the URL is always present in the request, even if its value is an empty string.
* **action_ext** for the part of the URL after the last period (`.`). It may be missing in the request.
* **get** for [GET parameters](#get-parameters) after the `?` symbol. 

Example:

`/blogs/123/index.php?q=aaa`

* `[uri]` — `/blogs/123/index.php?q=aaa`
* `[path, 0]` — `blogs`
* `[path, 1]` — `123`
* `[action_name]` — `index`
* `[action_ext]` — `php`
* `[get, 'q']` — `aaa`

### GET parameters

GET parameters are passed to the application in the request URL after the character `?` in the `key=value` format. The **get** tag corresponds to the parser.

Request example | GET parameters and values
---- | -----
`/?q=some+text&check=yes` | <ul><li>`[get, 'q']` — `some text`</li><li>`[get, 'check']` — `yes`</li></ul>
`/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb` | <ul><li>`[get, 'p1', hash, 'x']` — `1`</li><li>`[get, 'p1', hash, 'y']` — `2`</li><li>`[get, 'p2', array, 0]` — `aaa`</li><li>`[get, 'p2', array, 1]` — `bbb`</li></ul>
`/?p3=1&p3=2` | <ul><li>`[get, 'p3', array, 0]` — `1`</li><li>`[get, 'p3', array, 1]` — `2`</li><li>`[get, 'p3', pollution]` — `1,2`</li></ul>

### Headers

Headers are presented in the HTTP request and some other formats (e.g., **multipart**). The **header** tag corresponds to the parser. Header names are always converted to uppercase.

Example:

```
GET / HTTP/1.1
Host: example.com
X-Test: aaa
X-Test: bbb
```

* `[header, 'HOST']` — `example.com`
* `[header, 'X-TEST', array, 0]` — `aaa`
* `[header, 'X-TEST', array, 1]` — `aaa`
* `[header, 'X-TEST', pollution]` — `aaa,bbb`

### Metadata

The following tags correspond to the parser for HTTP request metadata:

* **post** for the HTTP request body
* **method** for the HTTP request method: `GET`, `POST`, `PUT`, `DELETE`
* **proto** for the HTTP protocol version
* **scheme**: http/https
* **instance** for the application ID

### Additional parsers

Complex request parts may require additional parsing (for example, if the data is Base64 encoded or presented in the array format). In such cases, the parsers listed below are applied to request parts additionally.

#### base64

Decodes Base64 encoded data, and can be applied to any part of the request.

#### gzip

Decodes GZIP encoded data, and can be applied to any part of the request.

#### htmljs

Converts HTML and JS symbols to the text format, and can be applied to any part of the request.

Example: `&#x22;&#97;&#97;&#97;&#x22;` will be converted to `"aaa"`.

#### json_doc

Parses the data in JSON format, and can be applied to any part of the request.

Filters:

* **json_array** or **array** for the value of the array element
* **json_obj** or **hash** for the value of the associative array key (`key:value`)

Example:

```
{"p1":"value","p2":["v1","v2"],"p3":{"somekey":"somevalue"}}
```

* `[..., json_doc, hash, 'p1']` — `value`
* `[..., json_doc, hash, 'p2', array, 0]` — `v1`
* `[..., json_doc, hash, 'p2', array, 1]` — `v2`
* `[..., json_doc, hash, 'p3', hash, 'somekey']` — `somevalue`

#### xml

Parses the data in XML format, and can be applied to any part of the request.

Filters:

* **xml_comment** for an array with comments in the body of an XML document
* **xml_dtd** for the address of the external DTD schema being used
* **xml_dtd_entity** for an array defined in the Entity DTD document
* **xml_pi** for an array of instructions to process
* **xml_tag** or **hash** for an associative array of tags
* **xml_tag_array** or **array** for an array of tag values
* **xml_attr** for an associative array of attributes; can only be used after the **xml_tag** filter

The XML parser does not differentiate between the contents of the tag and the first element in the array of values for the tag. That is, the parameters `[..., xml, xml_tag, 't1']` and `[..., xml, xml_tag, 't1', array, 0]` are identical and interchangeable.

Example:

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

* `[..., xml, xml_dtd_entity, 0]` — name = `xxe`, value = `aaaa`
* `[..., xml, xml_pi, 0]` — name = `xml-stylesheet`, value = `type="text/xsl" href="style.xsl"`
* `[..., xml, xml_comment, 0]` — ` test `
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodName']` — `aaaa`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs']` — `123`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', xml_attr, 'check']` — `true`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', array, 1]` — `234`

#### array

Parses data array. Can be applied to any part of the request.

Example:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[get, 'p2', array, 0]` — `aaa`
* `[get, 'p2', array, 1]` — `bbb`

#### hash

Parses the associative data array (`key:value`), and can be applied to any part of the request.

Example:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[get, 'p1', hash, 'x']` — `1`
* `[get, 'p1', hash, 'y']` — `2`

#### pollution

Combines the values of the parameters with the same name, and can be applied to any part of the request in the initial or decoded format.

Example:

```
/?p3=1&p3=2
```

* `[get, 'p3', pollution]` — `1,2`

#### percent

Decodes the URL symbols, and can be applied only to the **uri** component of URL.

#### cookie

Parses the Cookie request parameters, and can be applied only to the request headers.

Example:

```
GET / HTTP/1.1
Cookie: a=1; b=2
```

* `[header, 'COOKIE', cookie, 'a']` = `1`;
* `[header, 'COOKIE', cookie, 'b']` = `2`.

#### form_urlencoded

Parses the request body passed in the `application/x-www-form-urlencoded` format, and can be applied only to the request body.

Example:

```
p1=1&p2[a]=2&p2[b]=3&p3[]=4&p3[]=5&p4=6&p4=7
```

* `[post, form_urlencoded, 'p1']` — `1`
* `[post, form_urlencoded, 'p2', hash, 'a']` — `2`
* `[post, form_urlencoded, 'p2', hash, 'b']` — `3`
* `[post, form_urlencoded, 'p3', array, 0]` — `4`
* `[post, form_urlencoded, 'p3', array, 1]` — `5`
* `[post, form_urlencoded, 'p4', array, 0]` — `6`
* `[post, form_urlencoded, 'p4', array, 1]` — `7`
* `[post, form_urlencoded, 'p4', pollution]` — `6,7`

#### grpc

Parses gRPC API requests, and can be applied only to the request body.

Supports the **protobuf** filter for the Protocol Buffers data.

#### multipart

Parses the request body passed in the `multipart` format, and can be applied only to the request body.

Supports the **header** filter for the headers in the request body.

Example:

```
p1=1&p2[a]=2&p2[b]=3&p3[]=4&p3[]=5&p4=6&p4=7
```

* `[post, multipart, 'p1']` — `1`
* `[post, multipart, 'p2', hash, 'a']` — `2`
* `[post, multipart, 'p2', hash, 'b']` — `3`
* `[post, multipart, 'p3', array, 0]` — `4`
* `[post, multipart, 'p3', array, 1]` — `5`
* `[post, multipart, 'p4', array, 0]` — `6`
* `[post, multipart, 'p4', array, 1]` — `7`
* `[post, multipart, 'p4', pollution]` — `6,7`

If a file name is specified in the `Content‑Disposition` header, then the file is considered to be loaded in this parameter. The parameter will look like this:

* `[post, multipart, 'someparam', file]` — file contents

#### viewstate

Designed to analyze the session state. The technology is used by Microsoft ASP.NET, and can be applied only to the request body.

Filters:

* **viewstate_array** for an array
* **viewstate_pair** for an array
* **viewstate_triplet** for an array
* **viewstate_dict** for an associative array
* **viewstate_dict_key** for a string
* **viewstate_dict_value** for a string
* **viewstate_sparse_array** for an associative array

### Norms

The norms are applied to parsers for array and key data types. Norms are used to define the boundaries of data analysis. The value of the norm is indicated in the parser tag. For example: **hash_all**, **hash_default**, **hash_name**.

If the norm is not specified, then the identifier of the entity that requires processing is passed to the parser. For example: the name of the JSON object or other identifier is passed after **hash**.

#### all

Used to get values of all elements, parameters, or objects. For example:

* **get_all** for all GET parameter values
* **header_all** for all header values
* **array_all** for all array element values
* **hash_all** for all JSON object or XML attribute values

#### default

Used to get default values of elements, parameters, or objects. For example:

* **get_all** for default values of GET parameters
* **header_all** for default values of headers
* **array_all** for default values of array elements
* **hash_all** for default values of JSON objects or XML attributes

#### name

Used to get names of all elements, parameters, or objects. For example:

* **get_name** for all GET parameter names
* **header_name** for all header names
* **hash_name** for all JSON object or XML attribute names
