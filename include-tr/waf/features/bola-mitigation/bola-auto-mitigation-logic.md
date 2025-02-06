BOLA koruması etkinleştirildiğinde, Wallarm:

1. BOLA saldırılarının hedefi olma olasılığı en yüksek API uç noktalarını tanımlar, örneğin [variability in path parameters][variability-in-endpoints-docs] içerenler: `domain.com/path1/path2/path3/{variative_path4}`.

    !!! info "Bu aşama biraz zaman alır"
        Keşfedilen API envanterinin ve gelen trafik trendlerinin derinlemesine gözlemlenmesini gerektiren bir süre boyunca güvenlik açığı bulunan API uç noktalarının tanımlanması gerçekleşir.
    
    Yalnızca **API Discovery** modülü tarafından keşfedilen API uç noktaları, otomatik olarak BOLA saldırılarına karşı korunur. Korunan uç noktalar [ilgili simge ile vurgulanır][bola-protection-for-endpoints-docs].
1. Güvenlik açığı bulunan API uç noktalarını BOLA saldırılarına karşı korur. Varsayılan koruma mantığı aşağıdaki gibidir:

    * Aynı IP'den gelen, dakika başına 180'i aşan istekler BOLA saldırısı olarak kabul edilir.
    * Aynı IP'den gelen istek eşiğine ulaşıldığında BOLA saldırıları olay listesine yalnızca kaydedilir. Wallarm, BOLA saldırılarını engellemez. İstekler uygulamalarınıza ulaşmaya devam eder.

        Otomatik koruma şablonundaki ilgili tepki **Only register attacks** olarak ayarlanmıştır.
1. Yeni güvenlik açığı bulunan uç noktaları koruyarak ve kaldırılan uç noktalar için korumayı devre dışı bırakarak [API'deki değişikliklere][changes-in-api-docs] tepki verir.