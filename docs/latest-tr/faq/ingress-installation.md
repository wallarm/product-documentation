# NGINX tabanlı Wallarm Ingress denetleyicisinin yüklenmesi

Bu sorun giderme rehberi, [Wallarm NGINX tabanlı Ingress denetleyicinin dağıtımı](../admin-en/installation-kubernetes-en.md) sırasında karşılaşabileceğiniz yaygın sorunları listeler. Burada ilgili detayları bulamadıysanız, lütfen [Wallarm teknik destek](mailto:support@wallarm.com) ile iletişime geçin.

## Ingress denetleyicisi tarafından tespit edilen/kullanılan müşteri IP adreslerini nasıl kontrol ederim?

* Denetleyici konteynerinin günlüğüne bakın ve ele alınan istekler hakkında kayıtları bulun. Varsayılan günlük formatında, ilk rapor edilen alan tespit edilen müşteri IP adresidir. Aşağıdaki örnekte tespit edilen IP adresi `25.229.38.234`'tür:
```
[wallarm-ingress-nginx-ingress-controller-775cf75564-6jlt9 nginx-ingress-controller] 25.229.38.234 - - [14/Mar/2020:23:55:11 +0000] "GET /ping HTTP/1.1" 200 893 "-" "curl/7.64.1" 172 0.020 [default-sise-80] [] 172.17.0.5:8080 893 0.020 200 d8402076753798d3b065269c16d4b34f 
```

* [ABD bulutu](https://us1.my.wallarm.com) veya [AB bulutu](https://my.wallarm.com) için Wallarm Konsolunuz'a gidin → **Olaylar** bölümü ve istek ayrıntılarını genişletin. IP adresi *Kaynak* alanda görüntülenir. Örneğin:

    ![İsteğin gönderildiği IP adresi](../images/request-ip-address.png)

    Eğer saldırıların listesi boşsa, Wallarm Ingress denetleyicisi tarafından korunan uygulamaya bir [test saldırısı](../admin-en/installation-check-operation-en.md#2-run-a-test-attack) gönderebilirsiniz.
   
## Ingress denetleyicisinin X-FORWARDED-FOR istek başlığını alıp almadığını nasıl kontrol ederim?

Lütfen [ABD bulutu](https://us1.my.wallarm.com) veya [AB bulutu](https://my.wallarm.com) için Wallarm Konsoluna gidin → **Olaylar** bölümü ve istek ayrıntılarını genişletin. Görüntülenen istek ayrıntılarına dikkat edin, `X-FORWARDED-FOR` başlığına dikkat edin. Örneğin:

![İsteğin X-FORWARDED-FOR başlığı](../images/x-forwarded-for-header.png)

Eğer saldırıların listesi boşsa, Wallarm Ingress denetleyicisi tarafından korunan uygulamaya bir [test saldırısı](../admin-en/installation-check-operation-en.md#2-run-a-test-attack) gönderebilirsiniz.