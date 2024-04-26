[link-ruby]:                http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-xmltag-array]:        array.md#the-example-of-using-the-xml_tag-filter-and-the-array-filter
[link-array]:               array.md

[anchor1]:      #xml_comment-filter
[anchor2]:      #xml_dtd-filter
[anchor3]:      #xml_dtd_entity-filter
[anchor4]:      #xml_pi-filter
[anchor5]:      #xml_tag-filter
[anchor6]:      #xml_tag_array-filter
[anchor7]:      #xml_attr-filter

# XML Parser

The **XML** parser is used for working with data in XML format that can be located in any part of the request. Its name must be specified in a point upon using filters provided by it.

You can use the XML parser name in the point without any filters that are provided by it to work with the top-level XML data container contents in their raw format.

**Example:** 

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
<!-- test -->
<text>
    Sample text.
</text>
```

body, the `POST_XML_value` point refers to the following data in raw format:

```
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<text>
    Sample text.
</text>
```

The XML parser builds a complex data structure on the basis of the input data. You can use the following filters to address the elements of this data structure:
* [Xml_comment filter][anchor1];
* [Xml_dtd filter][anchor2];
* [Xml_dtd_entity filter][anchor3];
* [Xml_pi filter][anchor4];
* [Xml_tag filter][anchor5];
* [Xml_tag_array filter][anchor6];
* [Xml_attr filter][anchor7].

Add the names of the XML parser and the filter provided by it in upper case to the point to use the filter in the point.


## Xml_comment Filter
 
The **Xml_comment** filter refers to the array containing comments from data in XML format. The elements of this array need to be referred to by using their indexes. The array indexing starts with `0`.

!!! info "Regular expressions in points"
    The index in the point can be a regular expression of the [Ruby programming language][link-ruby].  

The Xml_comment filter can only be used in the point together with the XML parser.

**Example:** 

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
<!-- second -->
```

body, the Xml_comment applied together with the XML parser refers to the following array:

| Index  | Value    |
|--------|----------|
| 0      | first    |
| 1      | second   |

* The `POST_XML_XML_COMMENT_0_value` point refers to the `first` value that corresponds to the `0` index from the array addressed by the Xml_comment filter.
* The `POST_XML_XML_COMMENT_1_value` point refers to the `second` value that corresponds to the `1` index from the array addressed by the Xml_comment filter.

## Xml_dtd Filter

The **Xml_dtd** filter refers to the external DTD schema used in the XML data. This filter can only be used in the point together with the XML parser.

The Xml_dtd filter refers to a string value. This filter cannot refer to complex data structures (such as arrays or hash tables).


**Example:** 

For the

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

request with the

```
<?xml version="1.0" standalone="no"?>
<!DOCTYPE foo SYSTEM "example.dtd">
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
    Sample text.
</text>
```

body, the `POST_XML_DTD_value` point refers to the `example.dtd` value.

## Xml_dtd_entity Filter

The **Xml_dtd_entity** filter refers to the array containing the DTD schema directives defined in the XML data. The elements of this array need to be referred to by using their indexes. The array indexing starts with `0`. 

!!! info "Regular expressions in points"
    The index in the point can be a regular expression of the [Ruby programming language][link-ruby].  

The Xml_dtd_entity filter can only be used in the point together with the XML parser.

**Example:** 

For the

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

request with the 

```
<?xml version="1.0"?>
<!DOCTYPE foo [
<!ENTITY xxe "aaaa">
<!ENTITY sample "This is sample text.">
]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
    &xxe;
</text>
<text>
    &sample;
</text>
```

body, the Xml_dtd_entity filter applied to the request body together with the XML parser refers to the following array:

| Index  | Name   | Value                |
|--------|--------|----------------------|
| 0      | xxe    | aaaa                 |
| 1      | sample | This is sample text. |

In this array, each index refers to the name-value pair that corresponds with the name and the value of the DTD schema.
* Add the `_name` postfix at the end of the point that uses the Xml_dtd_entity filter to refer to the name of the schema directive.
* Add the `_value` postfix at the end of the point that uses the Xml_dtd_entity filter to refer to the value of the schema directive.



* The `POST_XML_XML_DTD_ENTITY_0_name` point refers to the `xxe` directive name that corresponds to the `0` index from the array addressed by the Xml_dtd_entity filter.
* The `POST_XML_XML_DTD_ENTITY_1_value` point refers to the `This is sample text.` directive value that corresponds to the `1` index from the array addressed by the Xml_dtd_entity filter.

## Xml_pi Filter

The **Xml_pi** filter refers to the array of the processing instructions defined for the XML data. The elements of this array need to be referred to by using their indexes. The array indexing starts with `0`. 

