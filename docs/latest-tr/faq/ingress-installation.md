# Wallarm Ingress Controller Sorun Giderme

Bu sorun giderme kılavuzu, [Wallarm NGINX tabanlı Ingress denetleyicisinin kurulumu](../admin-en/installation-kubernetes-en.md) sırasında karşılaşabileceğiniz yaygın sorunları listeler. Burada ilgili ayrıntıları bulamazsanız, lütfen [Wallarm teknik desteği](mailto:support@wallarm.com) ile iletişime geçin.

## Ingress denetleyicisi tarafından hangi istemci IP adreslerinin tespit edildiğini/kullanıldığını nasıl kontrol ederim?

* Denetleyici kapsayıcısının günlüğüne bakın ve işlenen isteklere ait kayıtları bulun. Varsayılan günlükleme biçiminde, raporlanan ilk alan tespit edilen istemci IP adresidir. Aşağıdaki örnekte tespit edilen IP adresi `25.229.38.234`'tür:
```
[wallarm-ingress-nginx-ingress-controller-775cf75564-6jlt9 nginx-ingress-controller] 25.229.38.234 - - [14/Mar/2020:23:55:11 +0000] "GET /ping HTTP/1.1" 200 893 "-" "curl/7.64.1" 172 0.020 [default-sise-80] [] 172.17.0.5:8080 893 0.020 200 d8402076753798d3b065269c16d4b34f 
```

* [US cloud](https://us1.my.wallarm.com) veya [EU cloud](https://my.wallarm.com) için Wallarm Console'a gidin → Attacks bölümüne geçin ve istek ayrıntılarını genişletin. IP adresi Source alanında görüntülenir. Örneğin:

    ![İsteğin gönderildiği IP adresi](../images/request-ip-address.png)

    Attacks listesinin boş olması durumunda, Wallarm Ingress denetleyicisi tarafından korunan uygulamaya bir [test saldırısı](../admin-en/uat-checklist-en.md#node-registers-attacks) gönderebilirsiniz.
    
## Ingress denetleyicisinin X-FORWARDED-FOR istek başlığını aldığını nasıl kontrol ederim?

Lütfen [US cloud](https://us1.my.wallarm.com) veya [EU cloud](https://my.wallarm.com) için Wallarm Console'a gidin → Attacks bölümüne geçin ve istek ayrıntılarını genişletin. Görüntülenen istek ayrıntılarında `X-FORWARDED-FOR` başlığına dikkat edin. Örneğin:

![İsteğin X-FORWARDED-FOR başlığı](../images/x-forwarded-for-header.png)

Attacks listesinin boş olması durumunda, Wallarm Ingress denetleyicisi tarafından korunan uygulamaya bir [test saldırısı](../admin-en/uat-checklist-en.md#node-registers-attacks) gönderebilirsiniz.