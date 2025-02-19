# Uç Kullanıcı Genel IP Adresinin Doğru Raporlanması (NGINX Tabanlı Ingress Controller)

Bu talimatlar, bir yük dengeleyicinin arkasına yerleştirilen bir controller durumunda, istemcinin (uç kullanıcı) kaynak IP adresinin tanımlanması için gereken Wallarm Ingress controller yapılandırmasını açıklamaktadır.

Varsayılan olarak, Ingress controller, doğrudan internete açık olduğunu ve bağlanan istemcilerin IP adreslerinin gerçek IP adresleri olduğunu varsayar. Ancak, istekler, Ingress controller'a gönderilmeden önce bir yük dengeleyici (örn. AWS ELB veya Google Network Load Balancer) üzerinden iletilebilir.

Yük dengeleyicinin arkasına yerleştirilen bir controller durumlarında, Ingress controller, yük dengeleyici IP adresini gerçek uç kullanıcı IP'si olarak kabul eder; bu durum [bazı Wallarm özelliklerinin hatalı çalışmasına](../../../using-proxy-or-balancer-en.md#possible-problems-of-using-a-proxy-server-or-load-balancer-ip-address-as-a-request-source-address) yol açabilir. Doğru uç kullanıcı IP adreslerini Ingress controller'a bildirmek için, lütfen controller'ı aşağıda açıklandığı şekilde yapılandırın.

## Adım 1: Ağ Katmanında Gerçek İstemci IP'sinin Geçilmesini Etkinleştirin

Bu özellik, kullanılan bulut platformuna büyük ölçüde bağlıdır; çoğu durumda, `values.yaml` dosyası özniteliği `controller.service.externalTrafficPolicy` değeri `Local` olarak ayarlanarak etkinleştirilebilir:

```
controller:
  service:
    externalTrafficPolicy: "Local"
```

## Adım 2: Ingress Controller'ın X-FORWARDED-FOR HTTP İstek Başlığından Değeri Almasını Etkinleştirin

Genellikle, yük dengeleyiciler, özgün istemci IP adresini içeren HTTP başlığı [`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For) ekler. Tam başlık adını yük dengeleyici dokümantasyonunda bulabilirsiniz.

Wallarm Ingress controller, controller `values.yaml` dosyası aşağıdaki şekilde yapılandırıldığında, bu başlıktan gerçek uç kullanıcı IP adresini alabilir:

```
controller:
  config:
    enable-real-ip: "true"
    forwarded-for-header: "X-Forwarded-For"
```

* [Documentation on the `enable-real-ip` parameter](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#enable-real-ip)
* [`forwarded-for-header`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#forwarded-for-header) parametresinde, özgün istemci IP adresini içeren yük dengeleyici başlık adını belirtiniz

--8<-- "../include/ingress-controller-best-practices-intro.md"