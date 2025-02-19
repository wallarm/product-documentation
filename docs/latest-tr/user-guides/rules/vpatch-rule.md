[img-vpatch-example1]:      ../../images/user-guides/rules/vpatch-rule-1.png
[img-vpatch-example2]:      ../../images/user-guides/rules/vpatch-rule-2.png
[img-regex-example1]:       ../../images/user-guides/rules/regex-rule-1.png
[rule-creation-options]:    ../../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# Sanal Yamalama

Uygulamanızın kodundaki kritik [güvenlik açığını](../../user-guides/vulnerabilities.md) düzeltemediğiniz veya gerekli güncellemeleri hızlıca yükleyemediğiniz durumlarda, bu güvenlik açıklarından yararlanmayı mümkün kılabilecek uç noktalara yapılan tüm veya belirli istekleri engellemek amacıyla sanal yama oluşturabilirsiniz. Sanal yama, [allowlisted](../ip-lists/overview.md) IP'lerden gelenler hariç, izleme ve güvenli engelleme [modlarında](../../admin-en/configure-wallarm-mode.md) bile isteklere müdahale edecektir.

Wallarm, sanal yama oluşturmak için aşağıdaki [kuralları](../../user-guides/rules/rules.md) sunar:

* **Sanal yama oluştur** kuralı - SQLi, SSTi, RCE vb. gibi bilinen [saldırı](../../attacks-vulns-list.md) işaretlerini içeren istekleri engellemek amaçlı sanal yama oluşturmanıza olanak tanır. Ayrıca, herhangi bir saldırı işareti olmaksızın belirli istekleri engellemek için **Herhangi bir istek** seçeneğini de kullanabilirsiniz.
* **Virtual patch** seçeneğiyle **RegExp tabanlı saldırı göstergesi oluştur** kuralı - Kendi saldırı işaretlerinizi veya engelleme nedeninizi (bkz. [örnek](#blocking-all-requests-with-incorrect-x-authentication-header)) tanımlayan düzenli ifadeler kullanarak istekleri engelleyen sanal yama oluşturmanıza olanak tanır. Düzenli ifadeye dayalı kural ile çalışma detayları [burada](../../user-guides/rules/regex-rule.md) açıklanmaktadır.

## Kural Oluşturma ve Uygulama

--8<-- "../include/rule-creation-initial-step.md"
1. **Mitigation controls** bölümünü seçin →
    * **Sanal yama** veya
    * **Özel saldırı tespitçisi** ( **Virtual patch** seçeneğiyle - bkz. [ayrıntılar](../../user-guides/rules/regex-rule.md))
1. **If request is** bölümünde, kuralı uygulamak istediğiniz kapsamı [describe](rules.md#configuring) edin.
1. Ortak **Sanal yama oluştur** kuralı için, tüm istekleri mi yoksa sadece belirli saldırı işaretleri bulunan istekleri mi engelleyeceğinizi ayarlayın (**Herhangi bir istek** veya **Seçilmiş**).
1. **In this part of request** bölümünde, kuralı uygulamak istediğiniz istek noktalarını belirtin. Wallarm, seçilen istek parametrelerine sahip istekleri sınırlandıracaktır.

    Mevcut tüm noktalar [burada](request-processing.md) açıklanmıştır; özel kullanım durumunuza uygun olanları seçebilirsiniz.

1. [Kuralın derlenmesi ve filtreleme düğümüne yüklenmesi](rules.md#ruleset-lifecycle) tamamlanana kadar bekleyin.

## Kural Örnekleri

### Seçilen Uç Nokta İçin Belirli İstekleri Engelleme

Örneğin, uygulamanızın `example.com/purchase` uç noktasında bulunan online satın alma bölümünün, `refresh` sorgu dizesi parametresini işlerken çöktüğünü varsayalım. Hata giderilene kadar, çökme oluşturan istekleri engellemeniz gerekir.

Bunu yapmak için, ekran görüntüsünde gösterildiği gibi **Sanal yama oluştur** kuralını ayarlayın:

![Virtual patch for any request type][img-vpatch-example2]

### Keşfedilmiş Ancak Henüz Düzeltilemeyen Güvenlik Açığı İçin İstismar Girişimlerini Engelleme

Örneğin, uygulamanızın `example.com` alan adında yer alan bölümünde henüz düzeltilmemiş, ancak keşfedilmiş bir güvenlik açığı olduğunu varsayalım: Uygulamanın `id` parametresi SQL enjeksiyon saldırılarına açıktır. Bu arada, Wallarm filtreleme düğümü izleme modunda olsa da, güvenlik açığı istismar girişimlerini hemen engellemeniz gerekmektedir.

Bunu yapmak için, ekran görüntüsünde gösterildiği gibi **Sanal yama oluştur** kuralını ayarlayın:

![Virtual patch for a certain request type][img-vpatch-example1]

### Yanlış `X-AUTHENTICATION` Başlığına Sahip Tüm İstekleri Engelleme

--8<-- "../include/waf/features/rules/rule-vpatch-regex.md"

## Sanal Yamalar İçin API Çağrıları

Sanal yamalar oluşturmak için doğrudan Wallarm API'sini çağırabilirsiniz. Aşağıdaki örneklere göz atın:

* [Tüm `/my/api/*` adresine gönderilen istekleri engellemek üzere sanal yama oluşturun](../../api/request-examples.md#create-the-virtual-patch-to-block-all-requests-sent-to-myapi)
* [Belirli bir uygulama örnek kimliği için `/my/api/*` adresine gönderilen tüm istekleri engellemek üzere sanal yama oluşturun](../../api/request-examples.md#create-the-virtual-patch-for-a-specific-application-instance-id-to-block-all-requests-sent-to-myapi)