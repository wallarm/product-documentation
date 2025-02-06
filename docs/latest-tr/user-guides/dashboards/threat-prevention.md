# Tehdit Önleme Kontrol Paneli

Belirli bir zaman dilimindeki kötü amaçlı trafik özelliklerini **Threat Prevention** kontrol paneli üzerinden gözden geçirin. Saldırı türleri, kaynaklar, protokoller, kimlik doğrulama yöntemleri vb. açısından kötü amaçlı trafik hacmini ve dağılımını net bir şekilde görün.

Kontrol paneli, tehdit kalıplarını tanımlamada yardımcı olur. Saldırganların sistemi nasıl istismar etmeye çalıştıklarını net bir şekilde görmek, tehditlerin daha hızlı tespit edilmesini ve daha bilinçli yanıtların verilmesini sağlar. Bu durum, genel güvenlik durumu iyileştirmesine katkıda bulunur ve proaktif önlemlerin alınmasına yardımcı olur.

Farklı saldırı türleri (örn. DDoS, SQL injection, brute force) ve protokoller (örn. HTTP, HTTPS, FTP) farklı savunma stratejileri gerektirebileceğinden, saldırı yöntemleri ve trafiğinin dağılımını bilmek, güvenlik ekiplerinin belirli karşı önlemleri (örn. rate-limiting, firewall rules, WAAP configurations vb.) uygulayarak ilave olayların önüne geçmesine olanak tanır.

Bilgiler aşağıdaki widget'lar ile sunulmaktadır:

* İstek karşılaşma hızı
* Normal ve kötü amaçlı trafik
* Belirli bir dönemin özeti
* Saldırı kaynakları
* Saldırı hedefleri
* Saldırı türleri
* CVE'ler
* API protokollerine yönelik saldırılar
* Saldırılarda kimlik doğrulama
* Güvenlik açıkları tarayıcısı

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(55.04% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/atbicsvjibs7" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Dikkate alınız:

* [Hit](../../glossary-en.md#hit) kötü amaçlı bir istek ile node tarafından eklenen meta veridir.
* Bazı lokasyonlar için [traffic filtration mode](../../admin-en/configure-wallarm-mode.md) sadece `monitoring` olarak ayarlanabileceğinden, engellenen hit sayısı tespit edilenlerden az olabilir.
* Saldırı türü açıklamalarını [buradan](../../attacks-vulns-list.md) okuyabilirsiniz.