!!! info "Regular expressions in points"
    The index in the point can be a regular expression of the [Ruby programming language][link-ruby].  

The Xml_pi filter can only be used in the point together with the XML parser.

**Example:** 

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
<?last-edit user="John" date="2019-05-11"?>
<!-- first -->
<text>
    Sample text.
</text>
```

body, the Xml_pi filter applied to the request body together with the XML parser refers to the following array:

| Index  | Name           | Value                            |
|--------|----------------|----------------------------------|
| 0      | xml-stylesheet | type="text/xsl" href="style.xsl" |
| 1      | last-edit      | user="John" date="2019-05-11"    |

In this array, each index refers to the name-value pair that corresponds with the name and the value of the data processing instruction.
* Add the `_name` postfix at the end of the point that uses the Xml_pi filter to refer to the name of the processing instruction.
* Add the `_value` postfix at the end of the point that uses the Xml_pi filter to refer to the value of the processing instruction.



* The `POST_XML_XML_PI_0_name` point refers to the `xml-stylesheet` instruction name that corresponds to the `0` index from the array addressed by the Xml_pi filter.
* The `POST_XML_XML_PI_1_value` point refers to the `user="John" date="2019-05-11"` instruction value that corresponds to the `1` index from the array addressed by the Xml_pi filter.

## Xml_tag Filter

The **Xml_tag** filter refers to the hash table of the XML tags from the XML data. The elements of this hash table need to be referred to by using the names of the tags. This filter can only be used in the point together with the XML parser. 

!!! info "Regular expressions in points"
    The tag name in the point can be a regular expression of the [Ruby programming language][link-ruby].  

The tags from the XML data may also contain arrays of values. Use the [Array][link-xmltag-array] or the [Xml_tag_array][anchor6] filter to refer to the values from these arrays.

**Example:** 

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
<sample>
    &eee;
</sample>
```

body, the Xml_tag filter applied to the request body together with the XML parser refers to the following hash table:

| Key    | Value        |
|--------|--------------|
| text   | Sample text. |
| sample | aaaa         |

* The `POST_XML_XML_TAG_text_value` point refers to the `Sample text.` value that corresponds to the `text` key from the hash table addressed by the Xml_tag filter.
* The `POST_XML_XML_TAG_sample_value` point refers to the `aaaa` value that corresponds to the `sample` key from the hash table addressed by the Xml_tag filter.

## Xml_tag_array Filter

The **Xml_tag_array** filter refers to the array of the tag values from the XML data. The elements of this array need to be referred to by using their indexes. The array indexing starts with `0`. This filter can only be used in the point together with the XML parser. 

!!! info "Regular expressions in points"
    The index in the point can be a regular expression of the [Ruby programming language][link-ruby].  

The [Array][link-array] filter applied to the XML data works similarly to the Xml_tag_array.

!!! info "The ways of addressing tag content"
    The XML parser does not differentiate between the tag value and the first element in the tag values array.

For example, the `POST_XML_XML_TAG_myTag_value` and the `POST_XML_XML_TAG_myTag_ARRAY_0_value` points refer to the same value.

**Example:** 

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

body, the Xml_tag_array applied to the `text` tag in the request body refers to the following array:

| Index  | Value        |
|--------|--------------|
| 0      | Sample text. |
| 1      | aaaa         |

* The `POST_XML_XML_TAG_text_XML_TAG_ARRAY_0_value` point refers to the `Sample text.` value that corresponds to the `0` index from the text tag values array addressed by the Xml_tag_array filter.
* The `POST_XML_XML_TAG_text_XML_TAG_ARRAY_1_value` point refers to the `aaaa` value that corresponds to the `1` index from the text tag values array addressed by the Xml_tag_array filter.

## Xml_attr Filter

The **Xml_attr** filter refers to the hash table of the tag attributes from the XML data. The elements of this hash table need to be referred to by using the names of the attributes.

!!! info "Regular expressions in points"
    The attribute name in the point can be a regular expression of the [Ruby programming language][link-ruby].  

This filter can only be used in the point together with the Xml_tag filter.

**Example:** 

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
<text category="informational" font="12">
    Sample text.
</text>
```

body, the Xml_attr filter applied to the `text` tag from the request body together with the XML parser and the Xml_tag filter refers to the following hash table:

| Key      | Value         |
|----------|---------------|
| category | informational |
| font     | 12            |

* The `POST_XML_XML_TAG_text_XML_ATTR_category_value` point refers to the `informational` value that corresponds with the `category` key from the `text` tag attributes hash table addressed by the Xml_attr filter.
* The `POST_XML_XML_TAG_text_XML_ATTR_font_value` point refers to the `12` value that corresponds with the `font` key from the `text` tag attributes hash table addressed by the Xml_attr filter.
