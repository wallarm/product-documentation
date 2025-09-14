# OWASP Dashboard tarafından uyarılan Wallarm düğümü sorunlarının giderilmesi

Wallarm düğümleri güncel değilse veya Cloud ile senkronizasyon sorunları yaşıyorsa, altyapı güvenliğini etkileyebilecek problemleri belirten hata mesajları [OWASP dashboard](../user-guides/dashboards/owasp-api-top-ten.md) üzerinde görünür. Bu makale bu sorunları nasıl ele alacağınızı açıklar.

## Wallarm düğümü güncel değil

Güncel olmayan düğümler önemli güvenlik güncellemelerinden yoksun olabilir ve kötü amaçlı trafiğin savunmaları atlatmasına izin verebilir. Senkronizasyon sorunları, düğümlerin Cloud’dan hayati güvenlik politikalarını almasını engelleyerek düğümlerin işlevselliğini bozabilir. Bu sorunlar öncelikle, uygulama yığınının herhangi bir bölümünde güvenlik çözümünün eksikliği nedeniyle sistemin savunmasız hale gelebileceği **OWASP API8 (Security Misconfiguration)** tehdidiyle ilişkilidir. Bunu önlemek için, pano düğüm çalışmasına ilişkin sorunlar konusunda sizi uyarır, örn.:

![Düğüm sorunları olan OWASP Dashboard](../images/user-guides/dashboard/owasp-dashboard-node-issues.png)

Güvenli bir ortamı korumak için Wallarm düğümlerini düzenli olarak güncellemek ve senkronizasyon sorunlarını gidermek çok önemlidir. Wallarm düğüm sürümünüz [ömür sonuna geldiyse veya yaklaşıyorsa](../updating-migrating/versioning-policy.md#version-list), düğümünüzü en son sürüme yükseltmeniz önerilir.

## Wallarm düğümü ile Cloud arasında senkronizasyon sorunları var

Wallarm Cloud senkronizasyonuyla ilgili sorunlarla karşılaşırsanız, [ilgili ayarların](../admin-en/configure-cloud-node-synchronization-en.md) doğru olduğundan emin olun.

Senkronizasyonu veya diğer sorunları çözmek ya da başka talepleriniz için yardıma ihtiyacınız olursa, [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçebilirsiniz. Analiz için aşağıdaki [logları](../admin-en/configure-logging.md) sağlayın:

* `syncnode` betiğiyle ilgili herhangi bir sorun olup olmadığını kontrol etmek için `/opt/wallarm/var/log/wallarm/wcli-out.log` logları
* Dağıtım seçeneğine bağlı olarak, senkronizasyon sorununa ilişkin ek ayrıntılar sağlamak için `/var/log/syslog` veya `/var/log/messages` dizininden loglar

### custom_ruleset ve proton.db

Cloud-düğüm senkronizasyonu sırasında güncellenmesi gereken önemli dosyalar, [`custom_ruleset`](../user-guides/rules/rules.md#ruleset-lifecycle) ve [`proton.db`](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors) dosyalarıdır. İşletim sisteminizde bunları arayın; `/opt/wallarm/etc/wallarm` içinde veya self-hosted düğüm [kurulum yöntemine](../installation/supported-deployment-options.md) bağlı olarak başka bir klasörde bulunabilirler.

```
-rw-r--r--    1 wallarm  wallarm      93774 Aug 20 07:40 custom_ruleset
-rw-r--r--    1 wallarm  wallarm        406 Jul 29 20:09 libproton.json
-rw-r-----    1 wallarm  wallarm        680 Aug 20 07:40 node.yaml
-rw-r--r--    1 wallarm  wallarm       1675 Aug 20 07:40 private.key
-rw-r--r--    1 wallarm  wallarm     363659 Aug 20 13:01 proton.db
-rw-r--r--    1 wallarm  wallarm          6 Jul 29 20:11 version
```

Belirtilen ve diğer dosyaların grup değerleri doğru olmalıdır (ikinci sütunda `wallarm`); bu grup, NGINX worker’larını çalıştıran grupla aynı olmalıdır (`ps aux|grep nginx` ile kontrol edin)

### custom_ruleset sürümü

[`custom_ruleset`](../user-guides/rules/rules.md#ruleset-lifecycle) senkronizasyonundaki problemler, Wallarm destek grubu tarafından sizin için ayarlanan minimum custom ruleset sürümü ile düğüm sürümü arasındaki tutarsızlıktan kaynaklanabilir:

1. Düğümün [istatistik hizmeti](../admin-en/configure-statistics-service.md#usage) üzerinden custom ruleset sürümünüzü alın - `custom_ruleset_ver`. Örneğin:

    ```
    curl -s http://127.0.0.8/wallarm-status | jq -c '{custom_ruleset_ver}'
    ```

1. Wallarm düğüm sürümünüzü alın; örneğin Wallarm Console → **Nodes** → node ayrıntılarınız, pencerenin alt kısmından.
1. Ayarlarınızı Wallarm [API](../api/overview.md) üzerinden, `/v2/client/{clientid}/rules/settings` uç noktasından alın. Örneğin:

    ```
    curl -X GET "https://us1.api.wallarm.com/v2/client/<client_id>/rules/settings"  \
         -H "accept: application/json" \
         -H 'X-WallarmAPI-Token: <TOKEN>'
    ```

## Düğüm uuid’si ve/veya secret tespit edilemiyor

Yeni oluşturulmuş veya güncellenmiş düğüm loglarında şu mesajı görebilirsiniz: "Can't detect node uuid and/or secret, please add node to cloud first."

Düğüm oluşturma ve güncelleme sırasında, düğüm Cloud’a kaydedilir. Bahsedilen mesaj, bu kaydın başarısız olduğu anlamına gelebilir ve bu da düğüm ile Cloud’un senkronize olmasını engeller (yalnızca [temel](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors) algılama [monitoring](../admin-en/configure-wallarm-mode.md) modunda; Cloud’dan [rules](../user-guides/rules/rules.md), [mitigation controls](../about-wallarm/mitigation-controls-overview.md) veya [lists](../user-guides/ip-lists/overview.md) gelmez, Cloud’a monitoring sonuçları ulaşmaz).

**Düğüm kaydedildi**

Düğümün başarıyla kaydedildiğinden emin olmanın en hızlı yolu, Wallarm Console → [**Nodes**](../user-guides/nodes/nodes.md) bölümünde varlığını kontrol etmektir. Devam eden senkronizasyon durumu da burada kontrol edilebilir.

"Kaydedilmeyen düğüm" sorunlarını genel olarak çözmek için, [Wallarm destek ekibi](https://support.wallarm.com/) ile iletişime geçin.

**Endişelenmenize gerek olmayan durumlar**

Bazen, "Can't detect node uuid and/or secret, please add node to cloud first" mesajı, düğüm kayıt işlemi tamamlanmadan ÖNCE görünebilir ve logda şunu görürsünüz:

```
YYYY-MM-DD HH:MM:SS* INFO syncnodeXXXXX: Triggers result: 1 success, 0 skipped, 0 errors
```

Dolayısıyla, kayıt hataları bu mesajdan ÖNCE geliyorsa, onları yok sayabilirsiniz - kayıt tamamlandıktan sonra kaybolacaklardır.