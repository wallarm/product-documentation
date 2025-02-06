# JA3 Parmak İzi Etkinleştirme

Bu makale, NGINX gibi popüler yazılımlar ve AWS, Google Cloud ve Azure gibi altyapılar için JA3 parmak izi etkinleştirme yöntemini açıklamaktadır.

## Genel Bakış

Saldırganlar, kullanıcı aracısı (UA) sahteciliği ve IP döndürme gibi çeşitli teknikler kullanarak güvenlik önlemlerini aşmaya çalışırlar. Bu yöntemler, doğrulanmamış trafiğe yönelik davranışsal saldırıları tespit etmeyi zorlaştırır. [JA3 fingerprinting](https://www.peakhour.io/learning/fingerprinting/what-is-ja3-fingerprinting/) yöntemi, istemci ile sunucu arasındaki TLS müzakeresi sırasında tanımlanan belirli parametreler için bir MD5 karması üretir. Bu parmak izi yöntemi, [API session](../api-sessions/overview.md) işleme sürecinin bir parçası olarak tehdit aktörlerinin tanımlanmasını güçlendirebilir ve [API abuse prevention](../api-abuse-prevention/overview.md) kapsamında davranışsal bir profil oluşturulmasına katkıda bulunabilir.

## NGINX

NGINX üzerinden JA3 parmak izi elde edilebilmesi, bu tanımlama yönteminin tüm NGINX tabanlı Wallarm [dağıtım seçenekleri](..//installation/nginx-native-node-internals.md#nginx-node) içinde kullanılabilir olmasını sağlar. JA3 için iki NGINX modülü bulunmaktadır:

| Module | Description | Installation |
| - | - | - |
| [nginx-ssl-ja3](https://github.com/fooinha/nginx-ssl-ja3) | JA3 için ana nginx modülü. `THIS IS NOT PRODUCTION` işareti taşıyor. Bu nedenle başarı garantisi yoktur. | [Instructions](https://github.com/fooinha/nginx-ssl-ja3#compilation-and-installation) |
| [nginx-ssl-fingerprint](https://github.com/phuslu/nginx-ssl-fingerprint) | JA3 için ikinci nginx modülü. `high performance` etiketini taşır ve ayrıca beğeni ve fork'ları bulunmaktadır. | [Instructions](https://github.com/phuslu/nginx-ssl-fingerprint#quick-start) |

Her iki modülde de OpenSSL ve NGINX yamalanmalıdır.

`nginx-ssl-fingerprint` modülünden bir modül kurulumu örneği:

```
# Clone

$ git clone -b OpenSSL_1_1_1-stable --depth=1 https://github.com/openssl/openssl
$ git clone -b release-1.23.1 --depth=1 https://github.com/nginx/nginx
$ git clone https://github.com/phuslu/nginx-ssl-fingerprint

# Patch

$ patch -p1 -d openssl < nginx-ssl-fingerprint/patches/openssl.1_1_1.patch
$ patch -p1 -d nginx < nginx-ssl-fingerprint/patches/nginx.patch

# Configure & Build

$ cd nginx
$ ASAN_OPTIONS=symbolize=1 ./auto/configure --with-openssl=$(pwd)/../openssl --add-module=$(pwd)/../nginx-ssl-fingerprint --with-http_ssl_module --with-stream_ssl_module --with-debug --with-stream --with-cc-opt="-fsanitize=address -O -fno-omit-frame-pointer" --with-ld-opt="-L/usr/local/lib -Wl,-E -lasan"
$ make

# Test

$ objs/nginx -p . -c $(pwd)/../nginx-ssl-fingerprint/nginx.conf
$ curl -k https://127.0.0.1:8444
```

NGINX yapılandırma örneği:

```
server {
  listen 80;
  server_name example.com;
  …
  # JA3 parmak izi başlığını başka bir uygulamaya proxy ile ilet.
  proxy_set_header X-Client-TLS-FP-Value $http_ssl_ja3_hash;
  proxy_set_header X-Client-TLS-FP–Raw-Value $http_ssl_ja3;

  # İsteği proxy uygulamaya ilet.
  proxy_pass http://app:8080;
}
```

## AWS

[AWS CloudFront üzerinden JA3 parmak izlerini alma](https://aws.amazon.com/about-aws/whats-new/2022/11/amazon-cloudfront-supports-ja3-fingerprint-headers/) yapılandırmasını gerçekleştirebilirsiniz.

Wallarm, CloudFront ile entegre olarak `CloudFront-Viewer-JA3-Fingerprint` ve `CloudFront-Viewer-TLS` JA3 başlıklarını alabilir:

1. CloudFront konsoluna gidin ve **Origin Request Policies** sekmesini seçin.
1. **Create Origin Request Policy** seçeneğine tıklayın ve politika detaylarını belirleyin.

    ![CloudFront - creating origin request policy](../images/configuration-guides/ja3/aws-cloudfront-create-origin-request-policy.png)

1. **Actions** bölümünde, **Add Header** seçeneğini seçin.
1. **Header Name** alanına `CloudFront-Viewer-JA3-Fingerprint` değerini girin.

    ![CloudFront - adding header to origin request policy](../images/configuration-guides/ja3/aws-cloudfront-origin-request-policy-add-header.png)

1. **Create** butonuna tıklayın. Böylece, orijin istek politikanız oluşturulmuş olur.
1. Oluşturulan istek politikasını CloudFront dağıtımınıza eklemek için aşağıdaki adımları izleyin.
1. CloudFront konsolunda, politikayı eklemek istediğiniz dağıtımı seçin.
1. **Origin Request Policies** yanındaki **Edit** butonuna tıklayın.
1. Oluşturduğunuz politikanın yanındaki onay kutusunu işaretleyin ve değişiklikleri kaydedin.

    ![CloudFront - attach policy to distribution](../images/configuration-guides/ja3/aws-cloudfront-attach-policy-to-distribution.png)

    Artık orijin istek politikanız CloudFront dağıtımınıza eklenmiş durumda. Dağıtımınıza istek yapan istemcilere artık `CloudFront-Viewer-JA3-Fingerprint` başlığı eklenmiş olacaktır.

## Google Cloud

Klasik Google Cloud Application Load Balancer'dan JA3 parmak izi alabilmek için özelleştirilmiş başlık yapılandırması yaparak değeri `tls_ja3_fingerprint` değişkeni aracılığıyla elde edebilirsiniz:

1. Google Cloud konsoluna gidin → **Load balancing**.
1. **Backends** sekmesine tıklayın.
1. Bir backend servisi ismine tıklayın ve ardından **Edit** seçeneğini seçin.
1. **Advanced configurations** bölümüne tıklayın.
1. **Custom request headers** altında, **Add header** butonuna tıklayın.
1. **Header name** alanına bir başlık ismi girin ve **Header value** alanına `tls_ja3_fingerprint` değerini atayın.
1. Değişiklikleri kaydedin.

Detaylı talimatlar için bakınız [buraya](https://cloud.google.com/load-balancing/docs/https/custom-headers).

Örnek yapılandırma isteği:

```
PATCH https://compute.googleapis.com/compute/v1/projects/PROJECT_ID/global/backendServices/BACKEND_SERVICE_NAME
"customRequestHeaders": [
   "X-Client-TLS-FP-Value: {tls_ja3_fingerprint}"
]
```

## Azure

[Azure Wallarm dağıtımı](../installation/cloud-platforms/azure/docker-container.md) için, yukarıda [NGINX](#nginx) bölümünde açıklanan NGINX üzerinden JA3 parmak izi elde etme yöntemini kullanın.