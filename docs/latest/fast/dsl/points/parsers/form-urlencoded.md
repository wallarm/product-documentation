[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-formurlencoded-array]:        array.md#the-example-of-using-the-form_urlencoded-parser-and-the-array-filter
[link-formurlencoded-hash]:         hash.md#the-example-of-using-the-form_urlencoded-parser-with-the-hash-filter

# Form_urlencoded Parser

The **Form_urlencoded** parser is used for working with the request body in the form-urlencoded format. This parser creates a hash table where the names of the request body parameters are the keys and the values of the corresponding parameters are the hash table values. The elements of this hash table need to be referred to by using the names of the parameters.

!!! info "Regular expressions in points"
    The parameter name in the point can be a regular expression of the [Ruby programming language][link-ruby].

!!! warning "Using the Form_urlencoded parser in the point"
    The Form_urlencoded parser can only be used in the point together with the Post filter that refers to the baseline request body.

The request body in the form-urlencoded format may also contain the following complex data structures: arrays and hash tables. Use the [Array][link-formurlencoded-array] and [Hash][link-formurlencoded-hash] filters correspondingly to address the elements in these structures.

**Example:** 

For the

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

request with the

```
id=01234&username=John
```

body, the Form_urlencoded parser applied to the request body creates the following hash table:

| Key      | Value    |
|----------|----------|
| id       | 01234    |
| username | John     |

* The `POST_FORM_URLENCODED_id_value` point refers to the `01234` value that corresponds to the `id` key from the hash table created by the Form_urlencoded parser.
* The `POST_FORM_URLENCODED_username_value` point refers to the `John` value that corresponds to the `username` key from the hash table created by the Form_urlencoded parser.

