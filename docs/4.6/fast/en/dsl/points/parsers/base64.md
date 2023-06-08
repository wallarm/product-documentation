
# Base64 Parser

The **Base64** parser encodes and decodes the request element value in base64 encoding. This parser can be applied to any string.

**Example:** 

For the

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

request with the

```
username=admin&passwd=MDEyMzQ=
```

body, the `POST_FORM_URLENCODED_passwd_BASE64_value` point refers to the `01234` value decoded from the base64 that is passed in the `passwd` parameter of the request body in the form-urlencoded format.

