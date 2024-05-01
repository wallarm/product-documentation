[link-ruby]:                    http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-hash]:                    hash.md
[link-array]:                   array.md
[link-jsonobj-array]:           array.md#the-example-of-using-the-json_obj-filter-and-the-array-filter
[link-jsonobj-hash]:            hash.md#the-example-of-using-the-json_obj-filter-and-the-hash-filter
[link-jsonarray-hash]:          hash.md#the-example-of-using-the-json_array-filter-and-the-hash-filter

[anchor1]:          #json_obj-filter
[anchor2]:          #json_array-filter


# Json_doc Parser

The **Json_doc** parser is used for working with data in the JSON format that can be located in any part of the request. The Json_doc parser refers to the top-level JSON data container contents in their raw format.

The Json_doc parser builds a complex data structure on the basis of the input data. You can use the following filters to address the elements of this data structure: 
* [Json_obj filter][anchor1];
* [Json_array filter][anchor2].

Add the names of the Json_doc parser and the filter provided by it in upper case to the point to use the filter in the point.

**Example:** 

For the

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

request with the

```
{
    "username": "admin",
    "info":{
        "firstName": "John",
        "lastName": "Smith"
    }
}
```

body, the Json_doc parser applied to the request body refers to the following data:

```
{
    "username": "admin",
    "info":{
        "firstName": "John",
        "lastName": "Smith"
    }
}
```


## Json_obj Filter

The **Json_obj** filter refers to the hash table of the JSON objects. The elements of this hash table need to be referred to by using the names of the JSON objects.

!!! info "Regular expressions in points"
    The name of the JSON object in the point can be a [regular expression of the Ruby programming language][link-ruby].  

The [Hash][link-hash] filter applied to the JSON data works similarly to the Json_obj.

The values from the hash tables in JSON format may also contain the following complex data structures: arrays and hash tables. Use the following filters to address the elements in these structures:
* The [Array][link-jsonobj-array] filter or the [Json_array][anchor2] filter for arrays
* The [Hash][link-jsonobj-hash] filter or the [Json_obj][anchor1] filter for hash tables

**Example:** 

For the

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

request with the

```
{
    "username": "user",
    "rights": "read"
}
```

body, the Json_obj filter applied to the request body together with the Json_doc parser refers to the following table:

| Key      | Value    |
|----------|----------|
| username | user     |
| rights   | read     |

* The `POST_JSON_DOC_JSON_OBJ_username_value` point refers to the `user` value.
* The `POST_JSON_DOC_JSON_OBJ_rights_value` point refers to the `read` value.

## Json_array Filter

The **Json_array** filter refers to the array of the JSON object values. The elements of this array need to be referred to by using the indexes. The array indexing starts with `0`.

!!! info "Regular expressions in points"
    The index in the point can be a [regular expression of the Ruby programming language][link-ruby]. 

The [Array][link-array] filter applied to the JSON data works similarly to the Json_array filter.

The values from the arrays in the JSON format may also contain hash tables. Use the [Hash][link-jsonarray-hash] or [Json_obj][anchor1].

**Example:** 

For the

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

request with the

```
{
    "username": "user",
    "rights":["read","write"]
}
```

body, the Json_array filter applied to the `rights` JSON object together with the Json_doc parser and the Json_obj filter refers to the following array:

| Index  | Value    |
|--------|----------|
| 0      | read     |
| 1      | write    |

* The `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_0_value` point refers to the `read` value that corresponds with the `0` index from the array of the `rights` JSON object values addressed by the Json_array filter.
* The `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_1_value` point refers to the `write` value that corresponds with the `1` index from the array of the `rights` JSON object values addressed by the Json_array filter.