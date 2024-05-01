[link-ruby]:                http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-formurlencoded]:      form-urlencoded.md
[link-multipart]:           multipart.md
[link-xml]:                 xml.md
[link-json]:                json.md

[link-get-array]:           array.md#the-example-of-using-the-get-filter-with-the-array-filter
[link-get-hash]:            hash.md#the-example-of-using-the-get-filter-and-the-hash-filter
[link-header-array]:        array.md#the-example-of-using-the-header-filter-with-the-array-filter

[anchor1]:      #uri-filter
[anchor2]:      #path-filter
[anchor3]:      #action_name-filter
[anchor4]:      #action_ext-filter
[anchor5]:      #get-filter
[anchor6]:      #header-filter
[anchor7]:      #post-filter

# HTTP Parser

The implicit **HTTP parser** performs the annual request processing. Its name should not be specified in a point upon using filters provided by it.

The HTTP parser builds a complex data structure on the basis of the baseline request. You can use the following filters to address the elements of this data structure:

* [URI][anchor1];
* [Path][anchor2];
* [Action_name][anchor3];
* [Action_ext][anchor4];
* [Get][anchor5];
* [Header][anchor6];
* [Post][anchor7].

!!! info "Using filters in points"
    Add the name of the filter in upper case to the point to use the filter in the point.

## URI Filter

The **URI** filter refers to the absolute path to the request target. The absolute path starts with the `/` symbol that follows the domain or the IP address of the target.

The URI filter refers to a string value. This filter cannot refer to complex data structures (such as arrays or hash tables).

**Example:** 

The `URI_value` point refers to the `/login/index.php` string in the `GET http://example.com/login/index.php` request.


## Path Filter

The **Path** filter refers to an array containing URI path parts. The elements of this array need to be referred to by using their indexes. The array indexing starts with `0`.

!!! info "Regular expressions in points"
    The index in the point can be a regular expression of the [Ruby programming language][link-ruby].  

**Example:** 

For the `GET http://example.com/main/login/index.php HTTP/1.1` request, the Path filter refers to the following array:

| Index  | Value    |
|--------|----------|
| 0      | main     |
| 1      | login    |

* The `PATH_0_value` point refers to the `main` value that is located in the array addressed by the Path filter with the `0` index.
* The `PATH_1_value` point refers to the `login` value that is located in the array addressed by the Path filter with the `1` index.

If the request URI contains only one part, the Path filter addresses the empty array.

**Example:**

For the `GET http://example.com/ HTTP/1.1` request, the Path filter refers to an empty array.

## Action_name Filter

The **Action_name** filter refers to the part of the URI that starts after the last `/` symbol and ends with the period.

The Action_name filter refers to a string value. This filter cannot refer to complex data structures (such as arrays or hash tables).


**Example:** 
* The `ACTION_NAME_value` point refers to the `index` value for the `GET http://example.com/login/index.php` request.

* The `ACTION_NAME_value` point refers to the empty value for the `GET http://example.com/login/` request.


## Action_ext Filter

The **Action_ext** filter refers to the part of the URI that starts after the first period following the last `/` symbol. If this part of the URI is missing from the request, the Action_ext filter cannot be used in the point.

The Action_ext filter refers to a string value. This filter cannot refer to complex data structures (such as arrays or hash tables).

**Example:** 

* The `ACTION_EXT_value` point refers to the `php` value for the `GET http://example.com/main/login/index.php` request.
* The Action_ext filter cannot be used in the point that refers the `GET http://example.com/main/login/` request.

## Get Filter

The **Get** filter refers to the hash table that contains parameters from the request query string. The elements of this hash table need to be referred to by using the names of the parameters.

!!! info "Regular expressions in points"
    The name of the parameter in the point can be a regular expression of the [Ruby programming language][link-ruby].

Query string parameters may also contain the following complex data structures: arrays and hash tables. Use the [Array][link-get-array] and [Hash][link-get-hash] filters correspondingly to address the elements in these structures.

**Example:** 

For the `POST http://example.com/login?id=01234&username=admin` request, the Get filter refers to the following hash table:

| Parameter name | Value |
|----------------|-------|
| id             | 01234 |
| username       | admin |

* The `GET_id_value` point refers to the `01234` value that corresponds to the `id` parameter from the hash table addressed by the Get filter.
* The `GET_username_value` point refers to the `admin` value that corresponds to the `username` parameter from the hash table addressed by the Get filter.


## Header Filter

The **Header** filter refers to the hash table that contains header names and values. The elements of this hash table need to be referred to by using the names of the headers.

!!! info "A header name in a point"
    A header name can be specified in a point in one of the following ways:

    * In upper case
    * The same way it is specified in the request

!!! info "Regular expressions in points"
    The header name in the point can be a regular expression of the [Ruby programming language][link-ruby].


The name of the header can also contain an array of values. Use the [Array][link-header-array] filter to address the elements of this array.

**Example:** 

For the

```
GET /login/index.php HTTP/1.1
Connection: keep-alive
Host: example.com
Accept-encoding: gzip
```

request, the Header filter refers to the following hash table:

| Header name     | Value       |
|-----------------|-------------|
| Connection      | keep-alive  |
| Host            | example.com |
| Accept-Encoding | gzip        |

* The `HEADER_Connection_value` point refers to the `keep-alive` value that corresponds to the `Connection` header from the hash table addressed by the Header filter.
* The `HEADER_Host_value` point refers to the `example.com` value that corresponds to the `Host` header from the hash table addressed by the Header filter.
* The `HEADER_Accept-Encoding_value` point refers to the `gzip` value that corresponds to the `Accept-Encoding` header from the hash table addressed by the Header filter.



## Post Filter

The **Post** filter refers to the request body contents.

You can use the name of the Post filter in the point to work with the request body contents in raw format.

**Example:** 

For the

```
POST http://example.com/main/index.php HTTP/1.1
Content-Type: text/plain
Content-Length: 28
```

request with the

```
This is a simple body text.
```

body, the `POST_value` point refers to the `This is a simple body text.` value from the request body.

You can also work with a request body that contains complex data structures. Use the following filters and parsers in the point after the Post filter to address the elements of the corresponding data structures: 
* The [Form_urlencoded][link-formurlencoded] parser for the request body in the **form-urlencoded** format
* The [Multipart][link-multipart] parser for the request body in the **multipart** format
* The [filters that are provided by the XML parser][link-xml] for the request body in the **XML** format
* The [filters that are provided by the Json_doc parser][link-json] for the request body in the **JSON** format 
