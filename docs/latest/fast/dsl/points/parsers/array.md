[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #the-example-of-using-the-get-filter-with-the-array-filter
[anchor2]:      #the-example-of-using-the-header-filter-with-the-array-filter
[anchor3]:      #the-example-of-using-the-form_urlencoded-parser-and-the-array-filter
[anchor4]:      #the-example-of-using-the-multipart-parser-and-the-array-filter
[anchor5]:      #the-example-of-using-the-xml_tag-filter-and-the-array-filter
[anchor6]:      #the-example-of-using-the-json_obj-filter-and-the-array-filter


# Array Filter

The **Array** filter refers to the values array in any of the baseline request elements that may contain arrays.

The Array filter can be used in the point together with the following filters and parsers:
* [Get][anchor1];
* [Header][anchor2];
* [Form_urlencoded][anchor3];
* [Multipart][anchor4];
* [Xml_tag][anchor5];
* [Json_obj][anchor6].

The elements of this array need to be referred to by using the indexes. The array indexing starts with `0`.

!!! info "Regular expressions in points"
    The index in the point can be a [regular expression of the Ruby programming language][link-ruby].  

## The Example of Using the Get Filter with the Array Filter

For the

```
GET http://example.com/login?id[]="01234"&id[]="56789" HTTP/1.1
```

request, the Array filter applied to the `id` query string parameter refers to the following array:

| Index  | Value    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* The `GET_id_ARRAY_0_value` refers to the `01234` value that corresponds with the `0` index from the `id` query string parameter values array addressed by the Array filter.
* The `GET_id_ARRAY_1_value` refers to the `56789` value that corresponds with the `1` index from the `id` query string parameter values array addressed by the Array filter.

## The Example of Using the Header Filter with the Array Filter

For the

```
GET http://example.com/login/index.php HTTP/1.1
X-Identifier: 01234
X-Identifier: 56789
```

request, the Array filter applied to the `X-Identifier` header refers to the following array:

| Index  | Value    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* The `HEADER_X-Identifier_ARRAY_0_value` refers to the `01234` value that corresponds with the `0` index from the `X-Identifier` header values array addressed by the Array filter.
* The `HEADER_X-Identifier_ARRAY_1_value` refers to the `56789` value that corresponds with the `1` index from the `X-Identifier` header values array addressed by the Array filter.

## The Example of Using the Form_urlencoded Parser and the Array Filter

For the

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

request with the

```
id[]=01234&id[]=56789
```

body, the Array filter applied to the `id` parameter from the request body in the form-urlencoded format refers to the following array:

| Index  | Value    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* The `POST_FORM_URLENCODED_id_ARRAY_0_value` refers to the `01234` value that corresponds with the `0` index from the `id` parameter values array addressed by the Array filter.
* The `POST_FORM_URLENCODED_id_ARRAY_1_value` refers to the `56789` value that corresponds with the `1` index from the `id` parameter values array addressed by the Array filter.

## The Example of Using the Multipart Parser and the Array Filter

For the

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: multipart/form-data;boundary="boundary" 

--boundary 
Content-Disposition: form-data; name="id[]" 

01234 
--boundary 
Content-Disposition: form-data; name="id[]"

56789
```

request, the Array filter applied to the `id` parameter from the request body in the multipart format refers to the following array:

| Index  | Value    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* The `POST_MULTIPART_id_ARRAY_0_value` refers to the `01234` value that corresponds with the `0` index from the `id` parameter values array addressed by the Array filter.
* The `POST_MULTIPART_id_ARRAY_1_value` refers to the `56789` value that corresponds with the `1` index from the `id` parameter values array addressed by the Array filter.

## The Example of Using the Xml_tag Filter and the Array Filter

For the

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

request with the

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
Sample text.
</text>
<text>
    &eee;
</text>
```

body, the Array filter applied to the `text` tag from the request body in the XML format refers to the following array:

| Index  | Value        |
|--------|--------------|
| 0      | Sample text. |
| 1      | aaaa         |

* The `POST_XML_XML_TAG_text_ARRAY_0_value` point refers to the `Sample text.` value that corresponds with the `0` index from the `text` tag values array addressed by the Array filter.
* The `POST_XML_XML_TAG_text_ARRAY_1_value` point refers to the `aaaa` value that corresponds with the `1` index from the `text` tag values array addressed by the Array filter.

## The Example of Using the Json_obj Filter and the Array Filter

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

body, the Array filter applied to the `rights` JSON object from the request body together with the Json_doc parser and the Json_obj filter refers to the following array:

| Index  | Value    |
|--------|----------|
| 0      | read     |
| 1      | write    |

* The `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_0_value` point refers to the `read` value that corresponds with the `0` index from the `rights` JSON object values array addressed by the Array
filter.
* The `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_1_value` point refers to the `write` value that corresponds with the `1` index from the `rights` JSON object values array addressed by the Array filter.
