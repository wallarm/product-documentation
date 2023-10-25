# Son Kullanıcı Kamu IP Adresinin Doğru Raporlanması (NGINX tabanlı Ingress kontrolörü)

Bu talimatlar, bir kontrolörün bir yük dengeleyici arkasına yerleştirildiğinde bir istemcinin (son kullanıcının) kaynak IP adresini tanımlamak için gereken Wallarm Ingress kontrolörü yapılandırmasını tanımlar.

Varsayılan olarak, Ingress kontrolörü, doğrudan İnternet'e maruz kaldığını ve bağlanan istemcilerin IP adreslerinin gerçek IP'leri olduğunu varsayar. Ancak, istekler yük dengeleyici (ör. AWS ELB veya Google Network Load Balancer) tarafından Ingress kontrolörüne gönderilmeden önce geçirilebilir.

Bir kontrolör bir yük dengeleyici arkasına yerleştirildiğinde, Ingress kontrolörü yük dengeleyici IP'sini gerçek bir son kullanıcı IP'si olarak kabul eder. Bu, [bazı Wallarm özelliklerinin yanlış çalışmasına](../../../using-proxy-or-balancer-en.md#possible-problems-of-using-a-proxy-server-or-load-balancer-ip-address-as-a-request-source-address) neden olabilir. Doğru son kullanıcı IP adreslerini Ingress kontrolörüne bildirmek için lütfen kontrolörü aşağıda açıklanan şekilde yapılandırın.

## Adım 1: Ağ katmanında gerçek istemci IP'sinin geçişine izin verin

Bu özellik, kullanılan bulut platformuna büyük ölçüde bağımlıdır; çoğu durumda, `values.yaml` dosyası niteliği `controller.service.externalTrafficPolicy`'i `Local` değerine ayarlayarak etkinleştirilebilir:

```
controller:
  service:
    externalTrafficPolicy: "Local"
```

## Adım 2: Ingress kontrolörünün X-FORWARDED-FOR HTTP istek başlığından değeri almasını etkinleştirin

Genellikle, yük dengeleyiciler, orijinal bir istemci IP adresini içeren [`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For) HTTP başlığını ekler. Yük dengeleyici belgelerinde bir başlık adı bulabilirsiniz.

Wallarm Ingress kontrolörü, kontrolörün `values.yaml` dosyası aşağıdaki gibi yapılandırıldığında bu başlıktan gerçek son kullanıcı IP adresini alabilir:

```
controller:
  config:
    enable-real-ip: "true"
    forwarded-for-header: "X-Forwarded-For"
```

* [`enable-real-ip` parametresi hakkında belgelendirme](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#enable-real-ip)
* Lütfen [`forwarded-for-header`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#forwarded-for-header) parametresinde, orijinal bir istemci IP adresini içeren yük dengeleyici başlık adını belirtin.

--8<-- "../include/ingress-controller-best-practices-intro.md"