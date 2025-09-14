# Uç Kullanıcının Genel IP Adresinin Doğru Bildirilmesi (NGINX tabanlı Ingress denetleyicisi)

Bu talimatlar, bir denetleyici bir yük dengeleyicinin arkasına yerleştirildiğinde istemcinin (uç kullanıcının) kaynak IP adresini belirlemek için gereken Wallarm Ingress controller yapılandırmasını açıklar.

Varsayılan olarak, Ingress denetleyicisi doğrudan İnternet'e açık olduğunu ve bağlanan istemcilerin IP adreslerinin gerçek IP'leri olduğunu varsayar. Ancak, istekler Ingress denetleyicisine gönderilmeden önce bir yük dengeleyiciden (ör. AWS ELB veya Google Network Load Balancer) geçirilebilir.

Denetleyici bir yük dengeleyicinin arkasına yerleştirildiğinde, Ingress denetleyicisi yük dengeleyicinin IP'sini gerçek uç kullanıcı IP'si olarak kabul eder; bu da [bazı Wallarm özelliklerinin hatalı çalışmasına](../../../using-proxy-or-balancer-en.md#possible-problems-of-using-a-proxy-server-or-load-balancer-ip-address-as-a-request-source-address) yol açabilir. Doğru uç kullanıcı IP adreslerini Ingress denetleyicisine bildirmek için lütfen denetleyiciyi aşağıda açıklandığı şekilde yapılandırın.

## Adım 1: Ağ katmanında gerçek istemci IP'sinin iletilmesini etkinleştirin

Bu özellik büyük ölçüde kullanılan bulut platformuna bağlıdır; çoğu durumda, `values.yaml` dosyasındaki `controller.service.externalTrafficPolicy` özelliğini `Local` değerine ayarlayarak etkinleştirilebilir:

```
controller:
  service:
    externalTrafficPolicy: "Local"
```

## Adım 2: Ingress denetleyicisinin X-FORWARDED-FOR HTTP istek başlığından değeri almasını etkinleştirin

Genellikle, yük dengeleyiciler, orijinal istemci IP adresini içeren [`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For) HTTP başlığını ekler. Kesin başlık adını yük dengeleyicinizin dokümantasyonunda bulabilirsiniz.

Wallarm Ingress controller, `values.yaml` aşağıdaki gibi yapılandırılmışsa gerçek uç kullanıcı IP adresini bu başlıktan alabilir:

```
controller:
  config:
    enable-real-ip: "true"
    forwarded-for-header: "X-Forwarded-For"
```

- [`enable-real-ip` parametresi hakkında dokümantasyon](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#enable-real-ip)
- [`forwarded-for-header`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#forwarded-for-header) parametresinde, orijinal istemci IP adresini içeren yük dengeleyici başlığının adını belirtin

--8<-- "../include/ingress-controller-best-practices-intro.md"