[link-using-search]:    ../search-and-filters/use-search.md
[img-current-attacks]:  ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]:    ../../images/user-guides/events/incident-vuln.png
[img-show-falsepositive]: ../../images/user-guides/events/filter-for-falsepositive.png
[use-search]:             ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action
[img-verify-attack]:            ../../images/user-guides/events/verify-attack.png
[al-brute-force-attack]:      ../../attacks-vulns-list.md#brute-force-attack
[al-forced-browsing]:         ../../attacks-vulns-list.md#forced-browsing
[al-bola]:                    ../../attacks-vulns-list.md#broken-object-level-authorization-bola
[link-analyzing-attacks]:       analyze-attack.md
[img-false-attack]:             ../../images/user-guides/events/false-attack.png
[img-removed-attack-info]:      ../../images/user-guides/events/removed-attack-info.png
[link-check-attack]:        check-attack.md
[link-false-attack]:        false-attack.md
[img-current-attack]:       ../../images/user-guides/events/analyze-current-attack.png
[glossary-attack-vector]:   ../../glossary-en.md#malicious-payload
[link-attacks]:         ../../user-guides/events/check-attack.md
[link-incidents]:       ../../user-guides/events/check-incident.md
[link-sessions]:        ../../api-sessions/overview.md

# Saldırı Analizi

Bu makale, Wallarm düğümü tarafından tespit edilen saldırıları nasıl analiz edebileceğinizi ve bunlarla ilgili hangi işlemleri gerçekleştirebileceğinizi açıklar.

### Saldırı analizi

Wallarm platformu tarafından tespit edilen tüm [saldırılar](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components), Wallarm Console’un **Attacks** bölümünde görüntülenir. Listeyi saldırı tarihi, türü ve diğer kriterlere göre [filtreleyebilir](../../user-guides/search-and-filters/use-search.md), ayrıntılı analiz için herhangi bir saldırıyı ve içerdiği istekleri genişletebilirsiniz.

