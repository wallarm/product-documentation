# İstek Kimlik Doğrulama Anahtarlarını Doğrulama

OAuth 2.0 kimlik doğrulamayı kullandığında, API Güvenlik Duvarı, talepleri uygulama sunucunuza yönlendirmeden önce erişim anahtarlarını doğrulamak üzere ayarlanabilir. Güvenlik Duvarı, erişim anahtarını `Authorization: Bearer` talep başlığında bekliyor.

API Güvenlik Duvarı, tokenin geçerli olduğunu, token meta bilgilerinde ve [özelliklerinde](https://swagger.io/docs/specification/authentication/oauth2/) tanımlanan kapsamların aynı olması durumunda düşünür. `APIFW_REQUEST_VALIDATION` değeri `BLOCK` ise, API Güvenlik Duvarı geçersiz anahtarlarla talepleri engeller. `LOG_ONLY` modunda, geçersiz anahtarlarla yapılan talepler sadece kaydedilir.

!!! info "Özellik kullanılabilirliği"
    Bu özellik, yalnızca API Güvenlik Duvarı'nı [REST API](../installation-guides/docker-container.md) istek filtrelemesi için çalıştırdığınızda kullanılabilir.

OAuth 2.0 anahtar doğrulama akışını yapılandırmak için aşağıdaki çevre değişkenlerini kullanın:

| Çevre değişkeni | Açıklama |
| -------------------- | ----------- |
| `APIFW_SERVER_OAUTH_VALIDATION_TYPE` | Kimlik doğrulama anahtarının doğrulama türü:<ul><li>`JWT` istek kimlik doğrulamayı kullanıyorsa. Daha fazla yapılandırmayı `APIFW_SERVER_OAUTH_JWT_*` değişkenleri üzerinden yapın.</li><li>`INTROSPECTION` diğer token türlerini kullanıyorsa ve bu türler belirli bir token denetleme hizmeti tarafından doğrulanabilir. Daha fazla yapılandırmayı `APIFW_SERVER_OAUTH_INTROSPECTION_*` değişkenleri üzerinden yapın.</li></ul> |
| `APIFW_SERVER_OAUTH_JWT_SIGNATURE_ALGORITHM` | JWT'leri imzalamak için kullanılan algoritma: `RS256`, `RS384`, `RS512`, `HS256`, `HS384` veya `HS512`.<br><br>`ECDSA` algoritması kullanılarak imzalanan JWT'ler API Güvenlik Duvarı tarafından doğrulanamaz. |
| `APIFW_SERVER_OAUTH_JWT_PUB_CERT_FILE` | JWT'ler RS256, RS384 veya RS512 algoritması kullanılarak imzalandıysa, RSA genel anahtar dosyasının (`*.pem`) yolunu belirtin. Bu dosya API Güvenlik Duvarı Docker konteynerine monte edilmelidir. |
| `APIFW_SERVER_OAUTH_JWT_SECRET_KEY` | JWT'ler HS256, HS384 veya HS512 algoritması kullanılarak imzalandıysa, JWT'leri imzalamak için kullanılan gizli anahtar değerini belirtin. |
| `APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT` | [Token denetleme uç noktası](https://www.oauth.com/oauth2-servers/token-introspection-endpoint/). Uç noktası örnekleri:<ul><li>`https://www.googleapis.com/oauth2/v1/tokeninfo` eğer Google OAuth kullanılıyorsa</li><li>`http://sample.com/restv1/introspection` Gluu OAuth 2.0 anahtarları için</li></ul> |
| `APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT_METHOD` | Token denetleme uç noktasına taleplerin metodu. `GET` veya `POST` olabilir.<br><br>Varsayılan değer `GET´dir. |
| `APIFW_SERVER_OAUTH_INTROSPECTION_TOKEN_PARAM_NAME` | Denetleme uç noktasına taleplerdeki token değerinin parametre adı. API Güvenlik Duvarı, `APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT_METHOD` değerine bağlı olarak parametrenin otomatik olarak sorgu veya gövde parametresi olduğunu kabul eder. |
| `APIFW_SERVER_OAUTH_INTROSPECTION_CLIENT_AUTH_BEARER_TOKEN` | Denetleme uç noktasına talepleri doğrulamak için Bearer token değeri. |
| <a name="apifw-server-oauth-introspection-content-type"></a>`APIFW_SERVER_OAUTH_INTROSPECTION_CONTENT_TYPE` | Token denetleme hizmetinin medya türünü belirten `Content-Type` başlığının değeri. Varsayılan değer `application/octet-stream`. |
| `APIFW_SERVER_OAUTH_INTROSPECTION_REFRESH_INTERVAL` | Önbelleğe alınmış token meta verilerinin yaşam süresi. API Güvenlik Duvarı token meta verilerini önbelleğe alır ve aynı tokenlarla talepler geldiğinde, meta verilerini önbellekten alır.<br><br>İnterval saat (`h`), dakika (`m`), saniye (`s`) veya birleşik formatda (ör. `1h10m50s`) ayarlanabilir.<br><br>Varsayılan değer `10m` (10 dakika).  |
