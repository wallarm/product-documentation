# NGINX Wallarm Ingress Controller Kurulumu Sırasında Yaşanan Sorunlar

Bu sorun giderme kılavuzu, [Wallarm NGINX-based Ingress controller deployment](../admin-en/installation-kubernetes-en.md) sırasında karşılaşabileceğiniz yaygın sorunları listeler. Eğer burada ilgili detayları bulamadıysanız, lütfen [Wallarm technical support](mailto:support@wallarm.com) ile iletişime geçin.

## Ingress Controller Tarafından Tespit Edilen/Kullanılan İstemcilerin IP Adreslerini Nasıl Kontrol Edebilirsiniz?

* Controller container loglarına bakın ve işlenen isteklerle ilgili kayıtları bulun. Varsayılan log formatında, rapor edilen ilk alan tespit edilen istemcinin IP adresidir. Aşağıdaki örnekte `25.229.38.234` tespit edilmiş IP adresidir:
```
[wallarm-ingress-nginx-ingress-controller-775cf75564-6jlt9 nginx-ingress-controller] 25.229.38.234 - - [14/Mar/2020:23:55:11 +0000] "GET /ping HTTP/1.1" 200 893 "-" "curl/7.64.1" 172 0.020 [default-sise-80] [] 172.17.0.5:8080 893 0.020 200 d8402076753798d3b065269c16d4b34f 
```

* [US cloud](https://us1.my.wallarm.com) ya da [EU cloud](https://my.wallarm.com) için Wallarm Console'a gidin → **Attacks** bölümüne geçin ve istek detaylarını genişletin. **Source** alanında bir IP adresi görüntülenecektir. Örneğin:

    ![IP address from which the request was sent](../images/request-ip-address.png)

    Eğer saldırı listesi boşsa, Wallarm Ingress Controller tarafından korunan uygulamaya bir [test attack](../admin-en/installation-check-operation-en.md#2-run-a-test-attack) gönderebilirsiniz.
    
## Ingress Controller'ın X-FORWARDED-FOR İstek Başlığını Aldığını Nasıl Kontrol Edebilirsiniz?

Lütfen [US cloud](https://us1.my.wallarm.com) ya da [EU cloud](https://my.wallarm.com) için Wallarm Console'a gidin → **Attacks** bölümüne geçin ve istek detaylarını genişletin. Gösterilen istek detaylarında, `X-FORWARDED-FOR` başlığına dikkat edin. Örneğin:

![The X-FORWARDED-FOR header of the request](../images/x-forwarded-for-header.png)

Eğer saldırı listesi boşsa, Wallarm Ingress Controller tarafından korunan uygulamaya bir [test attack](../admin-en/installation-check-operation-en.md#2-run-a-test-attack) gönderebilirsiniz.