Tespit edilen bir saldırı [yanlış pozitif](#false-positives) çıkarsa, gelecekte benzer yanlış pozitiflerin önüne geçmek için onu hemen böyle işaretleyebilirsiniz. Ayrıca tespit edilen saldırılar temelinde kurallar oluşturabilir ve benzer tehditleri azaltmak için diğer Wallarm yapılandırmalarını gerçekleştirebilirsiniz.

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(55.04% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/2k7dijltmvb4" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Wallarm’da:

* **Saldırı (Attack)** bir [hit](grouping-sampling.md#grouping-of-hits) grubudur
* **Hit**, düğüm tarafından eklenen meta verilerle birlikte kötü amaçlı bir istektir
* **Kötü amaçlı payload**, saldırı işareti taşıyan istek parçasıdır

Ayrıntıları [burada](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) okuyun.

Her saldırı ayrıntısı, saldırının hit’leri ve kötü amaçlı payload özetini içeren analiz için gerekli tüm bilgileri barındırır. Analizi basitleştirmek için, saldırı ayrıntılarında yalnızca benzersiz hit’ler saklanır. Tekrarlanan kötü amaçlı istekler Wallarm Cloud’a yüklenmez ve görüntülenmez. Bu işleme [hit örnekleme](grouping-sampling.md#sampling-of-hits) denir.

Hit örnekleme, saldırı tespiti kalitesini etkilemez ve Wallarm düğümü, hit örnekleme açık olsa bile uygulamalarınızı ve API’lerinizi korumaya devam eder.

<a id="full-context-of-threat-actor-activities"></a>
## Tehdit aktörü faaliyetlerinin tam bağlamı

--8<-- "../include/request-full-context.md"

<a id="false-positives"></a>
## Yanlış pozitifler

Yanlış pozitif, meşru istekte [saldırı işaretleri](../../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors) tespit edildiğinde oluşur.

Filtreleme düğümünün gelecekte bu tür istekleri saldırı olarak algılamasını önlemek için, **saldırının tüm ya da belirli isteklerini yanlış pozitif olarak işaretleyebilirsiniz**. Bu, benzer isteklerde benzer saldırı işareti tespitini atlayacak bir kuralı otomatik olarak oluşturur, ancak Wallarm Console’da görünmez.

Yanlış pozitif işaretini yalnızca uygulandıktan sonraki birkaç saniye içinde geri alabilirsiniz. Daha sonra geri almak isterseniz, bu yalnızca [Wallarm teknik desteğine](mailto: support@wallarm.com) talep göndererek yapılabilir.

Saldırı listesi varsayılan görünümü yalnızca güncel saldırıları (yanlış pozitifler olmadan) gösterir – bunu değiştirmek için, **All attacks** altında **Default view**’den **With false positives** veya **Only false positives** seçeneğine geçin.

![Yanlış pozitif filtresi](../../images/user-guides/events/filter-for-falsepositive.png)

## Saldırılara yanıt verme

Uygun olduğunda koruma tedbirlerini ayarlayabilmek için uygulamalarınızın ve API’lerinizin saldırılara karşı düzgün şekilde korunup korunmadığını anlamak önemlidir. Bu anlayışı edinmek ve uygun şekilde yanıtlamak için **Attacks** bölümündeki bilgileri kullanabilirsiniz.

Bu görevle uğraşırken, hangi tür saldırının gerçekleştiğini belirlemeniz gerekir; bu size hangi Wallarm mekanizmalarının koruma sağladığını gösterecek ve gerekirse bu mekanizmaları ayarlamanıza yardımcı olacaktır:

1. **Belirleyin** - **Payload** alanı bağlam menüsünden **Show only**’yi seçin, ardından **Type** filtresine ve arama alanı içeriğine dikkat edin.
1. Koruma için neler yapıldığını kontrol edin - **Status** sütununa bakın:

    * `Blocked` - saldırının tüm hit’leri filtreleme düğümü tarafından engellendi.
    * `Partially blocked` - saldırının bazı hit’leri engellendi, diğerleri yalnızca kaydedildi.
    * `Monitoring` - saldırının tüm hit’leri kaydedildi ancak engellenmedi.
    * `Bot detected` - bu bir bottur, saldırı içindeki eylemi kontrol edin.

1. İsteğe bağlı (önerilir) olarak, saldırının kötü amaçlı isteklerinin [tam bağlamını araştırın](#full-context-of-threat-actor-activities): bunların hangi [kullanıcı oturumuna](../../api-sessions/overview.md) ait olduğunu ve bu oturumdaki isteklerin tam sırasını.

    Bu, tehdit aktörünün tüm faaliyetlerini ve mantığını görmenizi, saldırı vektörlerini ve hangi kaynakların tehlikeye atılabileceğini anlamanızı sağlar.

1. Gerçek bir saldırı olmadığını düşünüyorsanız, [yanlış pozitif](#false-positives) olarak işaretleyin.
1. **Anlayın** - saldırıyı tespit eden ve yanıtlayan Wallarm mekanizmasının farkında olun.
1. **Ayarlayın** - Wallarm’ın davranışını ayarlayın (mekanizmaya göre “nasıl” değişir).

| Belirleyin | Anlayın | Ayarlayın | 
| -- | -- | -- |
| `sqli`, `xss`, `rce`, `ptrav`, `crlf`, `nosqli`, `ssi` [vb.](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) | [Saldırı tespiti için standart araçlar](../../about-wallarm/protecting-against-attacks.md#tools-for-attack-detection) (libproton, libdetection ve kurallar) | Bir saldırıyı genişletin ve saldırı için CVE özetini ve ayrı istekler için CVE’leri [inceleyin](../../demo-videos/events-inspection.md). Düğüm moduna (`final_wallarm_mode` etiketi) dikkat edin, **Rules** ([US](https://us1.my.wallarm.com/rules) veya [EU](https://my.wallarm.com/rules)) bölümünü ziyaret edin, saldırıdan uygulama adına göre kuralları analiz edin. Gerekirse, kuralları veya uygulamalar ya da bunların belirli host ya da uç noktaları için [filtration mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)’u ayarlayın. |
| [`custom_rule`](../../user-guides/search-and-filters/use-search.md#search-by-regexp-based-customer-rule) | [Özel saldırı dedektörü](../../user-guides/rules/regex-rule.md) | Bir saldırıyı genişletin ve **Detected by custom rules** bağlantı(lar)ını takip edin - gerekirse, kural(lar)ı [değiştirin](../../user-guides/rules/regex-rule.md), belirli dallar için [kısmi olarak devre dışı bırakma](../../user-guides/rules/regex-rule.md#partial-disabling) dahil. |
| `vpatch` | [Sanal yama](../../user-guides/rules/vpatch-rule.md) | **Rules** bölümünü ziyaret edin ([US](https://us1.my.wallarm.com/rules) veya [EU](https://my.wallarm.com/rules)), “Create virtual patch” kurallarını arayın, gerekirse saldırınızla ilgili kuralı ayarlayın. Sanal yamaların filtration mode’dan bağımsız çalıştığını unutmayın. |
| `brute`,<br>`dirbust`,<br>`bola`,<br>`multiple_payloads` | [Trigger](../../user-guides/triggers/triggers.md) ve IP listeleri: [denylist’teki IP’lerden gelen istekler](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) | Bir saldırıyı genişletin ve istekleri analiz ettikten sonra, görüntülenen trigger adını (varsa) tıklayın ve parametrelerini değiştirin. Ayrıca trigger etiketlerine dikkat edin, ardından **Triggers** ([US](https://us1.my.wallarm.com/triggers) veya [EU](https://my.wallarm.com/triggers)) bölümüne gidin ve ada göre trigger’ı bulun, gerekiyorsa - ayarlayın. <br> Eylem [`Blocked`](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) ise, bu denylist aracılığıyla yapılır - **IP Lists** ([US](https://us1.my.wallarm.com/ip-lists) veya [EU](https://my.wallarm.com/ip-lists)) bölümüne gidin ve IP’ye göre arama yapın: gerekiyorsa, IP’nin denylist’te kalma süresini ayarlayın. |
| `blocked_source` | IP listeleri: [denylist’teki IP’lerden gelen istekler](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) | Bir saldırıyı genişletin ve denylist’teki IP’den gelen istekleri analiz edin; ardından, görüntülenen trigger adını tıklayın ve gerekirse trigger ayarlarını değiştirin. Manuel olarak denylist’e eklenen IP’ler (`blocked_source`) için **IP Lists** ([US](https://us1.my.wallarm.com/ip-lists) veya [EU](https://my.wallarm.com/ip-lists)) bölümüne gidin ve IP’ye göre arayın: gerekiyorsa, IP’nin denylist’te kalma süresini ayarlayın. |
| **Belirli modül veya işlev:** |
| `api_abuse`, `account_takeover`, `security_crawlers`, `scraping`, `resource_consumption` ([ayrıntılar](../../attacks-vulns-list.md#api-abuse)) <br> - tümü için **Bot detected** durumuna dikkat edin | [API Abuse Prevention](../../api-abuse-prevention/overview.md) ve IP listeleri: [denylist’teki IP’lerden gelen istekler](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) | Bir saldırıyı genişletin ve bunun bir bot olduğuna dair [güveni](../../api-abuse-prevention/overview.md#how-api-abuse-prevention-works) kanıtlayan [ısı haritalarını](../../api-abuse-prevention/exploring-bots.md#attacks) analiz edin, saldırı tarihine ve kaynak IP’ye dikkat edin. <br> Eylem [`Blocked`](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) ise, bu denylist üzerinden yapılmıştır - **IP lists**’e gidin, tarihe ve IP’ye göre filtreleyin, IP adresi ayrıntılarını görmek için **Reason** sütununa tıklayın, bu ayrıntıları inceleyin, **Triggered profile**’a tıklayın, bunu inceleyin ve gerekirse [değiştirin](../../api-abuse-prevention/setup.md#creating-profiles). <br><br> **Ayrıca şunları yapabilirsiniz**: <br> <ul><li>Bu IP’nin asla engellenmemesi için kaynak IP’yi [istisna listesine ekleyin](../../api-abuse-prevention/exceptions.md). Ayrıca, istisna listesinden IP’yi kaldırabilirsiniz (**API Abuse Prevention** → **Exception list**)</li> <li>API abuse yapılandırması bunu otomatik yapması beklenmese bile, kaynak IP’yi denylist’e ekleyin.</li></ul> **Ek olarak**: **IP Lists** içinde, **Events**’e geri dönmek ve tüm ilgili saldırıları görmek için IP adresinin kendisine tıklayın.|
| `bola` | [API Discovery](../../api-discovery/overview.md) tarafından [BOLA otomatik koruması](../../api-discovery/bola-protection.md) | Bir saldırıyı genişletin, eğer tetikleyiciye bağlantı içermiyorsa (BOLA’dan manuel korumanın işareti) bu, **API Discovery** ([US](https://us1.my.wallarm.com/api-discovery) veya [EU](https://my.wallarm.com/api-discovery)) modülü tarafından sağlanan otomatik korumadır. Gerekirse, bu korumayı devre dışı bırakmak veya ayarlarıyla birlikte şablonu ayarlamak için **BOLA Protection** ([US](https://us1.my.wallarm.com/bola-protection) veya [EU](https://my.wallarm.com/bola-protection)) bölümüne gidin. |
| `undefined_endpoint`, `undefined_parameter`, `invalid_parameter_value`, `missing_parameter`, `missing_auth`, `invalid_request`  (hepsini aramak için `api_specification`, [ayrıntılar](../../attacks-vulns-list.md#api-specification)) | [API Specification Enforcement](../../api-specification-enforcement/overview.md) | Bir saldırıyı genişletin ve ihlal edilen spesifikasyona giden bağlantıyı takip edin. Spesifikasyon iletişim kutusunda ayarları düzenlemek için **API specification enforcement** sekmesini kullanın, **Specification upload** sekmesi ile spesifikasyonun en son sürümünü yüklemeyi değerlendirin. |
| `gql_doc_size`, `gql_value_size`, `gql_depth`, `gql_aliases`, `gql_docs_per_batch`, `gql_introspection`, `gql_debug` (hepsini aramak için `graphql_attacks`, [ayrıntılar](../../attacks-vulns-list.md#graphql-attacks)) | [GraphQL API Protection](../../api-protection/graphql-rule.md) | Bir saldırıyı genişletin ve **GraphQL security policies** bağlantısını takip edin - gerekirse mevcut **Detect GraphQL attacks** kural(lar)ını değiştirin veya belirli dallar için ek kurallar oluşturun. |
| `credential_stuffing` | [Credential Stuffing Detection](../../about-wallarm/credential-stuffing.md) | Bir saldırıyı genişletin ve kullanılmaya çalışılan ele geçirilmiş kimlik bilgileri listesini kontrol edin, Credential Stuffing ([US](https://wallarm.us1.wallarm.com/credential-stuffing), [EU](https://my.wallarm.com/credential-stuffing) Cloud) bölümüne gidin ve özellikle izlenen kimlik doğrulama uç noktaları listesini, bu liste için önerileri ve ele geçirilmiş kimlik bilgileri hakkında yapılandırılmış bildirimleri içeren [yapılandırmayı](../../about-wallarm/credential-stuffing.md#configuring) kontrol edin. |

## Panolar

Wallarm, tespit edilen saldırıları analiz etmenize yardımcı olacak kapsamlı panolar sağlar.

Wallarm’ın [Threat Prevention](../../user-guides/dashboards/threat-prevention.md) panosu, saldırılarla ilgili çok yönlü bilgiler dahil olmak üzere sisteminizin güvenlik duruşuna ilişkin genel metrikler sunar: kaynakları, hedefleri, türleri ve protokolleri.

![Threat Prevention panosu](../../images/user-guides/dashboard/threat-prevention.png)

[OWASP API Security Top 10](../../user-guides/dashboards/owasp-api-top-ten.md) panosu, saldırı bilgileri de dahil olmak üzere sisteminizin OWASP API Top 10 tehditlerine karşı güvenlik duruşuna ilişkin ayrıntılı görünürlük sağlar.

![OWASP API Top 10](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## Bildirimler

Wallarm, tespit edilen saldırılar, hit’ler ve kötü amaçlı payload’lar hakkında size bildirim gönderebilir. Bu sayede sisteminize yönelik saldırı girişimlerinden haberdar olur ve tespit edilen kötü amaçlı trafiği hızlıca analiz edebilirsiniz. Kötü amaçlı trafiğin analizi, yanlış pozitiflerin raporlanmasını, meşru isteklerin geldiği IP’lerin allowlist’e eklenmesini ve saldırı kaynaklarının denylist’e alınmasını içerir.

Bildirimleri yapılandırmak için:

1. Bildirim göndermek için sistemlerle [yerel entegrasyonları](../../user-guides/settings/integrations/integrations-intro.md) yapılandırın (örn. PagerDuty, Opsgenie, Splunk, Slack, Telegram).
2. Bildirim gönderme koşullarını ayarlayın:

    * Tespit edilen her hit için bildirim almak üzere, entegrasyon ayarlarında uygun seçeneği belirleyin.

        ??? info "JSON formatında tespit edilen hit bildirimi örneğini görün"
            ```json
            [
                {
                    "summary": "[Wallarm] New hit detected",
                    "details": {
                    "client_name": "TestCompany",
                    "cloud": "EU",
                    "notification_type": "new_hits",
                    "hit": {
                        "domain": "www.example.com",
                        "heur_distance": 0.01111,
                        "method": "POST",
                        "parameter": "SOME_value",
                        "path": "/news/some_path",
                        "payloads": [
                            "say ni"
                        ],
                        "point": [
                            "post"
                        ],
                        "probability": 0.01,
                        "remote_country": "PL",
                        "remote_port": 0,
                        "remote_addr4": "8.8.8.8",
                        "remote_addr6": "",
                        "tor": "none",
                        "request_time": 1603834606,
                        "create_time": 1603834608,
                        "response_len": 14,
                        "response_status": 200,
                        "response_time": 5,
                        "stamps": [
                            1111
                        ],
                        "regex": [],
                        "stamps_hash": -22222,
                        "regex_hash": -33333,
                        "type": "sqli",
                        "block_status": "monitored",
                        "id": [
                            "hits_production_999_202010_v_1",
                            "c2dd33831a13be0d_AC9"
                        ],
                        "object_type": "hit",
                        "anomaly": 0
                        }
                    }
                }
            ]
            ```
    
    * Saldırı, hit veya kötü amaçlı payload sayısı için bir eşik belirlemek ve eşik aşıldığında bildirim almak üzere uygun [trigger](../../user-guides/triggers/triggers.md)ları yapılandırın.

## API çağrıları

Saldırı ayrıntılarını almak için, Wallarm Console UI’ının yanı sıra [Wallarm API’yi doğrudan çağırabilirsiniz](../../api/overview.md). Aşağıda, **son 24 saatte tespit edilen ilk 50 saldırıyı alma** için bir API çağrısı örneği bulunmaktadır.

Lütfen `TIMESTAMP` değerini, 24 saat önceki tarihi [Unix Timestamp](https://www.unixtimestamp.com/) formatına dönüştürerek değiştirin.

--8<-- "../include/api-request-examples/get-attacks-en.md"

!!! warning "100 veya daha fazla saldırıyı almak"
    100 veya daha fazla kayıttan oluşan saldırı ve hit kümeleri için, performansı optimize etmek amacıyla büyük veri kümelerini tek seferde almak yerine daha küçük parçalara bölerek almak en iyisidir. [İlgili istek örneğini inceleyin](../../api/request-examples.md#get-a-large-number-of-attacks-100-and-more)