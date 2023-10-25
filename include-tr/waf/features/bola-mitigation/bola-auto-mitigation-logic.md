BOLA koruması etkinleştirildiğinde, Wallarm:

1. BOLA saldırılarının hedef olması muhtemel API uç noktalarını tanımlar, örneğin, [değişken yol parametreleri][variability-in-endpoints-docs] olanlar: `domain.com/path1/path2/path3/{variative_path4}`.

    !!! bilgi "Bu aşama bir süre alır"
        Kırılgan API uç noktalarının tanımlanması, API envanterinin ve gelen trafik eğilimlerinin detaylı gözlemleri için gereken süreyi alır.
    
    Sadece **API Keşif** modülü tarafından keşfedilen API uç noktaları, otomatik şekilde BOLA saldırılarına karşı korumaktadır. Korumalı uç noktalar, [ilgili simgeyle vurgulanmıştır][bola-protection-for-endpoints-docs].
1. Kırılgan API uç noktalarını BOLA saldırılarına karşı korur. Varsayılan koruma mantığı aşağıdaki gibidir:

    * Aynı IP'den gelen ve dakikada 180 istek eşiğini aşan kırılgan bir uç noktaya yapılan istekler BOLA saldırıları olarak kabul edilir.
    * Sadece aynı IP'den gelen isteklerin eşiği aşıldığında BOLA saldırılarını etkinlik listesine kaydeder. Wallarm BOLA saldırılarını engellemez. İstekleriniz uygulamalarınıza gitmeye devam eder.

        Otomatik koruma şablonundaki ilgili tepki, **Saldırıları sadece kaydet**'tir.
1. Yeni kırılgan uç noktaları koruyarak ve kaldırılan uç noktalar için korumayı devre dışı bırakarak, [API'deki değişikliklere][changes-in-api-docs] tepki verir.
