[waf-mode-instr]:   ../admin-en/configure-wallarm-mode.md

# API Specification Enforcement Genel Bakış  <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

**API Specification Enforcement**, yüklediğiniz spesifikasyonlara dayanarak API’lerinize güvenlik politikaları uygulamak üzere tasarlanmıştır. Birincil işlevi, spesifikasyonunuzdaki uç nokta açıklamaları ile REST API’lerinize yapılan gerçek istekler arasındaki tutarsızlıkları tespit etmektir. Bu tür tutarsızlıklar belirlendiğinde, sistem bunları ele almak için önceden tanımlanmış eylemler gerçekleştirebilir.

![API Specification Enforcement - diyagram](../images/api-specification-enforcement/api-specification-enforcement-diagram.png)

## API Specification Enforcement tarafından ele alınan sorunlar

Kuruluşunuz API aracılığıyla dışa açık bir dizi uygulama ve bunlara erişmeye çalışan, otomasyon araçları da dahil çok sayıda harici IP kullanıyor olabilir. Bazı kaynaklara, hedeflere veya davranışlara özel olarak bağlı kısıtlamalar oluşturmak kaynak tüketen bir iştir.

API Specification Enforcement, pozitif güvenlik modelinden yararlanarak güvenlik çabasını azaltmayı sağlar - spesifikasyon aracılığıyla neyin izinli olduğunu tanımlar, kısa bir ilke setiyle geri kalan her şeyin nasıl ele alınacağını belirler.

**API envanteriniz API spesifikasyonu ile eksiksiz şekilde açıklanmış olduğundan, şunları yapabilirsiniz**:

* Bu spesifikasyonu Wallarm’a yükleyin.
* Birkaç tıklamayla, spesifikasyonda yer almayan veya ona aykırı olan API öğelerine yönelik isteklere ilişkin ilkeleri belirleyin.

Ve böylece:

* Belirli kısıtlayıcı kurallar oluşturma gereğini ortadan kaldırın.
* Bu kuralların kaçınılmaz gerekli güncellemelerinden kaçının.
* Doğrudan kısıtlayıcı bir kuralın yapılandırılmadığı saldırıları asla kaçırmayın.

## Nasıl çalışır

İstekler spesifikasyonunuzu farklı açılardan ihlal edebilir:

--8<-- "../include/api-policies-enforcement/api-policies-violations.md"

API Specification Enforcement kullanıldığında, CPU tüketimi normalde yaklaşık %20 artar.

Kaynak tüketimini sınırlamak için, API Specification Enforcement zaman (50 ms) ve istek boyutu (1024 KB) ile sınırlara sahiptir - bu sınırlar aşıldığında, isteğin işlenmesini durdurur ve bu sınırlardan birinin aşıldığını belirten, **Specification processing overlimit** [olayını](viewing-events.md#overlimit-events) **Attacks** bölümünde oluşturur.

!!! info "API Specification Enforcement ve diğer koruma önlemleri"
    API Specification Enforcement’ın isteğin işlenmesini durdurmasının, isteğin diğer Wallarm koruma prosedürleri tarafından işlenmediği anlamına gelmediğini unutmayın. Dolayısıyla bir saldırıysa, Wallarm yapılandırmasına uygun olarak kaydedilir veya engellenir.

Sınırları veya Wallarm davranışını (aşım durumlarının izlenmesinden bu tür isteklerin engellenmesine) değiştirmek için [Wallarm Support](mailto:support@wallarm.com) ile iletişime geçin.

API Specification Enforcement’ın, Wallarm node tarafından gerçekleştirilen olağan [saldırı tespitine](../about-wallarm/protecting-against-attacks.md) kendi düzenlemesini eklediğini ve onun yerine geçmediğini unutmayın; böylece trafiğiniz hem saldırı belirtilerinin yokluğu hem de spesifikasyonunuza uygunluk açısından denetlenecektir.

## Kurulum

API’lerinizi API Specification Enforcement ile korumaya başlamak için, spesifikasyonunuzu yükleyin ve [burada](setup.md) açıklandığı şekilde ilkeleri ayarlayın.