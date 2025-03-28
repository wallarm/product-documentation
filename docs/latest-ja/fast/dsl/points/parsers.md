[link-http]:                    parsers/http.md
[link-uri]:                     parsers/http.md#uri-filter
[link-path]:                    parsers/http.md#path-filter
[link-actionname]:              parsers/http.md#action_name-filter
[link-actionext]:               parsers/http.md#action_ext-filter
[link-get]:                     parsers/http.md#get-filter
[link-header]:                  parsers/http.md#header-filter
[link-post]:                    parsers/http.md#post-filter
[link-formurlencoded]:          parsers/form-urlencoded.md
[link-multipart]:               parsers/multipart.md
[link-cookie]:                  parsers/cookie.md
[link-xml]:                     parsers/xml.md
[link-xmlcomment]:              parsers/xml.md#xml_comment-filter
[link-xmldtd]:                  parsers/xml.md#xml_dtd-filter
[link-xmldtdentity]:            parsers/xml.md#xml_dtd_entity-filter
[link-xmlpi]:                   parsers/xml.md#xml_pi-filter
[link-xmltag]:                  parsers/xml.md#xml_tag-filter
[link-xmltagarray]:             parsers/xml.md#xml_tag_array-filter
[link-xmlattr]:                 parsers/xml.md#xml_attr-filter
[link-jsondoc]:                 parsers/json.md
[link-jsonobj]:                 parsers/json.md#json_obj-filter
[link-jsonarray]:               parsers/json.md#json_array-filter
[link-array]:                   parsers/array.md
[link-hash]:                    parsers/hash.md
[link-gzip]:                    parsers/gzip.md
[link-base64]:                  parsers/base64.md

# パーサーとフィルター

このセクションでは、FAST DSLエクステンションポイントで使用できるパーサーとフィルターについて説明します。

以下は、パーサーとそれらが提供するフィルターの一覧です:
* [HTTPパーサー][link-http]:
    * [URIフィルター][link-uri];
    * [Pathフィルター][link-path];
    * [Action_nameフィルター][link-actionname];
    * [Action_extフィルター][link-actionext];
    * [Getフィルター][link-get];
    * [Headerフィルター][link-header];
    * [Postフィルター][link-post];
* [Form_urlencodedパーサー][link-formurlencoded];
* [Multipartパーサー][link-multipart];
* [Cookieパーサー][link-cookie];
* [XMLパーサー][link-xml]:
    * [Xml_commentフィルター][link-xmlcomment];
    * [Xml_dtdフィルター][link-xmldtd];
    * [Xml_dtd_entityフィルター][link-xmldtdentity];
    * [Xml_piフィルター][link-xmlpi];
    * [Xml_tagフィルター][link-xmltag];
    * [Xml_tag_arrayフィルター][link-xmltagarray];
    * [Xml_attrフィルター][link-xmlattr];
* [Json_docパーサー][link-jsondoc]:
    * [Json_objフィルター][link-jsonobj];
    * [Json_arrayフィルター][link-jsonarray];
* [GZIPパーサー][link-gzip];
* [Base64パーサー][link-base64];
* [Arrayフィルター][link-array];
* [Hashフィルター][link-hash].