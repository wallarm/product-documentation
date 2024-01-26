[img-phases-mod-overview]:              ../../images/fast/dsl/common/mod-phases.png
[img-phases-non-mod-overview]:          ../../images/fast/dsl/common/non-mod-phases.png
[img-mod-workflow]:                     ../../images/fast/dsl/common/mod-workflow.png
[img-non-mod-workflow]:                 ../../images/fast/dsl/common/non-mod-workflow.png
[img-workers]:                          ../../images/fast/dsl/en/workers.png

[img-incomplete-policy]:                ../../images/fast/dsl/common/incomplete-policy.png
[img-incomplete-policy-remediation-1]:  ../../images/fast/dsl/common/incomplete-policy-remediation-1.png
[img-incomplete-policy-remediation-2]:  ../../images/fast/dsl/common/incomplete-policy-remediation-2.png
[img-wrong-baseline]:                   ../../images/fast/dsl/common/wrong-baseline.png   

[link-policy]:              ../terms-glossary.md#test-policy
[doc-policy-in-detail]:     ../operations/test-policy/overview.md

[link-phase-collect]:       phase-collect.md
[link-phase-match]:         phase-match.md
[link-phase-modify]:        phase-modify.md
[link-phase-generate]:      phase-generate.md
[link-phase-send]:          phase-send.md
[link-phase-detect]:        detect/phase-detect.md

[doc-collect-uniq]:         phase-collect.md#the-uniqueness-condition
[doc-point-uri]:            points/parsers/http.md#uri-filter

[link-points]:              points/intro.md


# Uzantıların Mantığı

Uzantıların mantığı, birkaç aşama kullanılarak tanımlanabilir:

1.  [Topla][link-phase-collect]
2.  [Eşleştir][link-phase-match]
3.  [Değiştir][link-phase-modify]
4.  [Oluştur][link-phase-generate]
5.  [Gönder][link-phase-send]
6.  [Tespit Et][link-phase-detect]

Bu aşamaları birleştirerek, FAST DSL iki tür uzantıyı tarif etmenize olanak sağlar:

* İlki, gelen temel bir isteğin parametrelerini değiştirerek bir veya daha fazla test isteği oluşturur.

    Bu uzantı, bu kılavuz boyunca “değiştirici uzantı” olarak anılacaktır.

* İkincisi, önceden tanımlanmış test isteklerini kullanır ve gelen temel bir isteğin parametrelerini değiştirmez.

    Bu uzantı, bu kılavuz boyunca “değiştirilmeyen uzantı” olarak anılacaktır.

Her uzantı türü, belirli bir aşama setini kullanır. Bu aşamaların bazıları zorunlu, diğerleri ise değildir.

Detect aşamasının kullanılması, her uzantı türü için zorunludur. Bu aşama, hedef uygulamanın test isteklerine verdiği yanıtları alır. Uzantı, bu yanıtları kullanarak uygulamanın belirli zafiyetlere sahip olup olmadığını belirler. Detect aşamasından gelen bilgiler Wallarm buluta gönderilir.

!!! info "İstek elementlerini tarif etme sözdizimi"
    Bir FAST uzantısı oluştururken, uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlamanız ve çalışmanız gereken istek elementlerini doğru bir şekilde tarif etmeniz gerekiyor.

    Detaylı bilgi için ilerleyin [bağlantı][link-points].
    
##  Bir Değiştirici Uzantının Nasıl Çalıştığı

Bir değiştirici uzantının işlemi sırasında, temel bir istek sırasıyla Topla, Eşleştir, Değiştir ve Oluştur aşamalarından geçer, bunların hepsi seçimli ve uzantıya dahil edilmeyebilir. Bu aşamalardan geçildikten sonra tek bir test isteği veya çoklu test istekleri oluşturulacak. Bu istekler, hedef uygulamayı zafiyetler için kontrol etmek üzere gönderilecektir.

!!! info "Seçimli aşamaları olmayan bir uzantı"
    Eğer temel isteğe hiçbir seçimli aşama uygulanmazsa, test isteği temel isteği eşler.

![Değiştirici uzantı aşamaları genel bakış][img-phases-mod-overview]

Eğer bir temel istek belirlenmiş bir FAST [test politikası][doc-policy-in-detail]'nı karşılıyorsa, o zaman istek işlenebilmesine izin verilen bir veya daha fazla parametre içerir. Değiştirici uzantı bu parametreler üzerinde işlem yapar:

 1. Her parametre, uzantı aşamalarından geçer ve ilgili test istekleri oluşturulur ve yürütülür.
 2. Uzantı, politikayla uyumlu tüm parametreler işlenene kadar sonraki parametre ile devam eder.    

Aşağıdaki resim, bazı POST parametreleri olan bir POST isteği örneği olarak gösterilmiştir.

![Değiştirici uzantı iş akışı genel bakış][img-mod-workflow]

##  Bir Değiştirilmeyen Uzantının Nasıl Çalıştığı

Bir değiştirilmeyen uzantının işlemi sırasında, temel bir istek tek bir Gönder aşamasından geçer.

Bu aşama sırasında, sadece ana bilgisayar adı veya IP adresi temel isteğin `Host` başlık değerinden türetilir. Sonra, önceden tanımlanmış test istekleri bu hosta gönderilir.

FAST düğümünün aynı `Host` başlık değeri olan birkaç gelen temel istekle karşılaşma olasılığı nedeniyle, bu istekler sadece benzersiz `Host` başlık değerine sahip olan istekleri toplamak üzere implicit Topla aşamasından geçer (bkz. [“Benzersizlik Durumu”][doc-collect-uniq]).

![Değiştirilmeyen uzantı aşamaları genel bakış][img-phases-non-mod-overview]

Bir değiştirilmeyen uzantı çalıştığında, bir veya daha fazla önceden tanımlanmış test isteği, Gönder aşamasında işlemden geçirilen her temel istekte `Host` başlığında belirtilen ana bilgisayara gönderilir:

![Değiştirilmeyen uzantı iş akışı genel bakış][img-non-mod-workflow]


## Uzantıların İstekleri Nasıl İşlediği

### Birden Fazla Uzantı ile Bir İsteği İşleme

Bir FAST düğümü için aynı anda kullanılmak üzere tanımlanmış birkaç uzantı olabilir.
Her gelen temel istek tüm takılı uzantılardan geçecektir.

![Çalışanlar tarafından kullanılan uzantılar][img-workers]

Her zaman için, uzantı tek bir temel isteği işler. FAST, paralel temel istek işlemeyi destekler; alınan her temel istek, işlemeyi hızlandırmak için boş bir işçiye gönderilir. Farklı işçiler, aynı uzantıları farklı temel istekler için aynı anda çalıştırabilir. Uzantı, temel istek temelinde test isteklerinin oluşturulup oluşturulmayacağını belirler.

FAST düğümünün paralel olarak işleyebileceği isteklerin sayısı, işçi sayısına bağlıdır. İşçi sayısı, FAST düğüm Docker konteynerini çalıştırırken `WORKERS` ortam değişkenine atanan değerle belirlenir (varsayılan değişken değeri 10'dur).

!!! info "Test politikası detayları"
    Test politikaları ile çalışmanın daha ayrıntılı bir açıklaması [bağlantı][doc-policy-in-detail]'da bulunabilir.