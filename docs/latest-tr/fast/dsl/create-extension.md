```markdown
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

# FAST Eklentilerinin Oluşturulması

!!! info "İstek öğelerinin açıklama sözdizimi"
    Bir FAST eklentisi oluştururken, noktalardan yararlanarak çalışmanız gereken istek öğelerini doğru biçimde tanımlayabilmek için, uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlamanız gerekmektedir.

    Detaylı bilgileri görmek için bu [link][link-points]'e gidin.

FAST eklentileri, eklentinin çalışabilmesi için gereken tüm bölümlerin ilgili YAML dosyasında tanımlanmasıyla oluşturulur. Farklı türdeki eklentiler kendi bölüm setlerini kullanır ([eklenti türleri hakkında detaylı bilgi][link-ext-logic]).

## Kullanılan Bölümler

### Değiştiren Eklenti

Bu eklenti türü aşağıdaki bölümleri kullanır:
* Zorunlu bölümler:
    * `meta-info`—eklenti tarafından tespit edilecek güvenlik açığı hakkında bilgiler içerir. Bu bölümün yapısı [aşağıda][anchor-meta-info] açıklanmıştır.
    * `detect`—zorunlu Detect aşamasının tanımını içerir. Bu aşama ve ilgili bölümün yapısı hakkında detaylı bilgileri görmek için bu [link][link-detect]'e gidin.
* Opsiyonel bölümler (olmayabilir):
    * `collect`—opsiyonel Collect aşamasının tanımını içerir. Bu aşama ve ilgili bölümün yapısı hakkında detaylı bilgileri görmek için bu [link][link-collect]'e gidin.
    * `match`—opsiyonel Match aşamasının tanımını içerir. Bu aşama ve ilgili bölümün yapısı hakkında detaylı bilgileri görmek için bu [link][link-match]'e gidin.
    * `modify`—opsiyonel Modify aşamasının tanımını içerir. Bu aşama ve ilgili bölümün yapısı hakkında detaylı bilgileri görmek için bu [link][link-modify]'e gidin.
    * `generate`—opsiyonel Generate aşamasının tanımını içerir. Bu aşama ve ilgili bölümün yapısı hakkında detaylı bilgileri görmek için bu [link][link-generate]'e gidin.

### Değiştirmeyen Eklenti

Bu eklenti türü aşağıdaki zorunlu bölümleri kullanır:
* `meta-info`—eklenti tarafından tespit edilecek güvenlik açığı hakkında bilgiler içerir. Bu bölümün yapısı [aşağıda][anchor-meta-info] açıklanmıştır.
* `send`—baseline isteğinde listelenen bir hedefe gönderilecek önceden tanımlanmış test isteklerini içerir. Bu aşama ve ilgili bölümün yapısı hakkında detaylı bilgileri görmek için bu [link][link-send]'e gidin.
* `detect`—zorunlu Detect aşamasının tanımını içerir. Bu aşama ve ilgili bölümün yapısı hakkında detaylı bilgileri görmek için bu [link][link-detect]'e gidin.

## `meta-info` Bölümünün Yapısı

Bilgilendirici `meta-info` bölümünün yapısı aşağıdaki gibidir:

```
meta-info:
  - title:
  - type:
  - threat:
  - description:
```

* `title` — eklentinin tespit edeceği güvenlik açığını tanımlayan opsiyonel bir başlık dizesidir. Belirtilen değer, Wallarm web arayüzündeki tespit edilen güvenlik açıklarının listesindeki “Title” sütununda gösterilecektir. Güvenlik açığını veya bu açığı tespit eden eklentiyi tanımlamak için kullanılabilir.

    ??? info "Örnek"
        `title: "Örnek güvenlik açığı"`

* `type` — eklentinin suistimal etmeye çalıştığı güvenlik açığı türünü tanımlayan zorunlu bir parametredir. Belirtilen değer, Wallarm web arayüzündeki tespit edilen güvenlik açıklarının listesindeki “Type” sütununda gösterilecektir. Parametre, [burada][link-vuln-list] tanımlanan değerlerden birini alabilir.
   
    ??? info "Örnek"
        `type: sqli`    

* `threat` — güvenlik açığının tehdit seviyesini tanımlayan opsiyonel bir parametredir. Belirtilen değer, Wallarm web arayüzündeki tespit edilen güvenlik açıklarının listesindeki “Risk” sütununda grafiksel olarak gösterilecektir. Parametre, 1 ile 100 arasında bir tamsayı değeri alabilir. Değer ne kadar büyükse, güvenlik açığının tehdidi o kadar yüksek olur.

    ??? info "Örnek"
        `threat: 20`
    
    ![Tespit edilen güvenlik açıkları listesi][img-vulns]

* `description` — eklentinin tespit ettiği güvenlik açığının açıklamasını içeren opsiyonel bir dizedir.
    
    ??? info "Örnek"
        `description: "Bir gösterim güvenlik açığı"`    
    
    ![Wallarm web arayüzündeki güvenlik açığının detaylı açıklaması][img-vuln-details]

!!! info "FAST eklentilerinin entegre edilmesi"
    FAST'e bir eklenti entegre etmek için, eklentinin YAML dosyasını içeren dizini FAST node Docker konteynerine monte etmeniz gerekmektedir. Montaj prosedürü hakkında detaylı bilgileri görmek için bu [link][link-extensions]'e gidin.
```