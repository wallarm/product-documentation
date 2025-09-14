# API Attack Surface Management  <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

Wallarm'ın **API Attack Surface Management** (**AASM**) çözümü, API ekosistemine özel tasarlanmış ajan gerektirmeyen bir tespit çözümüdür; harici ana makineleri ve bunların API'lerini keşfetmek, eksik WAF/WAAP çözümlerini belirlemek ve API sızıntıları ile diğer güvenlik açıklarını azaltmak için tasarlanmıştır.

API Attack Surface Management şunları içerir:

* [API Attack Surface Discovery (AASD)](api-surface.md)
* [Güvenlik Sorunları Tespiti](security-issues.md)

![AASM](../images/api-attack-surface/aasm.png)

## Nasıl çalışır

API Attack Surface Management, aşağıdaki bölümlerde açıklanan birden çok otomatik etkinlik sağlar.

### Adım 1: Harici API saldırı yüzeyi keşfi

* [Keşfeder](api-surface.md) harici ana makineleri ve bunların API'lerini (barındırma yapan ör. CDN, IaaS veya PaaS sağlayıcıları dahil).
* IP çözümlemesine dayanarak coğrafi konumları ve veri merkezlerini tanımlar.
* Bir kuruluşun kullanmakta olduğu muhtemel API protokollerine (JSON-API, GraphQL, XML-RPC, JSON-RPC, OData, gRPC, WebSocket, SOAP, WebDav, HTML WEB ve daha fazlası) ilişkin içgörüler sunar.
* İstemeden herkese açık hale getirilmiş özel API spesifikasyonlarını ortaya çıkarır.
* Geliştirme veya dağıtım sırasında eklenen yeni API'leri, gölge API'leri ve yetkisiz uç noktaları tespit etmek için harici API saldırı yüzeyindeki değişiklikleri sürekli izler.
* API saldırı yüzeyinizdeki keşif sonuçları ve değişiklikler hakkında sizi [bildirimlerle](setup.md#notifications) bilgilendirir.

### Adım 2: WAF kapsam keşfi ve testleri

* API'lerin WAF/WAAP ile korunup korunmadığını [keşfeder](api-surface.md).
* WAF/WAAP'ların algılamak üzere yapılandırıldığı tehdit türlerini test eder.
* Keşfedilen her uç nokta için bir [güvenlik puanı](api-surface.md#security-posture) hesaplar.
* WAF yapılandırmalarındaki boşlukları belirler ve raporlar; örneğin OWASP Top 10 güvenlik açıkları için eksik kurallar veya BOLA ve kimlik bilgisi doldurma (credential stuffing) gibi modern API'ye özgü tehditlere yönelik kapsama eksikliği.

### Adım 3: Otomatik API sızıntısı ve güvenlik açığı tespiti

* Harici saldırı yüzeyi haritası keşfedildikten sonra, keşfedilen uygulama ve API'lerle ilgili [API sızıntılarını ve güvenlik açıklarını keşfetmeye](security-issues.md) başlar.
* Güvenlik açıklarını ciddiyetine göre izler ve sınıflandırır; yanlış yapılandırmalar, zayıf şifreleme veya güncel olmayan bağımlılıklar gibi sorunları kategorize ederek düzeltme çalışmalarına etkin öncelik verilmesini sağlar.
* Bulunan sızıntılar ve tespit edilen güvenlik açıkları hakkında sizi [bildirimlerle](setup.md#notifications) bilgilendirir.

## Tespit edilen güvenlik açığı türleri

API Attack Surface Management şunları tespit eder:

* GraphQL yanlış yapılandırmaları
* Bilgi ifşaları (hata ayıklama verileri, yapılandırma dosyaları, günlükler, kaynak kodu, yedekler)
* Hassas API'lerin ifşası (örn. Prometheus metrikleri, durum sayfaları, sistem/hata ayıklama verisi ifşa eden API'ler)
* En yaygın Path traversal, SQLi, SSRF, XSS vb. vakaları
* Uzaktan yönetim arayüzlerinin ifşası (API Gateway'in yönetim arayüzleri dahil)
* Veritabanı yönetim arayüzlerinin ifşası
* SSL/TLS yanlış yapılandırmaları
* API spesifikasyonunun ifşası
* API Anahtarları, PII (kullanıcı adları ve parolalar), yetkilendirme belirteçleri (Bearer/JWT) ve daha fazlasını içeren API sızıntıları
* Güncel olmayan yazılım sürümleri ve bunlara karşılık gelen CVE'ler
* ~2k en popüler web ve API ile ilgili CVE

Açıklamalarla birlikte tam listeyi [burada](security-issues.md#list-of-detected-issues) görebilirsiniz.

## Etkinleştirme ve kurulum

API Attack Surface Management'i kullanmaya başlamak için, API [Attack Surface Management Kurulumu](setup.md) bölümünde açıklandığı şekilde etkinleştirin ve yapılandırın.