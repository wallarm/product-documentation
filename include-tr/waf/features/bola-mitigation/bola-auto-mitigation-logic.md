BOLA koruması etkinleştirildiğinde, Wallarm:

1. BOLA saldırılarının hedefi olma olasılığı en yüksek olan API uç noktalarını belirler; ör., [yol parametrelerindeki değişkenlik][variability-in-endpoints-docs] içerenler: `domain.com/path1/path2/path3/{variative_path4}`.

    !!! info "Bu aşama belirli bir süre alır"
        Zafiyete açık API uç noktalarının belirlenmesi, keşfedilen API envanterinin ve gelen trafik eğilimlerinin derinlemesine gözlemlenmesi için gereken belirli bir süre alır.
    
    Yalnızca **API Discovery** modülü tarafından keşfedilen API uç noktaları BOLA saldırılarına karşı otomatik olarak korunur. Korumalı uç noktalar [ilgili simge ile vurgulanır][bola-protection-for-endpoints-docs].
1. Savunmasız API uç noktalarını BOLA saldırılarına karşı korur. Varsayılan koruma mantığı şu şekildedir:

    * Aynı IP’den dakika başına 180 istek eşiğini aşan, savunmasız bir uç noktaya yönelik istekler BOLA saldırısı olarak kabul edilir.
    * Aynı IP’den gelen isteklerin eşiğine ulaşıldığında yalnızca BOLA saldırılarını event list içinde kaydedin. Wallarm BOLA saldırılarını engellemez. İstekler uygulamalarınıza gitmeye devam eder.

        autoprotection template içindeki karşılık gelen reaksiyon **Only register attacks**’tir.
1. Yeni savunmasız uç noktaları koruyarak ve kaldırılan uç noktalar için korumayı devre dışı bırakarak [API’deki değişikliklere][changes-in-api-docs] tepki verir.