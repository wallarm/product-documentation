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

Bir uzantının mantığı birkaç aşama kullanılarak açıklanabilir:
1.  [Topla][link-phase-collect]
2.  [Eşleştir][link-phase-match]
3.  [Değiştir][link-phase-modify]
4.  [Üret][link-phase-generate]
5.  [Gönder][link-phase-send]
6.  [Tespit][link-phase-detect]

Bu aşamaları birleştirerek, FAST DSL iki tür uzantıyı tanımlamanıza olanak tanır:
* İlki, gelen bir temel isteğin parametrelerini değiştirerek bir veya daha fazla test isteği oluşturur.

    Bu uzantı, bu kılavuz boyunca “değiştirici uzantı” olarak anılacaktır.

* İkincisi, önceden tanımlanmış test isteklerini kullanır ve gelen temel isteğin parametrelerini değiştirmez.

    Bu uzantı, bu kılavuz boyunca “değiştirmeyen uzantı” olarak anılacaktır.

Her uzantı türü, farklı bir aşama kümesi kullanır. Bu aşamaların bazıları zorunlu, bazıları ise değildir. 

Tespit (Detect) aşamasının kullanımı her uzantı türü için zorunludur. Bu aşama, hedef uygulamanın test isteklerine verdiği yanıtları alır. Uzantı, uygulamada belirli güvenlik açıklarının olup olmadığını belirlemek için bu yanıtları kullanır. Tespit aşamasından elde edilen bilgiler Wallarm Cloud’a gönderilir.

!!! info "İstek öğeleri açıklama sözdizimi"
    Bir FAST uzantısı oluştururken, noktaları kullanarak üzerinde çalışmanız gereken istek öğelerini doğru şekilde tanımlayabilmek için uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlamanız gerekir.
    
    Ayrıntılı bilgi için şu [bağlantıya][link-points] gidin.
 
##  Değiştirici Bir Uzantı Nasıl Çalışır

Bir değiştirici uzantı çalışırken, bir temel istek sırasıyla Topla, Eşleştir, Değiştir ve Üret aşamalarından geçer; bunların tamamı isteğe bağlıdır ve uzantıya dahil edilmeyebilir. Bu aşamalardan geçmenin sonucu olarak tek bir test isteği veya birden fazla test isteği oluşturulur. Bu istekler, güvenlik açıklarını kontrol etmek için hedef uygulamaya gönderilir.

!!! info "İsteğe bağlı aşamalar olmadan bir uzantı"
    Temel isteğe hiçbir isteğe bağlı aşama uygulanmazsa, test isteği temel istekle eşleşir. 

![Değiştirici uzantı aşamalarına genel bakış][img-phases-mod-overview]

Bir temel istek tanımlanmış FAST [test politikasını][doc-policy-in-detail] karşılıyorsa, istek işlenmesine izin verilen bir veya daha fazla parametre içerir. Değiştirici uzantı bu parametreler üzerinde yineleme yapar:

 1. Her parametre uzantı aşamalarından geçer ve ilgili test istekleri oluşturulup yürütülür.
 2. Uzantı, politikaya uyan tüm parametreler işlenene kadar bir sonraki parametreyle devam eder.  

Aşağıdaki görsel, örnek olarak bazı POST parametrelerine sahip bir POST isteğini göstermektedir.

![Değiştirici uzantı iş akışına genel bakış][img-mod-workflow]

##  Değiştirmeyen Bir Uzantı Nasıl Çalışır

Bir değiştirmeyen uzantı çalışırken, temel istek tek bir Gönder (Send) aşamasından geçer.

Bu aşamadayken, yalnızca ana makine adı veya IP adresi, temel isteğin `Host` başlığının değerinden türetilir. Ardından, önceden tanımlanmış test istekleri bu ana makineye gönderilir. 

FAST düğümünün aynı `Host` başlık değerine sahip birden çok gelen temel istekle karşılaşma olasılığı nedeniyle, bu istekler örtük Topla aşamasından geçerek yalnızca benzersiz `Host` başlık değerine sahip istekleri toplar (bkz. [“Benzersizlik Koşulu”][doc-collect-uniq]).

![Değiştirmeyen uzantı aşamalarına genel bakış][img-phases-non-mod-overview]

Bir değiştirmeyen uzantı çalışırken, Gönder aşamasında işlenen her temel isteğin `Host` başlığında belirtilen ana makineye bir veya daha fazla önceden tanımlanmış test isteği gönderilir:

![Değiştirmeyen uzantı iş akışına genel bakış][img-non-mod-workflow]


##  Uzantılar İstekleri Nasıl İşler

### Bir İsteğin Birden Fazla Uzantıyla İşlenmesi

Aynı anda bir FAST düğümü tarafından kullanılmak üzere birkaç uzantı tanımlanabilir.
Her gelen temel istek, takılı olan tüm uzantılardan geçer.

![İşçiler tarafından kullanılan uzantılar][img-workers]

Her anda, uzantı tek bir temel isteği işler. FAST paralel temel istek işlemeyi destekler; alınan temel isteklerin her biri, işlemi hızlandırmak için müsait bir worker’a gönderilir. Farklı worker’lar, farklı temel istekler için aynı uzantıları aynı anda çalıştırabilir. Uzantı, temel isteğe dayanarak test isteklerinin oluşturulup oluşturulmayacağını tanımlar.

FAST düğümünün paralel olarak işleyebileceği istek sayısı, worker sayısına bağlıdır. Worker sayısı, FAST düğümü Docker konteyneri çalıştırılırken ortam değişkeni `WORKERS` için atanan değerle belirlenir (öntanımlı değer 10’dur).

!!! info "Test politikası ayrıntıları"
    Test politikalarıyla çalışmaya ilişkin daha ayrıntılı açıklama şu [bağlantıda][doc-policy-in-detail] mevcuttur.