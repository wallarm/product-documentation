[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

# Cookie Parser

The **Cookie** parser creates a hash table based on the Cookie header contents in the baseline request. The elements of this hash table need to be referred to by using the names of the cookies.

> #### Info:: Regular expressions in points
> The cookie name in the point can be a regular expression of the [Ruby programming language][link-ruby].

 > #### Warning:: Using the Cookie parser in the point
> The Cookie parser can only be used in the point together with the Header filter that refers to the Cookie header of the baseline request.
 
**Example:** 

For the

```
GET /login/index.php HTTP/1.1
Host: example.com
Cookie: id=01234; username=admin
```

request, the HTTP parser and the Cookie parser create hash tables with the corresponding header data.

The Header filter refers to the following hash table:

| Header name   | Header value             |
|---------------|--------------------------|
| Host          | example.com              |
| Cookie        | id=01234; username=admin |

In this hash table, the header names are the keys and the values of the corresponding headers are the hash table values.

Use the `HEADER_Cookie_value` point to work with the Cookie as a string value. In the current example this point refers to the `id=01234; username=admin` string.

The Cookie parser creates the following hash table:

| Cookie name | Cookie value  |
|-------------|---------------|
| id          | 01234         |
| username    | admin         |

The Cookie parser creates a hash table on the basis of the Cookie header data that is taken from the hash table addressed by the Header filter. In this hash table, the cookie names are the keys and the corresponding cookies’ values are the hash table values.

*   The `HEADER_Cookie_COOKIE_id_value` point refers to the `01234` value that corresponds to the `id` key from the hash table created by the Cookie parser.
*   The `HEADER_Cookie_COOKIE_username_value` point refers to the `admin` value that corresponds to the `username` key from the hash table created by the Cookie parser.

