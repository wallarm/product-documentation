[api-discovery-enable-link]:    ../api-discovery/setup.md#enable

# File Upload Restriction Policy

[Unrestricted resource consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md), en ciddi API güvenlik risklerinin yer aldığı [OWASP API Top 10 2023](../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023) listesine dahildir. Kendi başına bir tehdit olmakla birlikte (hizmetin yavaşlaması veya aşırı yüklenme nedeniyle tamamen çökmesi), farklı saldırı türlerine de zemin hazırlar; örneğin, enumeration saldırıları. Çok büyük dosya yüklemeye izin verilmesi bu risklerin nedenlerinden biridir. Bu makale, Wallarm’da dosya yükleme kısıtlamalarının nasıl yapılandırılacağını açıklar.

Dosya yükleme kısıtlamasını [kullanarak](#configuration-method) mitigation controls ile yapılandırırsanız, kontrolün doğrudan amacına (yüklenen dosyaların azami boyutunu sınırlama) ek olarak, belirli istek parametrelerinin boyutunu sınırlayarak saldırı yüzeyini de azaltabilirsiniz. Örneğin, rastgele bir header’ın azami boyutunu sınırlayan kurallar ayarlayabilirsiniz. Bu durumda saldırganın payload’ını içeri itme veya BufferOverflow’dan yararlanma imkanları azalır.

Wallarm’ın, sınırsız kaynak tüketimini engellemek için sağladığı tek [önlem dosya boyutu yükleme kısıtlamaları değildir](#comparison-to-other-measures-for-preventing-unrestricted-resource-consumption).

## Configuration method

Abonelik planınıza bağlı olarak, dosya yükleme kısıtlaması için aşağıdaki yapılandırma yöntemlerinden biri kullanılabilir:

* Mitigation controls ([Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliği) - bir mitigation control kullanarak yalnızca isteğin toplam boyutuna değil, belirli bir parametreye de limit koyabilirsiniz (kurala göre daha hassas ayarlar).
* Rules ([Cloud Native WAAP](../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliği)

## Mitigation control-based protection <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

[Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliğinin bir parçası olarak Wallarm, **File upload restriction policy** [mitigation control](../about-wallarm/mitigation-controls-overview.md) sağlar.

!!! tip ""
    [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.3.0 veya üzeri gerektirir ve şu an için [Native Node](../installation/nginx-native-node-internals.md#native-node) tarafından desteklenmemektedir.

Bu mitigation control ile belirli bir parametrenin boyutuna limit koyabilir (daha hassas ayarlar), ya da basitlik için limiti tüm istek üzerinde tanımlayabilirsiniz.

Belirli istek parametrelerinin boyutunu sınırlamak, kontrolün doğrudan amacına (yüklenen dosyaların azami boyutunu sınırlama) ek olarak saldırı yüzeyini azaltmaya da olanak tanır. Örneğin, rastgele bir header’ın azami boyutunu sınırlayan kurallar ayarlayabilirsiniz. Bu durumda saldırganın payload’ını içeri itme veya BufferOverflow’dan yararlanma imkanları azalır.

### Mitigation control oluşturma ve uygulama

!!! info "Azaltma kontrollerine ilişkin genel bilgiler"
    Devam etmeden önce: Herhangi bir mitigation control için **Scope** ve **Mitigation mode** ayarlarının nasıl yapıldığını öğrenmek üzere [Mitigation Controls](../about-wallarm/mitigation-controls-overview.md#configuration) makalesini kullanın.

Dosya yükleme kısıtlama politikasını yapılandırmak için:

1. Wallarm Console → **Mitigation Controls** bölümüne gidin.
1. **Add control** → **File upload restriction policy** seçin.
1. Mitigation control’ün uygulanacağı **Scope**’u tanımlayın.
1. Tüm istek için veya seçili nokta için **Size restrictions** ayarlayın.
1. **Mitigation mode** bölümünde gerçekleştirilecek eylemi ayarlayın.
1. **Add**’a tıklayın.

### Mitigation control örnekleri

#### Belirli bir istek alanı üzerinden yüklenen dosyanın boyutunu sınırlama

Diyelim ki `application-001` uygulamanızın `/upload` adresine, `upfile` POST istek parametresi üzerinden yüklenen dosyaların boyutunu sınırlamak istiyorsunuz. Limit 100KB olmalı. Limiti aşan her şey engellenmelidir.

Bunu yapmak için, **File upload restriction policy** mitigation control’ü ekran görüntüsünde gösterildiği gibi ayarlayın:

![File upload restriction MC - örnek](../images/api-protection/mitigation-controls-file-upload-1.png)

#### Exact point size ile PUT yüklemesini kısıtlama

Diyelim ki uygulamanızın `/put-upload` adresine, PUT yöntemiyle istek gövdesinde 100KB’den büyük dosya yükleme girişimlerini (engellemeden) saldırı olarak kaydetmek istiyorsunuz.

Bunu yapmak için, **File upload restriction policy** mitigation control’ü ekran görüntüsünde gösterildiği gibi ayarlayın:

![File upload restriction MC - örnek](../images/api-protection/mitigation-controls-file-upload-2.png)

Yukarıdaki örnekte, istek noktası tanımında `post`, Wallarm’ın [etiketi](../user-guides/rules/request-processing.md#metadata) olup “istek gövdesinde” anlamına gelir.

#### JSON Base64 yükleme kısıtlaması 

Diyelim ki istek gövdesindeki bir JSON nesnesi içinde (yalnızca bu eylem uygulamanızın `/json-upload` adresini hedefliyorsa) dosyanın Base64 kodlu 100K+ karakterlik bir dizgesini yükleme girişimlerini (engellemeden) saldırı olarak kaydetmek istiyorsunuz.

Bunu yapmak için, **File upload restriction policy** mitigation control’ü ekran görüntüsünde gösterildiği gibi ayarlayın:

![File upload restriction MC - örnek](../images/api-protection/mitigation-controls-file-upload-3.png)

Yukarıdaki örnekte istek noktası tanımı, Wallarm’ın [etiketlerinin](../user-guides/rules/request-processing.md) bir dizisiyle şu anlama gelecek şekilde yapılmıştır:

* `post` - istek gövdesinde
* `json_doc` - veriler JSON formatında
* `hash` - ilişkisel dizinin anahtarı için
* `file` - bu anahtarın değeri

#### Multipart form data yükleme kısıtlaması

Diyelim ki bir dosya yükleme alanı içeren HTML formu aracılığıyla (genelde `multipart/form-data` içerik türü oluşur) 100K+ dosyalar gönderme girişimlerini (yalnızca bu eylem uygulamanızın `/multipart-upload` adresini hedefliyorsa) saldırı olarak kaydetmek istiyorsunuz.

Bu sınırlamayı uygulamak için, **File upload restriction policy** mitigation control’ü ekran görüntüsünde gösterildiği gibi ayarlayın:

![File upload restriction MC - örnek](../images/api-protection/mitigation-controls-file-upload-4.png)

Yukarıdaki örnekte istek noktası tanımı, Wallarm’ın [etiketlerinin](../user-guides/rules/request-processing.md) bir dizisiyle şu anlama gelecek şekilde yapılmıştır:

* `post` - istek gövdesinde
* `multipart` - `multipart/form-data` içerik türündeki veriler
* `file` - formun ürettiği karma içeriğin “dosya parçası”

## Rule-based protection

[Cloud Native WAAP](../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliğinin bir parçası olarak Wallarm, **File upload restriction policy** [rule](../user-guides/rules/rules.md) sağlar.

!!! tip ""
    [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.3.0 veya üzeri gerektirir ve şu an için [Native Node](../installation/nginx-native-node-internals.md#native-node) tarafından desteklenmemektedir.

**Kuralı oluşturma ve uygulama**

--8<-- "../include/rule-creation-initial-step.md"
1. **Mitigation controls** → **File upload restriction policy** seçin.
1. **If request is** içinde, kuralın uygulanacağı kapsamı [tanımlayın](../user-guides/rules/rules.md#configuring).
1. **Size restrictions** içinde boyut kısıtlamasını ve **Mode**’u ayarlayın.
1. İsteğe bağlı olarak, kısıtlamanın uygulanacağı istek noktasını belirtin (ayarlanmazsa kısıtlama tüm istek boyutuna uygulanır).

    ![File upload restriction - kural](../images/api-protection/rule-file-upload.png)

1. [Kuralın derlenmesini ve filtreleme node’una yüklenmesini bekleyin](../user-guides/rules/rules.md#ruleset-lifecycle).

## Tespit edilen saldırıları görüntüleme

Dosya yükleme kısıtlama politikalarının ihlalleri, **Attacks** ve **API Sessions** bölümlerinde [file upload violation](../attacks-vulns-list.md#file-upload-violation) saldırıları olarak görüntülenir:

![File upload restriction - tespit edilen saldırılar](../images/api-protection/mitigation-controls-file-upload-detected.png)

İstek ayrıntılarındaki düğmeleri kullanarak **Attacks** ve **API Sessions** görünümleri arasında geçiş yapabilirsiniz. Bu saldırı türüne sahip tüm saldırılar/oturumlar, saldırı türü filtresi **File upload violation** olarak ayarlanarak bulunabilir (ayrıca, **Attacks** içinde `file_upload_violation` [arama etiketi](../user-guides/search-and-filters/use-search.md#search-by-attack-type) de kullanılabilir).

## Comparison to other measures for preventing unrestricted resource consumption

Dosya yükleme kısıtlama politikalarını ayarlamaya ek olarak, Wallarm sınırsız kaynak tüketimini engellemek için başka mekanizmalar da sağlar. Bunlar:

* Botlar tarafından gerçekleştirilen sınırsız kaynak tüketimini tespit etme ve engelleme (Wallarm'ın API Abuse Prevention özelliği, çalışması için yapılandırılmalıdır).
* [DoS protection](../api-protection/dos-protection.md) mitigation control ( [Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliği gerektirir).
* [Advanced rate limiting](../user-guides/rules/rate-limiting.md).