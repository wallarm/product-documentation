[img-vpatch-example1]:      ../../images/user-guides/rules/vpatch-rule-1.png
[img-vpatch-example2]:      ../../images/user-guides/rules/vpatch-rule-2.png
[img-regex-example1]:       ../../images/user-guides/rules/regex-rule-1.png
[rule-creation-options]:    ../../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# Sanal Yama

Uygulamanızın kodundaki kritik bir [güvenlik açığını](../../user-guides/vulnerabilities.md) hızla gidermek veya gerekli güncellemeleri kurmak mümkün olmadığında, bu güvenlik açıklarının istismar edilmesine olanak tanıyabilecek uç noktalara yönelik tüm veya belirli istekleri engellemek için bir sanal yama oluşturabilirsiniz. Sanal yama, [allowlisted](../ip-lists/overview.md) IP’lerden gelenler hariç, monitoring and safe blocking [modlarında](../../admin-en/configure-wallarm-mode.md) bile istekleri engeller.

Wallarm, sanal yama oluşturmak için aşağıdaki [kuralları](../../user-guides/rules/rules.md) sağlar:

* **Create a virtual patch** kuralı - seçilen kısmında [bilinen](../../attacks-vulns-list.md) saldırı göstergelerinden (SQLi, SSTi, RCE vb.) birini içeren istekleri engelleyen bir sanal yama oluşturmanıza olanak tanır. Ayrıca, herhangi bir saldırı göstergesi olmadan belirli istekleri engellemek için **Any request** seçeneğini belirleyebilirsiniz.
* **Virtual patch** seçeneği işaretli **Create regexp-based attack indicator** kuralı - düzenli ifadelerle tanımladığınız kendi saldırı göstergelerinizi veya kendi engelleme nedeninizi (bkz. [örnek](#blocking-all-requests-with-incorrect-x-authentication-header)) içeren istekleri engelleyen bir sanal yama oluşturmanıza olanak tanır. Düzenli ifadeye dayalı kuralla çalışma ayrıntıları [burada](../../user-guides/rules/regex-rule.md) açıklanmaktadır.

## Kuralın oluşturulması ve uygulanması

--8<-- "../include/rule-creation-initial-step.md"
1. **Mitigation controls** öğesini seçin →

    * **Virtual patch** veya
    * **Custom attack detector** (**Virtual patch** seçeneği ile - [ayrıntılar](../../user-guides/rules/regex-rule.md))

1. **If request is** alanında, kuralın uygulanacağı kapsamı [tanımlayın](rules.md#configuring).
1. Genel **Create a virtual patch** kuralı için, tüm isteklerin mi yoksa yalnızca belirli saldırı göstergeleri içerenlerin mi engelleneceğini ayarlayın (**Any request** vs. **Selected**).
1. **In this part of request** bölümünde, kuralı uygulamak istediğiniz istek noktalarını belirtin. Wallarm, seçilen istek parametreleri için aynı değerlere sahip istekleri kısıtlayacaktır.

    Kullanılabilir tüm noktalar [burada](request-processing.md) açıklanmıştır; özel kullanım durumunuza uyanları seçebilirsiniz.

1. [Kuralın derlenip filtreleme düğümüne yüklenmesinin tamamlanmasını](rules.md#ruleset-lifecycle) bekleyin.

## Kural örnekleri

### Seçili uç nokta için belirli isteklerin engellenmesi

Diyelim ki uygulamanızın `example.com/purchase` uç noktasından erişilen çevrimiçi satın alma bölümü, `refresh` sorgu dizesi parametresi işlendiğinde çöküyor. Hata düzeltilene kadar, çöküşe yol açan istekleri engellemeniz gerekiyor.

Bunu yapmak için, ekran görüntüsünde gösterildiği gibi **Create a virtual patch** kuralını ayarlayın:

![Herhangi bir istek türü için sanal yama][img-vpatch-example2]

### Keşfedilmiş ancak henüz düzeltilmemiş güvenlik açığının istismar girişimlerinin engellenmesi

Diyelim ki `example.com` alan adından erişilen uygulamanızda keşfedilmiş ancak henüz giderilmemiş bir güvenlik açığı var: uygulamanın `id` parametresi SQL injection saldırılarına karşı zafiyet içeriyor. Bu sırada Wallarm filtreleme düğümü monitoring mode olarak ayarlanmış olsa da, güvenlik açığının istismar girişimlerini derhal engellemeniz gerekiyor.

Bunu yapmak için, ekran görüntüsünde gösterildiği gibi **Create a virtual patch** kuralını ayarlayın:

![Belirli bir istek türü için sanal yama][img-vpatch-example1]

### Hatalı `X-AUTHENTICATION` başlığına sahip tüm isteklerin engellenmesi {#blocking-all-requests-with-incorrect-x-authentication-header}

--8<-- "../include/waf/features/rules/rule-vpatch-regex.md"

## Sanal yamalar için API çağrıları

Sanal yamalar oluşturmak için Wallarm API’sini doğrudan çağırabilirsiniz. Örnekleri inceleyin:

* [`/my/api/*` adresine gönderilen tüm istekleri engelleyecek sanal yamayı oluşturun](../../api/request-examples.md#create-the-virtual-patch-to-block-all-requests-sent-to-myapi)
* [Belirli bir application instance ID için, `/my/api/*` adresine gönderilen tüm istekleri engelleyecek sanal yamayı oluşturun](../../api/request-examples.md#create-the-virtual-patch-for-a-specific-application-instance-id-to-block-all-requests-sent-to-myapi)