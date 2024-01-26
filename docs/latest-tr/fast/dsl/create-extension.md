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

!!! info "İstek elementlerinin açıklama sözdizimi"
    Bir FAST uzantısı oluştururken, uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını doğru bir şekilde açıklamak için noktaları kullanmanız gereken istek elementlerini anlamanız gerekir. 

    Ayrıntılı bilgi için bu [bağlantıya][link-points] gidin.

FAST uzantıları, uzantının işlev görebilmesi için gerekli olan tüm bölümleri karşılık gelen YAML dosyasında tanımlayarak oluşturulur. Farklı türdeki uzantılar kendi bölüm setlerini kullanır ([uzantı türleri hakkında ayrıntılı bilgi][link-ext-logic]).

##  Kullanılan Bölümler

### Değiştirme Uzantısı

Bu tür uzantı, aşağıdaki bölümleri kullanır:
* Zorunlu bölümler:
    * `meta-info`—uzantı tarafından bulunması planlanan güvenlik açığı hakkında bilgi içerir. Bu bölümün yapısı [aşağıda][anchor-meta-info] açıklanmıştır.
    * `detect`—zorunlu Algılama aşamasının bir açıklamasını içerir. Bu aşama ve ilgili bölümün yapısı hakkında ayrıntılı bilgi için bu [bağlantıya][link-detect] gidin.
* Optinal bölümler (olmayabilir):
    * `collect`—isteğe bağlı Toplama aşamasının bir açıklamasını içerir. Bu aşama ve ilgili bölümün yapısı hakkında ayrıntılı bilgi için bu [bağlantıya][link-collect] gidin.
    * `match`—isteğe bağlı Eşleştirme aşamasının bir açıklamasını içerir. Bu aşama ve ilgili bölümün yapısı hakkında ayrıntılı bilgi için bu [bağlantıya][link-match] gidin.
    * `modify`—isteğe bağlı Değiştirme aşamasının bir açıklamasını içerir. Bu aşama ve ilgili bölümün yapısı hakkında ayrıntılı bilgi için bu [bağlantıya][link-modify] gidin.
    * `generate`—isteğe bağlı Oluşturma aşamasının bir açıklamasını içerir. Bu aşama ve ilgili bölümün yapısı hakkında ayrıntılı bilgi için bu [bağlantıya][link-generate] gidin.

### Değiştirme Olmayan Uzantı

Bu tür uzantı, aşağıdaki zorunlu bölümleri kullanır:
* `meta-info`—uzantı tarafından bulunması planlanan güvenlik açığı hakkında bilgi içerir. Bu bölümün yapısı [aşağıda][anchor-meta-info] açıklanmıştır.
* `send`—temel bir istekte listelenen bir hosta gönderilecek önceden tanımlanmış test isteklerini içerir. Bu aşama ve ilgili bölümün yapısı hakkında ayrıntılı bilgi için bu [bağlantıya][link-send] gidin.
* `detect`—zorunlu Algılama aşamasının bir açıklamasını içerir. Bu aşama ve ilgili bölümün yapısı hakkında ayrıntılı bilgi için bu [bağlantıya][link-detect] gidin.

##  `meta-info` Bölümünün Yapısı

Bilgilendirici `meta-info` bölümünün aşağıdaki gibi bir yapısı vardır:

```
meta-info:
  - title:
  - type:
  - threat:
  - description:
```

* `title`—bir güvenlik açığını tanımlayan isteğe bağlı başlık dizesi. Belirtilen değer, Wallarm web arayüzündeki tespit edilen güvenlik açıklarının listesinde "Başlık" sütununda gösterilir. Bu, güvenlik açığını veya güvenlik açığını tespit eden belirli bir uzantıyı tanımlamak için kullanılabilir.

    ??? info "Örnek"
        `title: "Örnek güvenlik açığı"`

* `type`—uzantının istismar etmeye çalıştığı güvenlik açığının türünü tanımlayan zorunlu bir parametredir. Belirtilen değer, Wallarm web arayüzündeki tespit edilen güvenlik açıklarının listesindeki "Tür" sütununda gösterilir. Parametre, [burada][link-vuln-list] açıklanan değerlerden birini alabilir.

    ??? info "Örnek"
        `type: sqli`    

* `threat`—güvenlik açığının tehdit seviyesini tanımlayan isteğe bağlı bir parametredir. Belirtilen değer, Wallarm web arayüzündeki tespit edilen güvenlik açıklarının listesinde "Risk" sütununda grafiksel olarak gösterilecektir. Parametre, 1 ila 100 arasında bir tam sayı değeri alabilir. Değer ne kadar büyükse, güvenlik açığının tehdit seviyesi o kadar yüksektir.

    ??? info "Örnek"
        `threat: 20`
    
    ![Bulunan güvenlik açıkları listesi][img-vulns]

* `description`—uzantının algıladığı güvenlik açığının açıklamasını içeren isteğe bağlı bir dize parametresidir. Bu bilgi, güvenlik açığının ayrıntılı açıklamasında gösterilecektir.
    
    ??? info "Örnek"
        `description: "Demonstrasyon amaçlı bir güvenlik açığı"`    
    
    ![Wallarm web interface'te güvenlik açığının ayrıntılı açıklaması][img-vuln-details]

!!! info "FAST uzantılarını takma"
    Bir uzantıyı FAST'a takmak için, uzantının YAML dosyasını içeren dizini FAST düğüm Docker konteynerine monte etmeniz gerekmektedir. Montaj işlemi hakkında ayrıntılı bilgi için bu [bağlantıya][link-extensions] gidin.