# Threat Prevention Panosu

Kötü amaçlı trafik özelliklerini belirli bir zaman dilimi için **Threat Prevention** panosuyla inceleyin. Kötü amaçlı trafik hacmine ve saldırı türlerine, kaynaklara, protokollere, kimlik doğrulama yöntemlerine vb. göre dağılımına dair net bir görünüm edinin.

Pano, tehdit kalıplarını belirlemeye yardımcı olur. Saldırganların sistemi nasıl sömürmeye çalıştıklarına dair net bir görünüm, tehditlerin daha hızlı tespit edilmesini ve daha bilinçli karşılıklar verilmesini sağlar. Bu, genel güvenlik duruşunun iyileştirilmesine katkıda bulunur ve proaktif önlemler alınmasına yardımcı olur.

Farklı saldırı türleri (örn. DDoS, SQL injection, brute force) ve protokoller (örn. HTTP, HTTPS, FTP) farklı savunma stratejileri gerektirebileceğinden, saldırı yöntemlerinin ve trafiğin dağılımını bilerek güvenlik ekipleri, daha fazla olayı önleyen belirli karşı önlemleri (örn. rate-limiting, güvenlik duvarı kuralları, WAAP yapılandırmaları, vb.) uygulayabilirler.

Bilgiler aşağıdaki widget’larda sunulur:

* İsteklerle karşılaşma hızı
* Normal ve kötü amaçlı trafik
* Bir dönem özeti
* Saldırı kaynakları
* Saldırı hedefleri
* Saldırı türleri
* CVE'ler
* API protokollerine yönelik saldırılar
* Saldırılarda kimlik doğrulama

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(55.04% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/atbicsvjibs7" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Aşağıdakileri göz önünde bulundurun:

* [Hit](../../glossary-en.md#hit), node tarafından eklenen meta verilerle birlikte kötü amaçlı bir istektir
* Engellenen hits sayısı, bazı konumlar için [trafik filtreleme modu](../../admin-en/configure-wallarm-mode.md) yalnızca `monitoring` olabileceğinden, tespit edilenlerden daha az olabilir
* Saldırı türlerinin açıklamalarını [buradan](../../attacks-vulns-list.md) okuyabilirsiniz