[link-aasm-security-issue-risk-level]:  security-issues.md#issue-risk-level
[link-integrations-intro]:              ../user-guides/settings/integrations/integrations-intro.md
[link-integrations-email]:              ../user-guides/settings/integrations/email.md#setting-up-integration

# API Attack Surface Management Kurulumu  <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

Bu makale, harici host’larınızı ve onların API’lerini keşfetmek, eksik WAF/WAAP çözümlerini belirlemek ve API Leaks ile diğer güvenlik açıklarını azaltmak için [API Attack Surface Management](overview.md) özelliğinin nasıl etkinleştirileceğini ve yapılandırılacağını açıklar.

## Etkinleştirme

AASM kullanmak için şirketinizin Wallarm [API Attack Surface](../about-wallarm/subscription-plans.md#api-attack-surface) abonelik planının aktif olması gerekir. Etkinleştirmek için aşağıdakilerden birini yapın:

* Henüz Wallarm hesabınız yoksa, fiyatlandırma bilgilerini alın ve AASM’yi Wallarm’ın resmi sitesinden [buradan](https://www.wallarm.com/product/aasm) etkinleştirin.

    Bu işlem Core (freemium) sürümünü etkinleştirir ve kullanılan e-posta alan adının taraması hemen başlar. Etkinleştirmeden sonra kapsamınıza [ek alan adları ekleyebilirsiniz](setup.md).

    Enterprise özelliklerine ihtiyacınız olmadığı sürece Core sürümünü istediğiniz kadar kullanmaya devam edebilirsiniz. Farklı sürümler arasındaki farkları [buradan](https://www.wallarm.com/product/aasm-pricing) inceleyin.

* Zaten bir Wallarm hesabınız varsa, [sales@wallarm.com](mailto:sales@wallarm.com) adresiyle iletişime geçin.

## Alan adları ve hostlar

### Kapsama ekleme

Seçtiğiniz alan adları altındaki host’ları tespit etmek ve bu host’larla ilgili güvenlik sorunlarını aramak için [API Attack Surface Management](overview.md) yapılandırmasını yapın:

1. Wallarm Console içinde **AASM** → **API Attack Surface** → **Configure** → **Domains and hosts** yolunu izleyin.
1. Alan adlarınızı kapsama ekleyin ve tarama durumunu kontrol edin.

    Yeni eklenen her alan adı için, Wallarm [**Scan configuration**](#scan-configuration) bölümünde seçilen verileri taramaya derhal başlar. Gerekirse devam eden taramayı durdurabilirsiniz, bu işlem tüm sonuçları silecektir.

1. Eklenen alan adları için host’lar otomatik olarak tespit edilir. Gerekirse daha fazla host’u manuel olarak ekleyebilirsiniz: **Add host**’a tıklayın ve host’ları virgül, noktalı virgül, boşluk veya yeni satır ile ayırarak yapıştırın.
1. Bulunan ve eklenen host’lara ilişkin ayrıntıları görmek için alan adına tıklayın.

    ![AASM - kapsamı yapılandırma](../images/api-attack-surface/aasm-scope.png)

### Kapsamdan silme

Alan adlarını kapsamdan silebilirsiniz. Silme işleminde, bu alan adı için daha önce tespit edilen ve manuel olarak eklenen tüm host’lar listeden kaldırılacaktır:

1. **Domains and hosts** sekmesinde, onay kutularıyla alan ad(lar)ını seçin ve **Delete**’e tıklayın.
1. Bu alan adları için bulunmuş güvenlik sorunları olabileceğinden, bunlarla ne yapılacağına karar vermeniz gerekir. Seçenekler:

    * Keep related security issues 
    * Close related security issues
    * Mark false related security issues
    * Delete related security issues

## Scan configuration

Alan adlarınızla ilgili hangi verilerin [API Attack Surface Management](overview.md) tarafından aranacağını ve görüntüleneceğini seçebilirsiniz.

### Genel yapılandırma

Kolaylık sağlaması için Wallarm, tarama yapılandırması için önceden tanımlanmış profil setleri sunar. İçeriklerini anlamak için profiller arasında geçiş yapmayı deneyin.

![AASM - tarama yapılandırması](../images/api-attack-surface/aasm-scan-configuration.png)

Profil açıklamaları (kısa):

| Profil | Açıklama |
| --- | --- |
| **Full** | Tüm türlerde ağ servislerini arayan, WAAP kapsamını tamamen kontrol eden, API sızıntılarını tüm olası yollarla arayan ve tüm güvenlik açığı tespit modülleri etkin olan en kapsamlı tarama. |
| **Fast** | Dış API keşfini hariç tutarak saldırı yüzeyi ve temel sorunlar için hızlı tarama, API sızıntısı aramasında herkese açık HTML/JS içeriğini hariç tutar ve güvenlik açığı tespit modüllerini sınırlar. |
| **Vulnerabilities & API leaks** | Yalnızca güvenlik sorunlarını tespit etmeye yönelik tarama. |
| **Attack surface inventory** | Güvenlik sorunlarını aramadan saldırı yüzeyini hızlıca belirler ve haritalar. |
| **API leaks - passive** | Altyapınızla etkileşim olmadan yalnızca API sızıntılarını arar. |
| **Custom** | Başka bir profile herhangi bir ayarlama yaptığınızda etkinleşir. |

Tarama seçeneklerini yapılandırmak için:

1. Wallarm Console içinde **AASM** → **API Attack Surface** → **Configure** → **Scan configuration** yolunu izleyin.
1. Uygun profili seçin.
1. Gerekirse profil seçeneklerini manuel olarak ayarlayın. Bazı seçeneklerin belirli profillerden çıkarılamayacağını unutmayın.

    !!! warning "Düzenlerken değişikliklerinizi kaybetmeyin"
        Seçeneklerde yaptığınız değişikliklerin, standart profillerden birine tekrar tıklarsanız kaybolacağını unutmayın.

### Subdomain discovery

Bazı durumlarda subdomain discovery’yi devre dışı bırakmak (ör. `example.com` taransın ama `app1.example.com` taranmasın) en uygun seçenek olabilir:

* Alt alan adının sahibi siz değilsiniz (bir iştirak veya şube şirketine ait olabilir)
* Tüm alt alan adları wildcard’dır (rastgele isimli herhangi bir alt alan adı mevcut), sonsuz sayıda alt alan adı
* Tarama performansını ayrıca optimize etmek istiyorsunuz

Yapılandırmanızda subdomain discovery etkin olduğunda (**Scan configuration** → **Scanning profile** → **Network service discovery** → **Subdomain discovery**), bu seçeneği alan adı bazında ayarlayabilirsiniz. Bunu yapmak için:

1. **Domains and hosts** sekmesine gidin.
1. Alan adlarınız için **With subdomains** seçeneğini kapatın/açın.

    Global seçeneğin öncelikli olduğunu unutmayın - devre dışı bırakıldığında hiçbir yerde alt alan adları aranmaz. Global olarak etkinleştirildiğinde, alan adı bazındaki seçenekler istisna tanımlamaya olanak tanır.

## Auto rescan

Auto rescan etkinleştirildiğinde, daha önce eklenen alan adları 7 günde bir otomatik olarak yeniden taranır - yeni host’lar otomatik olarak eklenir, önce listelenmiş olup yeniden taramada bulunamayanlar listede kalır.

Auto rescan’ı yapılandırmak için:

1. Wallarm Console içinde **AASM** → **API Attack Surface** → **Configure** → **Scan configuration** yolunu izleyin ve **Auto rescan** seçeneğini etkinleştirin.
1. **Domains and hosts** sekmesinde, otomatik yeniden taramaya dahil edilecek veya dışlanacak alan adlarını seçin.

    Global seçeneğin öncelikli olduğunu unutmayın - devre dışı bırakıldığında hiçbir şey otomatik olarak yeniden taranmaz. Alan adı bazındaki seçenekler bazı alan adlarını auto rescan’dan hariç tutmanıza olanak tanır.

![AASM - otomatik yeniden taramayı yapılandırma](../images/api-attack-surface/aasm-auto-rescan.png)

## Manuel yeniden tarama

**AASM** → **API Attack Surface** → **Configure** → **Domains and hosts** içinde **Scan now** düğmesine tıklayarak herhangi bir alan adı için taramayı manuel olarak başlatabilirsiniz.

Gerekirse devam eden taramayı durdurabilirsiniz, bu işlem tüm sonuçları silecektir.

## Engellenmenin önlenmesi

Wallarm’a ek olarak, trafiği otomatik olarak filtrelemek ve engellemek için ek olanaklar (yazılım veya donanım) kullanıyorsanız, API Attack Surface Management için IP adreslerini içeren bir [allowlist yapılandırmanız](../admin-en/scanner-addresses.md) önerilir.

Bu, API Attack Surface Management dahil olmak üzere Wallarm bileşenlerinin kaynaklarınızı güvenlik açıkları için sorunsuz bir şekilde taramasını sağlar.

## Tarama durumu

Alan adlarınızın kapsama ne zaman eklendiği ve en son ne zaman tarandığına ilişkin kısa bilgiler **AASM** → **API Attack Surface** → **Configure** → **Domains and hosts** içinde sunulur.

![AASM - kapsam alan adlarının yapılandırılması](../images/api-attack-surface/aasm-scope.png)

Yapılandırma iletişim kutusundan ana **API Attack Surface** ekranına geri dönün, burada **Host scanning status** özetini görebilir, ardından tüm taramaların ayrıntılı geçmişini görmek için **Scanning status** sekmesine geçebilirsiniz. Bu geçmiş şunları içerir:

* Hangi alan adının tarandığı (**Target**).
* Taramanın nasıl başlatıldığı - manuel veya otomatik (**Start-up option**).
* Bu tarama sırasında bulunan host sayısı ve yeni host sayısı.
* Bu tarama sırasında bulunan güvenlik sorunlarının toplamı ve yeni güvenlik sorunlarının sayısı.
* Tarama durumu, başlangıç ve bitiş tarih/saatleri.

![AASM - ayrıntılı tarama durumu](../images/api-attack-surface/aasm-scanning-status.png)

## Bildirimler

--8<-- "../include/api-attack-surface/aasm-notifications.md"