[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #the-example-of-using-the-get-filter-and-the-hash-filter
[anchor2]:      #the-example-of-using-the-form_urlencoded-parser-with-the-hash-filter
[anchor3]:      #the-example-of-using-the-multipart-filter-and-the-hash-filter
[anchor4]:      #the-example-of-using-the-json_doc-parser-and-the-hash-filter
[anchor5]:      #the-example-of-using-the-json_obj-filter-and-the-hash-filter
[anchor6]:      #the-example-of-using-the-json_array-filter-and-the-hash-filter


# Hash Filter

The **Hash** filter refers to the hash table of the values in any of the baseline request elements that may contain hash tables.

The Hash filter can be used in the point together with the following filters and parsers:
* [Get][anchor1];
* [Form_urlencoded][anchor2];
* [Multipart][anchor3];
* [Json_doc][anchor4];
* [Json_obj][anchor5];
* [Json_array][anchor6].

Use the keys to refer to the elements of the hash table addressed by the Hash filter.

!!! info "Regular expressions in points"
    The key in the point can be a [regular expression of the Ruby programming language][link-ruby].  

## The Example of Using the Get Filter and the Hash Filter

For the 

```
POST http://example.com/login?id[user]=01234&id[group]=56789 
```

request, the Hash filter applied to the `id` query string parameter refers to the following hash table:

| Key   | Value    |
|-------|----------|
| user  | 01234    |
| group | 56789    |

* The `GET_id_HASH_user_value` point refers to the `01234` value that corresponds with the `user` key from the `id` query string parameter values hash table addressed by the Hash filter.
* The `GET_id_HASH_group_value` point refers to the `56789` value that corresponds with the `group` key from the `id` query string parameter values hash table addressed by the Hash filter.


## The Example of Using the Form_urlencoded parser with the Hash Filter

For the

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

request with the

```
id[user]=01234&id[group]=56789
```

body, the Hash filter applied to the `id` parameter from the request body in the form-urlencoded format refers to the following array:

| Key   | Value    |
|-------|----------|
| user  | 01234    |
| group | 56789    |

* The `POST_FORM_URLENCODED_id_HASH_user_value` point refers to the `01234` value that corresponds with the `user` key from the request body parameters hash table addressed by the Hash filter.
* The `POST_FORM_URLENCODED_id_HASH_group_value` point refers to the `56789` value that corresponds with the `group` key from the request body parameters hash table addressed by the Hash filter. 

## The Example of Using the Multipart Filter and the Hash Filter

For the

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: multipart/form-data;boundary="boundary" 

--boundary 
Content-Disposition: form-data; name="id[user]" 

01234 
--boundary 
Content-Disposition: form-data; name="id[group]"

56789
```

request, the Hash filter applied to the `id` parameter from the request body together with the Multipart parser refers to the following hash table:

| Key   | Value    |
|-------|----------|
| user  | 01234    |
| group | 56789    |

* The `POST_MULTIPART_id_HASH_user_value` point refers to the `01234` value that corresponds with the `user` key from the request body parameters hash table addressed by the Hash filter.
* The `POST_MULTIPART_id_HASH_group_value` point refers to the `56789` value that corresponds with the `group` key from the request body parameters hash table addressed by the Hash filter.

## The Example of Using the Json_doc Parser and the Hash Filter

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

body, the Hash filter applied to the request body in the JSON format together with the Json_doc parser refers to the following hash table:

| Key      | Value    |
|----------|----------|
| username | user     |
| rights   | read     |

* The `POST_JSON_DOC_HASH_username_value` point refers to the `user` value that corresponds with the `username` key from the request body parameters hash table addressed by the Hash filter.
* The `POST_JSON_DOC_HASH_rights_value` point refers to the `read` value that corresponds with the `rights` key from the request body parameters hash table addressed by the Hash filter.

## The Example of Using the Json_obj Filter and the Hash Filter

For the

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

request with the

```
{
    "username": "user",
    "info": {
        "status": "active",
        "rights": "read"
    }
}
```

body, the Hash filter applied to the request body in the JSON format together with the Json_doc parser and the Json_obj filter refers to the following hash table:

| Key    | Value    |
|--------|----------|
| status | active   |
| rights | read     |

* The `POST_JSON_DOC_JSON_OBJ_info_HASH_status_value` point refers to the `active` value that corresponds with the `status` key from the info JSON object child objects hash table addressed by the Hash filter.
* The `POST_JSON_DOC_JSON_OBJ_info_HASH_rights_value` point refers to the `read` value that corresponds with the `rights` key from the info JSON object child objects hash table addressed by the Hash filter.

## The Example of Using the Json_array Filter and the Hash Filter

For the

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

request with the

```
{
    "username": "user",
    "posts": [{
            "title": "Greeting",
            "length": "256"
        },
        {
            "title": "Hello World!",
            "length": "32"
        }
    ]
}
```

body, the Hash filter applied to the first element of the `posts` JSON objects array from the request body together with the Json_doc parser and the Json_obj and Json_array filters refers to the following hash table:

| Key    | Value    |
|--------|----------|
| title  | Greeting |
| length | 256      |

* The `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_title_value` point refers to the `Greeting` value that corresponds with the `title` key from the JSON objects hash table addressed by the Hash filter.
* The `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_length_value` point refers to the `256` value that corresponds with the `length` key from the JSON objects hash table addressed by the Hash filter.
