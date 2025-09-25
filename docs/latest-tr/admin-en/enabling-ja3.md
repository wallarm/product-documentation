# JA3 Parmak İzi Oluşturmayı Etkinleştirme

Bu makale, NGINX gibi en popüler yazılımlar ve AWS, Google Cloud, Azure gibi altyapılar için JA3 parmak izi oluşturmanın nasıl etkinleştirileceğini açıklar.

## Genel Bakış

Saldırganlar, kullanıcı aracısı (UA) sahteciliği ve IP rotasyonu gibi güvenlik önlemlerini atlatmak için çeşitli teknikleri sıklıkla kullanır. Bu yöntemler, kimliği doğrulanmamış trafikte davranışsal saldırıları tespit etmeyi zorlaştırır. [JA3 fingerprinting](https://www.peakhour.io/learning/fingerprinting/what-is-ja3-fingerprinting/), istemci ile sunucu arasındaki TLS görüşmesi sırasında tanımlanan belirli parametreler için bir MD5 karması oluşturur. Bu parmak izi yöntemi, [API oturumu](../api-sessions/overview.md) işlemenin bir parçası olarak tehdit aktörlerinin tanımlanmasını geliştirebilir ve [API kötüye kullanımının önlenmesi](../api-abuse-prevention/overview.md) için davranışsal bir profil oluşturulmasına katkıda bulunabilir.

## NGINX

NGINX’ten JA3 parmak izi alınabilmesi, bu tanımlama yöntemini NGINX tabanlı tüm Wallarm [dağıtım seçeneklerinde](..//installation/nginx-native-node-internals.md#nginx-node) kullanılabilir hale getirir. JA3 için iki NGINX modülü vardır:

| Modül | Açıklama | Kurulum |
| - | - | - |
| [nginx-ssl-ja3](https://github.com/fooinha/nginx-ssl-ja3) | JA3 için ana NGINX modülü. `THIS IS NOT PRODUCTION` işaretine sahiptir. Dolayısıyla başarı garantisi yoktur. | [Talimatlar](https://github.com/fooinha/nginx-ssl-ja3#compilation-and-installation) |
| [nginx-ssl-fingerprint](https://github.com/phuslu/nginx-ssl-fingerprint) | JA3 için ikinci NGINX modülü. `high performance` etiketine sahiptir ve beğeniler ile fork’ları vardır. | [Talimatlar](https://github.com/phuslu/nginx-ssl-fingerprint#quick-start) |

Her iki modülde de OpenSSL ve NGINX’i yamalamamız gerekir.

Modül kurulumuna bir örnek (`nginx-ssl-fingerprint` modülünden):

```
# Kopyalama

$ git clone -b OpenSSL_1_1_1-stable --depth=1 https://github.com/openssl/openssl
$ git clone -b release-1.23.1 --depth=1 https://github.com/nginx/nginx
$ git clone https://github.com/phuslu/nginx-ssl-fingerprint

# Yama

$ patch -p1 -d openssl < nginx-ssl-fingerprint/patches/openssl.1_1_1.patch
$ patch -p1 -d nginx < nginx-ssl-fingerprint/patches/nginx.patch

# Yapılandır ve Derle

$ cd nginx
$ ASAN_OPTIONS=symbolize=1 ./auto/configure --with-openssl=$(pwd)/../openssl --add-module=$(pwd)/../nginx-ssl-fingerprint --with-http_ssl_module --with-stream_ssl_module --with-debug --with-stream --with-cc-opt="-fsanitize=address -O -fno-omit-frame-pointer" --with-ld-opt="-L/usr/local/lib -Wl,-E -lasan"
$ make

# Test

$ objs/nginx -p . -c $(pwd)/../nginx-ssl-fingerprint/nginx.conf
$ curl -k https://127.0.0.1:8444
```

Örnek NGINX yapılandırması:

```
server {
  listen 80;
  server_name example.com;
  …
  # JA3 parmak izi başlığını başka bir uygulamaya iletin.
  proxy_set_header X-Client-TLS-FP-Value $http_ssl_ja3_hash;
  proxy_set_header X-Client-TLS-FP–Raw-Value $http_ssl_ja3;

  # İsteği proxy'lenen uygulamaya ilet.
  proxy_pass http://app:8080;
}
```

## AWS

[AWS CloudFront’tan JA3 parmak izlerini alma](https://aws.amazon.com/about-aws/whats-new/2022/11/amazon-cloudfront-supports-ja3-fingerprint-headers/) yapılandırılabilir.

Wallarm, `CloudFront-Viewer-JA3-Fingerprint` ve `CloudFront-Viewer-TLS` JA3 başlıklarını almak için CloudFront ile entegre olabilir:

1. CloudFront console’a gidin ve **Origin Request Policies** sekmesini seçin.
1. **Create Origin Request Policy**’ye tıklayın ve ilke ayrıntılarını ayarlayın.

    ![CloudFront - origin request policy oluşturma](../images/configuration-guides/ja3/aws-cloudfront-create-origin-request-policy.png)

1. **Actions** bölümünde **Add Header**’ı seçin.
1. **Header Name** alanına `CloudFront-Viewer-JA3-Fingerprint` girin.

    ![CloudFront - origin request policy’e başlık ekleme](../images/configuration-guides/ja3/aws-cloudfront-origin-request-policy-add-header.png)

1. **Create**’e tıklayın. Origin request policy’niz artık oluşturuldu.
1. Oluşturulan request policy’yi CloudFront distribution’ınıza eklemek için aşağıdaki adımları izleyin.
1. CloudFront console’da, ilkeyi eklemek istediğiniz distribution’ı seçin.
1. **Origin Request Policies** yanında bulunan **Edit** düğmesine tıklayın.
1. Oluşturduğunuz politikanın yanındaki onay kutusunu seçin ve değişiklikleri kaydedin.

    ![CloudFront - policy’yi distribution’a ekleme](../images/configuration-guides/ja3/aws-cloudfront-attach-policy-to-distribution.png)

    Origin request policy’niz artık CloudFront distribution’ınıza eklendi. Distribution’ınıza istek yapan istemcilerin isteklerine `CloudFront-Viewer-JA3-Fingerprint` başlığı eklenecektir.

## Google Cloud

Klasik Google Cloud Application Load Balancer’dan JA3 parmak izlerini almak için özel başlık yapılandırıp değerini `tls_ja3_fingerprint` değişkeni üzerinden alacak şekilde yapılandırabilirsiniz:

1. Google Cloud console → **Load balancing**’e gidin.
1. **Backends**’e tıklayın.
1. Bir backend service adını ve ardından **Edit**’i tıklayın.
1. **Advanced configurations**’a tıklayın.
1. **Custom request headers** altında **Add header**’a tıklayın.
1. **Header name** girin ve **Header value** değerini `tls_ja3_fingerprint` olarak ayarlayın.
1. Değişiklikleri kaydedin.

Ayrıntılı talimatlar için [buraya](https://cloud.google.com/load-balancing/docs/https/custom-headers) bakın.

Örnek yapılandırma isteği:

```
PATCH https://compute.googleapis.com/compute/v1/projects/PROJECT_ID/global/backendServices/BACKEND_SERVICE_NAME
"customRequestHeaders": [
   "X-Client-TLS-FP-Value: {tls_ja3_fingerprint}"
]
```

## Azure

[Azure Wallarm dağıtımı](../installation/cloud-platforms/azure/docker-container.md) için, [yukarıda](#nginx) açıklanan NGINX’ten JA3 parmak izi alma yöntemini kullanın.