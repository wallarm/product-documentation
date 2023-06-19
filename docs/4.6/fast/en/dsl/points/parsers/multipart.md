[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-multipart-array]:             array.md#the-example-of-using-the-multipart-parser-and-the-array-filter
[link-multipart-hash]:              hash.md#the-example-of-using-the-multipart-filter-and-the-hash-filter

# Multipart Parser

The **Multipart** parser is used for working with the request body in the multipart format. This parser creates a hash table where the names of the request body parameters are the keys and the values of the corresponding parameters are the hash table values. The elements of this hash table need to be referred to by using the names of the parameters.


!!! info "Regular expressions in points"
    The parameter name in the point can be a regular expression of the [Ruby programming language][link-ruby].  

!!! warning "Using the Multipart parser in the point"
    The Multipart parser can only be used in the point together with the Post filter that refers to the baseline request body.


**Example:** 

For the

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: multipart/form-data;boundary="boundary" 

--boundary 
Content-Disposition: form-data; name="id" 

01234 
--boundary 
Content-Disposition: form-data; name="username"

admin 
```

request, the Multipart parser applied to the request body creates the following hash table:

| Key       | Value    |
|-----------|----------|
| id        | 01234    |
| username  | admin    |

*   The `POST_MULTIPART_id_value` point refers to the `01234` value that corresponds to the `id` key from the hash table created by the Multipart parser.
*   The `POST_MULTIPART_username_value` point refers to the `admin` value that corresponds to the `username` key from the hash table created by the Multipart parser.

The request body in the multipart format may also contain the following complex data structures: arrays and hash tables. Use the [Array][link-multipart-array] and [Hash][link-multipart-hash] filters correspondingly to address the elements in these structures.

