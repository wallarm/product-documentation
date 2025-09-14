[link-points]:          points/intro.md
[link-detect]:          detect/phase-detect.md
[link-collect]:         phase-collect.md
[link-match]:           phase-match.md
[link-modify]:          phase-modify.md
[link-send]:            phase-send.md
[link-generate]:        phase-generate.md
[link-extensions]:      using-extension.md
[link-ext-logic]:       logic.md
[link-vuln-list]:       ../vuln-list.md

[img-vulns]:            ../../images/fast/dsl/en/create-extension/vulnerabilities.png
[img-vuln-details]:     ../../images/fast/dsl/en/create-extension/vuln_details.png

[anchor-meta-info]:     #structure-of-the-meta-info-section

# FAST Uzantılarının Oluşturulması

!!! info "İstek öğelerini açıklama sözdizimi"
    Bir FAST uzantısı oluştururken, points kullanarak çalışmanız gereken istek öğelerini doğru şekilde tanımlayabilmek için uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlamanız gerekir. 

    Ayrıntılı bilgi için şu [bağlantıya][link-points] gidin.

FAST uzantıları, uzantının çalışması için gerekli tüm bölümlerin ilgili YAML dosyasında tanımlanmasıyla oluşturulur. Farklı türdeki uzantılar kendi bölüm setlerini kullanır ([uzantı türleri hakkında ayrıntılı bilgi][link-ext-logic]).

##  Kullanılan Bölümler

### Değişiklik Yapan Uzantı

Bu uzantı türü aşağıdaki bölümleri kullanır:
* Zorunlu bölümler:
    * `meta-info`—uzantının keşfetmeyi amaçladığı zafiyet hakkında bilgi içerir. Bu bölümün yapısı [aşağıda][anchor-meta-info] açıklanmıştır.
    * `detect`—zorunlu Detect aşamasının açıklamasını içerir. Bu aşama ve ilgili bölümün yapısı hakkında ayrıntılı bilgi için şu [bağlantıya][link-detect] bakın.
* İsteğe bağlı bölümler (bulunmayabilir):
    * `collect`—isteğe bağlı Collect aşamasının açıklamasını içerir. Bu aşama ve ilgili bölümün yapısı hakkında ayrıntılı bilgi için şu [bağlantıya][link-collect] bakın.
    * `match`—isteğe bağlı Match aşamasının açıklamasını içerir. Bu aşama ve ilgili bölümün yapısı hakkında ayrıntılı bilgi için şu [bağlantıya][link-match] bakın.
    * `modify`—isteğe bağlı Modify aşamasının açıklamasını içerir. Bu aşama ve ilgili bölümün yapısı hakkında ayrıntılı bilgi için şu [bağlantıya][link-modify] bakın.
    * `generate`—isteğe bağlı Generate aşamasının açıklamasını içerir. Bu aşama ve ilgili bölümün yapısı hakkında ayrıntılı bilgi için şu [bağlantıya][link-generate] bakın.


### Değişiklik Yapmayan Uzantı

Bu uzantı türü aşağıdaki zorunlu bölümleri kullanır:
* `meta-info`—uzantının keşfetmeyi amaçladığı zafiyet hakkında bilgi içerir. Bu bölümün yapısı [aşağıda][anchor-meta-info] açıklanmıştır.
* `send`—temel istekte listelenen bir ana makineye gönderilecek önceden tanımlanmış test isteklerini içerir. Bu aşama ve ilgili bölümün yapısı hakkında ayrıntılı bilgi için şu [bağlantıya][link-send] bakın.
* `detect`—zorunlu Detect aşamasının açıklamasını içerir. Bu aşama ve ilgili bölümün yapısı hakkında ayrıntılı bilgi için şu [bağlantıya][link-detect] bakın.


##  `meta-info` Bölümünün Yapısı

Bilgi amaçlı `meta-info` bölümü aşağıdaki yapıya sahiptir:

```
meta-info:
  - title:
  - type:
  - threat:
  - description:
```

* `title` — bir zafiyeti tanımlayan isteğe bağlı başlık dizgesi. Belirtilen değer, Wallarm web arayüzünde tespit edilen zafiyetlerin listesinde “Title” sütununda gösterilir. Bu değer, zafiyetin kendisini veya zafiyeti tespit eden belirli uzantıyı tanımlamak için kullanılabilir.

    ??? info "Örnek"
        `title: "Example vulnerability"`

* `type` — uzantının istismar etmeye çalıştığı zafiyet türünü tanımlayan zorunlu parametre. Belirtilen değer, Wallarm web arayüzünde tespit edilen zafiyetlerin listesinde “Type” sütununda gösterilir. Parametre, [burada][link-vuln-list] açıklanan değerlerden birini alabilir.
   
    ??? info "Örnek"
        `type: sqli`    

* `threat` — zafiyetin tehdit seviyesini belirleyen isteğe bağlı parametre. Belirtilen değer, Wallarm web arayüzünde tespit edilen zafiyetlerin listesinde “Risk” sütununda görsel olarak gösterilecektir. Parametre 1 ile 100 arasında bir tam sayı değeri alabilir. Değer ne kadar büyükse zafiyetin tehdit seviyesi o kadar yüksektir. 

    ??? info "Örnek"
        `threat: 20`
    
    ![Bulunan zafiyetlerin listesi][img-vulns]

* `description` — uzantının tespit ettiği zafiyetin açıklamasını içeren isteğe bağlı dizge parametresi. Bu bilgi, zafiyetin ayrıntılı açıklamasında gösterilecektir.
    
    ??? info "Örnek"
        `description: "A demonstrational vulnerability"`    
    
    ![Wallarm web arayüzünde zafiyetin ayrıntılı açıklaması][img-vuln-details]

!!! info "FAST uzantılarını bağlama"
    Bir uzantıyı FAST'e bağlamak için, uzantının YAML dosyasını içeren dizini FAST node Docker konteynerine mount etmeniz gerekir. Bağlama prosedürü hakkında ayrıntılı bilgi için şu [bağlantıya][link-extensions] gidin.