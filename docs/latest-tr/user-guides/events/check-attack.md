```markdown
# Saldırı Analizi

Bu makale, Wallarm düğümü tarafından tespit edilen saldırıları nasıl analiz edebileceğinizi ve bu saldırılarla ilgili hangi işlemleri yapabileceğinizi açıklamaktadır.

### Saldırı analizi

Wallarm platformu tarafından tespit edilen tüm [saldırılar](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) Wallarm Console'un **Saldırılar** bölümünde görüntülenir. Saldırı listesini saldırı tarihi, türü ve diğer kriterlere göre [filtreleyebilir](../../user-guides/search-and-filters/use-search.md) ve ayrıntılı analiz için herhangi bir saldırıyı ve buna dahil istekleri genişletebilirsiniz.

Tespit edilen bir saldırı [yanlış pozitif](#false-positives) olarak belirlenirse, gelecekte benzer yanlış pozitiflerin önüne geçmek için hemen işaretleyebilirsiniz. Ayrıca, tespit edilen saldırılara dayanarak, ek Wallarm yapılandırmalarını yapmak ve sonraki benzer tehditleri azaltmak için kurallar oluşturabilirsiniz.

Ek olarak, [aktif doğrulama](../../vulnerability-detection/threat-replay-testing/overview.md) etkinse saldırı listesinde doğrudan [durumunu](../../vulnerability-detection/threat-replay-testing/exploring.md#possible-statuses) kontrol edebilirsiniz.

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(55.04% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/2k7dijltmvb4" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Wallarm'da:

* **Saldırı**, [hitlerin](grouping-sampling.md#grouping-of-hits) bir grubudur
* **Hit**, düğüm tarafından eklenen kötü niyetli istek ve meta veridir
* **Kötü niyetli yük**, saldırı işareti içeren isteğin bir parçasıdır

Ayrıntılı bilgileri [buradan](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) okuyabilirsiniz.

Her saldırı detayı, saldırının hitleri ve kötü niyetli yük özetleri gibi analiz için gerekli tüm bilgileri içerir. Analizi basitleştirmek için, saldırı detaylarında yalnızca benzersiz hitler saklanır. Tekrarlanan kötü niyetli istekler Wallarm Cloud'a yüklenmekten çıkarılır ve görüntülenmez. Bu işleme [hit örneklemesi](grouping-sampling.md#sampling-of-hits) denir.

Hit örneklemesi, saldırı tespitinin kalitesini etkilemez; Wallarm düğümü, hit örneklemesi etkin olsa dahi uygulamalarınızı ve API'lerinizi korumaya devam eder.

## Tehdit aktörlerinin faaliyetlerinin tam bağlamı

--8<-- "../include/request-full-context.md"

## Yanlış Pozitifler

Yanlış pozitif, meşru bir istekte [saldırı işaretlerinin](../../about-wallarm/protecting-against-attacks.md#library-libproton) tespit edilmesi durumunda meydana gelir.

Filtreleme düğümünün bu tür istekleri gelecekte saldırı olarak algılamasını önlemek için, **saldırının tüm veya belirli isteklerini yanlış pozitif olarak işaretleyebilirsiniz**. Bu, benzer isteklerde benzer saldırı işareti tespitini atlamak için otomatik olarak bir kural oluşturur, ancak Wallarm Console'da görünmez.

Yanlış pozitif işaretini, uygulandıktan birkaç saniye içinde geri alabilirsiniz. Bunu daha sonra geri almak isterseniz, [Wallarm teknik desteğine](mailto: support@wallarm.com) bir istek gönderilmesi gerekmektedir.

Saldırı listesinin varsayılan görünümü yalnızca gerçek saldırıları (yanlış pozitifler hariç) sunar - bunu değiştirmek için, **Tüm saldırılar** altında **Varsayılan görünüm** den **Yanlış pozitiflerle** veya **Yalnızca yanlış pozitiflerle** seçeneğine geçin.

![Yanlış pozitif filtre](../../images/user-guides/events/filter-for-falsepositive.png)

## Saldırılara Yanıt Verme

Uygulamalarınızın ve API'lerinizin saldırılardan doğru şekilde korunup korunmadığını anlamak çok önemlidir; böylece, gerekirse koruma önlemlerini ayarlayabilirsiniz. **Saldırılar** bölümündeki bilgileri kullanarak bu anlayışı elde edebilir ve buna göre yanıt verebilirsiniz.

Bu görevle uğraşırken, hangi tür saldırının gerçekleştiğini tespit etmeniz gerekecektir; bu, Wallarm'ın hangi mekanizmalarının koruma sağladığını anlamanıza ve gerekirse bu mekanizmaları ayarlamanıza yardımcı olacaktır:

1. **Tespit et** - **Yük** alanı bağlam menüsünde **Yalnızca göster** seçeneğini seçin, ardından **Tür** filtresine ve arama alanı içeriğine dikkat edin.
1. Koruma için ne yapıldığını kontrol edin - **Durum** sütununa bakın:

    * `Blocked` - saldırının tüm hitleri filtreleme düğümü tarafından engellendi.
    * `Partially blocked` - saldırının bazı hitleri engellendi, bazıları yalnızca kaydedildi.
    * `Monitoring` - saldırının tüm hitleri kaydedildi ancak engellenmedi.
    * `Bot detected` - bu bir bottur, saldırı içindeki eyleme bakın.

1. Opsiyonel (önerilir), saldırının kötü niyetli isteklerinin [tam bağlamını](#full-context-of-threat-actor-activities) araştırın: hangi [kullanıcı oturumuna](../../api-sessions/overview.md) ait olduklarını ve bu oturumdaki isteklerin tam sırasını inceleyin.

    Bu, tehdit aktörünün tüm etkinliğini ve mantığını görmenizi, saldırı vektörlerini anlamanızı ve hangi kaynakların tehlikeye girebileceğini belirlemenizi sağlar.

1. Eğer bu gerçek bir saldırı olmadığını düşünüyorsanız, bunu [yanlış pozitif](#false-positives) olarak işaretleyin.
1. **Anlayın** - saldırıyı tespit edip tepki veren Wallarm mekanizmasını kavrayın.
1. **Ayarlayın** - Wallarm'ın davranışını (mekanizmanın "nasıl" çalıştığına bağlı olarak) yeniden yapılandırın.

| Tespit et | Anlayın | Ayarla | 
| -- | -- | -- |
| `sqli`, `xss`, `rce`, `ptrav`, `crlf`, `nosqli`, `ssi` [vb.](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) | [Saldırı tespiti için standart araçlar](../../about-wallarm/protecting-against-attacks.md#tools-for-attack-detection) (libproton, libdetection ve kurallar) | Bir saldırıyı genişletin ve saldırı için CVE’lerin özetini, ayrıca ayrı istekler için CVE’leri inceleyin. Düğüm moduna (``final_wallarm_mode`` etiketi) dikkat edin, **Rules** bölümünü ([US](https://us1.my.wallarm.com/rules) veya [EU](https://my.wallarm.com/rules)) ziyaret edin, saldırıdaki uygulama adına göre analiz edin. Gerekirse, kuralları veya uygulamalara ya da onların belirli ana makinelerine/endpointslerine göre [filtreleme modunu](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) ayarlayın. |
| [`custom_rule`](../../user-guides/search-and-filters/use-search.md#search-by-regexp-based-customer-rule) | [Özel saldırı algılayıcı](../../user-guides/rules/regex-rule.md) | Bir saldırıyı genişletin ve **Detected by custom rules** bağlantısını takip edin - gerekirse, kuralı [değiştirin](../../user-guides/rules/regex-rule.md) ve belirli dallar için [kısmi devre dışı bırakmayı](../../user-guides/rules/regex-rule.md#partial-disabling) uygulayın. |
| `vpatch` | [Sanal yamalama](../../user-guides/rules/vpatch-rule.md) | **Rules** bölümünü ([US](https://us1.my.wallarm.com/rules) veya [EU](https://my.wallarm.com/rules)) ziyaret edin, "Create virtual patch" kuralını arayın; gerekirse, saldırıyla ilgili kuralı ayarlayın. Sanal yamalar filtreleme modundan bağımsız çalışır. |
| `brute`,<br>`dirbust`,<br>`bola`,<br>`multiple_payloads` | [Trigger](../../user-guides/triggers/triggers.md) ve IP listeleri: [denylisted IP’lerden gelen istekler](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) | Bir saldırıyı genişletin ve istekleri analiz ettikten sonra, görüntülenen trigger adına tıklayın ve gerekirse parametreleri değiştirin. Ayrıca trigger etiketlerine dikkat edin, ardından **Triggers** ([US](https://us1.my.wallarm.com/triggers) veya [EU](https://my.wallarm.com/triggers)) bölümüne gidin ve isimle trigger'ı bulun, gerekirse ayarlayın. <br> Eğer eylem [`Blocked`](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) ise, bu denylist üzerinden yapılır - **IP Lists** bölümüne ([US](https://us1.my.wallarm.com/ip-lists) veya [EU](https://my.wallarm.com/ip-lists)) gidin ve IP'yi arayın; gerekirse, denylist'te IP'nin kalma süresini ayarlayın. |
| `blocked_source` | IP listeleri: [denylisted IP’lerden gelen istekler](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) | Bir saldırıyı genişletin ve denylist'ten gelen istekleri analiz edin; ardından, görüntülenen trigger adına tıklayın ve gerekirse trigger ayarlarını değiştirin. Manuel olarak denylist’e eklenen IP’ler (`blocked_source`) için, **IP Lists** bölümüne ([US](https://us1.my.wallarm.com/ip-lists) veya [EU](https://my.wallarm.com/ip-lists)) gidin ve IP'yi arayın; gerekirse, denylist'te IP'nin kalma süresini ayarlayın. |
| **Belirli modül veya fonksiyon:** |
| `api_abuse`, `account_takeover`, `security_crawlers`, `scraping` ([ayrıntılar](../../attacks-vulns-list.md#api-abuse)) <br> - tümü için **Bot detected** durumu göz önünde bulundurulmalıdır | [API Abuse Prevention](../../api-abuse-prevention/overview.md) ve IP listeleri: [denylisted IP’lerden gelen istekler](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) | Bir saldırıyı genişletin ve [heatmap'leri](../../api-abuse-prevention/exploring-bots.md#attacks) analiz ederek bunun bir bot olduğuna dair [güveni](../../api-abuse-prevention/overview.md#how-api-abuse-prevention-works) tespit edin, saldırı tarihine ve kaynak IP'ye dikkat edin. <br> Eğer eylem [`Blocked`](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) ise, bu denylist üzerinden yapılır - **IP Lists** bölümünde, tarihi ve IP'yi filtreleyin, IP adresi ayrıntılarını görmek için **Reason** sütununa tıklayın, bu ayrıntıları inceleyin, **Triggered profile** bağlantısını tıklayın, inceleyin ve gerekirse [değiştirin](../../api-abuse-prevention/setup.md#creating-profiles). <br><br> **Ayrıca, şunları da yapabilirsiniz**: <br> <ul><li>Bu IP için asla engellenmemesi adına [kaynak IP’yi istisna listesine ekleyin](../../api-abuse-prevention/exceptions.md). Ayrıca, istisna listesinden IP'yi kaldırabilirsiniz (**API Abuse Prevention** → **Exception list** bölümüne giderek)</li> <li>API abuse yapılandırması otomatik olarak bunu yapmasa bile, kaynak IP’yi denylist’e ekleyin.</li></ul> **Ek olarak şunları yapabilirsiniz**:  **IP Lists** bölümünde, ilgili saldırıları görmek için IP adresine tıklayın.|
| `bola` | [BOLA otomatik koruması](../../api-discovery/bola-protection.md) [API Discovery](../../api-discovery/overview.md) tarafından | Bir saldırıyı genişletin, eğer trigger bağlantısı içermiyorsa (bu, BOLA'dan manuel korumanın işareti) o zaman bu, **API Discovery** ([US](https://us1.my.wallarm.com/api-discovery) veya [EU](https://my.wallarm.com/api-discovery)) modülü tarafından sağlanan otomatik korumadır. Gerekirse, **BOLA Protection** ([US](https://us1.my.wallarm.com/bola-protection) veya [EU](https://my.wallarm.com/bola-protection)) bölümüne giderek bu korumayı devre dışı bırakın veya şablon ayarlarını düzenleyin. |
| `undefined_endpoint`, `undefined_parameter`, `invalid_parameter_value`, `missing_parameter`, `missing_auth`, `invalid_request`  (`api_specification` ile hepsini arayın, [ayrıntılar](../../attacks-vulns-list.md#api-specification)) | [API Specification Enforcement](../../api-specification-enforcement/overview.md) | Bir saldırıyı genişletin ve ihlal edilen spesifikasyona ait bağlantıyı takip edin. Spesifikasyon diyalogunda, **API specification enforcement** sekmesini kullanarak ayarları yeniden düzenleyin; **Specification upload** sekmesi üzerinden en güncel spesifikasyonu yüklemeyi de düşünebilirsiniz. |
| `gql_doc_size`, `gql_value_size`, `gql_depth`, `gql_aliases`, `gql_docs_per_batch`, `gql_introspection`, `gql_debug` (`graphql_attacks` ile hepsini arayın, [ayrıntılar](../../attacks-vulns-list.md#graphql-attacks)) | [GraphQL API Protection](../../api-protection/graphql-rule.md) | Bir saldırıyı genişletin ve **GraphQL security policies** bağlantısını takip edin - gerekirse, mevcut **Detect GraphQL attacks** kural(lar)ını değiştirin veya belirli dallar için ek kural(lar) oluşturun. |

## Saldırıları Almak için API Çağrıları

Saldırı detaylarını almak için, Wallarm Console arayüzü dışında [Wallarm API'sine doğrudan çağrı yapabilirsiniz](../../api/overview.md). Aşağıda **son 24 saatte tespit edilen ilk 50 saldırıyı almak için** API çağrısının örneği verilmiştir.

Lütfen `TIMESTAMP` yerine, 24 saat öncesinin [Unix Timestamp](https://www.unixtimestamp.com/) formatına çevrilmiş tarihini koyun.

--8<-- "../include/api-request-examples/get-attacks-en.md"

!!! warning "100 veya daha fazla saldırı alınması"
    Saldırı ve hit setlerinde 100 veya daha fazla kayıt bulunan durumlarda, büyük veri setlerini tek seferde almak yerine, performansı optimize etmek için bunları daha küçük parçalara ayırarak almanız en iyisidir. [İlgili istek örneğini inceleyin](../../api/request-examples.md#get-a-large-number-of-attacks-100-and-more)
```