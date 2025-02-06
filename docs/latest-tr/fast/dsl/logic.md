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

Uzantının mantığı, birkaç aşama kullanılarak tanımlanabilir:
1.  [Topla][link-phase-collect]
2.  [Eşleştir][link-phase-match]
3.  [Değiştir][link-phase-modify]
4.  [Oluştur][link-phase-generate]
5.  [Gönder][link-phase-send]
6.  [Tespit Et][link-phase-detect]

Bu aşamaların birleştirilmesiyle, FAST DSL iki uzantı türünü tanımlamanıza olanak tanır:
* İlki, gelen temel isteğin parametrelerini değiştirerek bir veya daha fazla test isteği oluşturur.

    Bu uzantı, bu kılavuzda “değiştiren uzantı” olarak anılacaktır.

* İkincisi, önceden tanımlanmış test isteklerini kullanır ve gelen temel isteğin parametrelerini değiştirmez.

    Bu uzantı, bu kılavuzda “değiştirmeyen uzantı” olarak anılacaktır.

Her uzantı türü, farklı aşamalar kümesini kullanır. Bu aşamalardan bazıları zorunludur, bazıları ise değildir.

Tespit Et aşamasının kullanımı, her uzantı türü için zorunludur. Bu aşama, test isteklerine verilen hedef uygulamanın yanıtlarını alır. Uzantı, bu yanıtlardan uygulamada belirli açıklar olup olmadığını tespit eder. Tespit Et aşamasındaki bilgiler, Wallarm Cloud'a gönderilir.

!!! info "İstek öğelerinin açıklama sözdizimi"
    FAST uzantısı oluştururken, uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlamanız gerekir; bu sayede çalışmanız gereken istek öğelerini noktalarla doğru şekilde tanımlayabilirsiniz.
    
    Ayrıntılı bilgi için, bu [link][link-points]'e gidiniz.
 
##  Değiştiren Uzantı Nasıl Çalışır

Değiştiren bir uzantı çalışması sırasında, temel istek sırasıyla Topla, Eşleştir, Değiştir ve Oluştur aşamalarından geçer; bu aşamaların tümü isteğe bağlıdır ve uzantıya dahil edilmeyebilir. Bu aşamalardan geçilmesi sonucunda tek bir test isteği veya birden fazla test isteği oluşturulur. Bu istekler, hedef uygulamadaki açıkları kontrol etmek için gönderilir.

!!! info "İsteğe bağlı aşamalar olmadan bir uzantı"
    Eğer temel isteğe isteğe bağlı aşamalar uygulanmazsa, test isteği temel istek ile eşleşir. 

![Değiştiren uzantı aşamaları görünümü][img-phases-mod-overview]

Eğer temel istek, tanımlı bir FAST [test politikası][doc-policy-in-detail] koşulunu sağlıyorsa, istekte işleme alınmasına izin verilen bir veya daha fazla parametre bulunur. Değiştiren uzantı bu parametreler arasında döner:

 1. Her parametre, uzantı aşamalarından geçer ve ilgili test istekleri oluşturulup çalıştırılır.
 2. Uzantı, politikaya uygun tüm parametreler işlenene kadar sonraki parametreye geçer.  

Aşağıdaki görüntü, örnek olarak bazı POST parametreleri içeren bir POST isteğini göstermektedir.

![Değiştiren uzantı iş akışı görünümü][img-mod-workflow]

##  Değiştirmeyen Uzantı Nasıl Çalışır

Değiştirmeyen bir uzantı çalışması sırasında, temel istek tek bir Gönder aşamasından geçer.

Bu aşama sırasında, temel isteğin `Host` başlık değerinden yalnızca ana makine adı türetilir. Ardından, önceden tanımlanmış test istekleri bu ana makineye gönderilir. 

FAST düğümünün, aynı `Host` başlık değerine sahip birkaç gelen temel istekle karşılaşma ihtimali nedeniyle, bu istekler yalnızca benzersiz `Host` başlık değeri içerenleri toplamak için örtük Topla aşamasından geçer (bkz. [“Benzersizlik Koşulu”][doc-collect-uniq]).

![Değiştirmeyen uzantı aşamaları görünümü][img-phases-non-mod-overview]

Değiştirmeyen bir uzantı çalıştığında, Gönder aşamasında işlenen her temel isteğin `Host` başlığında belirtilen ana makineye, bir veya daha fazla önceden tanımlanmış test isteği gönderilir:

![Değiştirmeyen uzantı iş akışı görünümü][img-non-mod-workflow]


##  Uzantılar İstekleri Nasıl İşler

### Birden Fazla Uzantı ile Bir İsteğin İşlenmesi

FAST düğümünde aynı anda kullanılmak üzere birden fazla uzantı tanımlanabilir.
Her gelen temel istek, bağlı olan tüm uzantılardan geçecektir.

![İşçiler tarafından kullanılan uzantılar][img-workers]

Her an, uzantı yalnızca tek bir temel isteği işler. FAST, paralel temel istek işlemesini destekler; alınan her temel istek, işlemin hızlandırılması için boş bir işçiye gönderilir. Farklı işçiler, farklı temel istekler için aynı uzantıları aynı anda çalıştırabilir. Uzantı, test isteklerinin temel istek bazında oluşturulup oluşturulmayacağını belirler.

FAST düğümünün paralel işleyebileceği istek sayısı, işçi (worker) sayısına bağlıdır. İşçi sayısı, FAST düğümünün Docker konteyneri çalıştırılırken `WORKERS` çevresel değişkenine atanan değerle belirlenir (varsayılan değer 10'dur).

!!! info "Test politikası ayrıntıları"
    Test politikaları ile çalışma hakkında daha detaylı açıklama, [link][doc-policy-in-detail] üzerinden mevcuttur.