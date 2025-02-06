[waf-mode-instr]:   ../admin-en/configure-wallarm-mode.md

# API Specification Enforcement Genel Bakış  <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

**API Specification Enforcement**, yüklediğiniz spesifikasyonlara dayalı olarak API'leriniz için güvenlik politikalarını uygulamak üzere tasarlanmıştır. Birincil işlevi, spesifikasyonunuzdaki uç nokta tanımları ile REST API'lerinize yapılan gerçek istekler arasındaki uyumsuzlukları tespit etmektir. Böyle tutarsızlıklar belirlendiğinde, sistem bunları çözmek için önceden tanımlanmış eylemleri gerçekleştirebilir.

![API Specification Enforcement - diagram](../images/api-specification-enforcement/api-specification-enforcement-diagram.png)

## API Specification Enforcement tarafından ele alınan sorunlar

Kuruluşunuz, API aracılığıyla açığa çıkan birçok uygulamayı ve bunlara erişmeye çalışan otomasyon araçları da dahil olmak üzere çok sayıda dış IP'yi kullanabilir. Belirli kaynaklar, hedefler veya davranışlar için özel kısıtlamalar oluşturmak kaynak tüketen bir işlemdir.

API Specification Enforcement, pozitif güvenlik modeli kullanılarak güvenlik çabasını azaltmanıza olanak tanır - spesifikasyon aracılığıyla neyin izinli olduğunu tanımlar, kısa politika seti ile de geri kalanla nasıl başa çıkılacağını belirler.

**API envanterinizi API spesifikasyonu ile kapsamlı bir şekilde tanımladığınız için**:

* Bu spesifikasyonu Wallarm'a yükleyebilirsiniz.
* Birkaç tıklamayla, spesifikasyonda yer almayan veya onlarla çelişen API öğelerine yönelik istekler için politikalar belirleyebilirsiniz.

Ve böylece:

* Özel kısıtlayıcı kurallar oluşturma ihtiyacından kaçınabilirsiniz.
* Bu kuralların kaçınılmaz gerekli güncellemelerinden kaçınabilirsiniz.
* Doğrudan kısıtlayıcı kural yapılandırılmamış saldırıları asla kaçırmazsınız.

## Nasıl çalışır

İstekler, farklı noktalardan spesifikasyonunuza aykırı olabilir:

--8<-- "../include/api-policies-enforcement/api-policies-violations.md"

API Specification Enforcement kullanıldığında, CPU kullanımı normalde yaklaşık yüzde 20 artar.

Kaynak tüketimini sınırlamak için, API Specification Enforcement zaman (50 ms) ve istek boyutu (1024 KB) ile sınırlıdır – bu limitler aşılırsa, isteğin işlenmesi durur ve **Spesifikasyon işleme aşımı** [olayı](viewing-events.md#overlimit-events) **Saldırılar** bölümünde, bu limitlerden birinin aşıldığını belirten bir olay oluşturulur.

!!! info "API Specification Enforcement ve diğer koruma önlemleri"
    API Specification Enforcement isteğin işlenmesini durdurduğunda, bunun Wallarm'un diğer koruma prosedürleri tarafından işlenmediği anlamına gelmediğini unutmayın. Dolayısıyla, eğer bu bir saldırı ise, Wallarm yapılandırmasına uygun olarak kayıt altına alınacak veya engellenecektir.

Limitleri veya Wallarm davranışını (aşım durumlarının izlenmesinden bu tür isteklerin engellenmesine kadar) değiştirmek için [Wallarm Support](mailto:support@wallarm.com) ile iletişime geçin.

API Specification Enforcement'ın düzenlemesini, Wallarm düğümü tarafından gerçekleştirilen olağan [saldırı tespiti](../about-wallarm/protecting-against-attacks.md) işleminin yerine koymadığını, eklediğini unutmayın; bu sayede trafiğiniz hem saldırı işaretlerinin olmaması hem de spesifikasyonunuza uygunluk açısından kontrol edilir.

## Kurulum

API'lerinizi API Specification Enforcement ile korumaya başlamak için, spesifikasyonunuzu yükleyin ve [burada](setup.md) tarif edildiği şekilde politikaları belirleyin.