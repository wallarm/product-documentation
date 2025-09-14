[img-masking]:              ../../images/user-guides/rules/sensitive-data-rule.png
[rule-creation-options]:    ../../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# Hassas Verilerin Maskelenmesi

[hibrit](../../about-wallarm/shared-responsibility.md#overview) Wallarm kurulumlarında, Wallarm filtreleme düğümlerini kendi altyapınızda siz yönetirken ve Wallarm, Wallarm Cloud bileşenini yönetirken, isteklerinizdeki hassas verilerin altyapınız içinde güvende kalması ve [Wallarm Cloud](../../about-wallarm/overview.md#how-wallarm-works) dahil herhangi bir üçüncü taraf servise iletilmemesi kritik öneme sahiptir. Bu hedef [paylaşılan sorumluluk modeli](../../about-wallarm/shared-responsibility.md) kullanılarak gerçekleştirilir: Wallarm kendi tarafında, hassas verilerin açığa çıkma ihtimalini son derece düşüren, yalnızca kötü amaçlı isteklere ilişkin verileri iletir; sizin tarafınızda ise hassas verilerin maskelenmesi beklenir; bu da korunan bilgi alanlarının güvenlik çevrenizi asla terk etmeyeceğini ek olarak garanti eder.

!!! info "Diğer dağıtım biçimleri"
    **on-premise** [kurulumlarda](../../about-wallarm/shared-responsibility.md#overview) veriler güvenlik çevrenizi asla terk etmezken, **security edge** biçiminde tüm veriler bu güvenlik çevresi dışındadır; yine de Wallarm Console kullanıcılarının hassas verilere erişimini kısıtlamak için maskeleme kurallarını kullanabilirsiniz.

Wallarm, veri maskelemeyi yapılandırmak için **Mask sensitive data** [kuralını](../rules/rules.md) sağlar. Wallarm düğümü Wallarm Cloud’a aşağıdaki verileri gönderir:

* Saldırı içeren serileştirilmiş istekler
* Wallarm sistem sayaçları
* Sistem istatistikleri: CPU yükü, RAM kullanımı vb.
* Wallarm sistem istatistikleri: işlenen NGINX isteklerinin sayısı, wstore istatistikleri vb.
* Uygulama yapısını doğru şekilde tespit etmek için Wallarm’ın ihtiyaç duyduğu trafik doğasına ilişkin bilgiler

**Mask sensitive data** kuralı, isteği postanalytics modülüne ve Wallarm Cloud’a göndermeden önce belirtilen istek noktasının özgün değerini keser. Bu yöntem, hassas verilerin güvenilen ortamın dışına sızamayacağını garanti eder.

Bu, saldırıların görüntülenmesini ve kaba kuvvet (brute force) saldırılarının tespitini etkileyebilir.

## Kural oluşturma ve uygulama

Veri maskesini ayarlamak ve uygulamak için:

--8<-- "../include/rule-creation-initial-step.md"
1. **Change requests/responses** → **Mask sensitive data** öğesini seçin.
1. **If request is** bölümünde, kuralın uygulanacağı kapsamı [açıklayın](rules.md#configuring).
1. **In this part of request** bölümünde, özgün değeri kesilecek [istek noktalarını](request-processing.md) belirtin.
1. [Kuralın derlenmesinin ve filtreleme düğümüne yüklenmesinin tamamlanmasını](rules.md#ruleset-lifecycle) bekleyin.

## Örnek: bir çerez değerinin maskelenmesi

Diyelim ki `example.com` alan adından erişilebilen uygulamanız, kullanıcı kimlik doğrulaması için `PHPSESSID` çerezini kullanıyor ve Wallarm kullanan çalışanların bu bilgiye erişimini engellemek istiyorsunuz.

Bunu yapmak için, **Mask sensitive data** kuralını ekran görüntüsünde gösterildiği gibi ayarlayın.

--8<-- "../include/waf/features/rules/request-part-reference.md"

![Hassas verilerin işaretlenmesi][img-masking]