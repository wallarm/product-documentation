# Wallarm Şirket İçi (On‑Premises) Çözüm Bakımı

Bu belge, şirket içi dağıtımlarda Wallarm Cloud bileşeninin bakımına yönelik rehberlik sağlar. Düzenli bakım faaliyetlerini, sürümleme yaklaşımını, izleme kurulumunu vb. kapsar.

## Süregelen bakım faaliyetlerinin özeti

Şirket içi Wallarm Cloud bileşeni aşağıdaki düzenli bakım faaliyetlerini gerektirir:

1. En son mevcut Wallarm Cloud yama sürümüne hızlı yazılım yükseltmeleri.
1. Yeni kullanıma sunulan majör/minör sürümlere planlı yazılım yükseltmeleri.
1. Bildirilen API saldırılarının yanlış pozitifler açısından gözden geçirilmesi ve gerekli yapılandırma düzeltmelerinin uygulanması.
1. Wallarm Cloud otomatik bildirimlerinin (e‑posta, Slack, SIEM veya yapılandırılmış diğer entegrasyonlar üzerinden iletilen) zamanında gözden geçirilmesi.

## İzleme

Wallarm Cloud, Victoria Metrics, Alertmanager ve Grafana açık kaynak bileşenlerine dayanan yerleşik bir izleme sistemiyle birlikte gelir ve şu şekilde önceden yapılandırılmıştır:

* Veri/metrik dışa aktarıcıları  
* Metrik toplayıcı  
* Tüm kritik Wallarm Cloud iş akışları için bir dizi izleme uyarısı  
* Başlıca sistem ve uygulama metriklerini kapsayan bir dizi Grafana panosu

Varsayılan olarak izleme uyarıları yönetici e‑posta adresine gönderilir.

Dağıtılmış Wallarm çözümünün aşağıdaki parametrelerini izlemek için mevcut kurumsal izleme sisteminizi kullanmanızı öneririz:

1. Wallarm Cloud API uç noktasına HTTPS protokolü üzerinden erişilebilmesi ve hatasız bir HTTP koduyla yanıt vermesi.
1. Dağıtılmış tüm Wallarm Cloud düğümlerinin ICMP ile erişilebilir olması.
1. Yük dengeleyici IP adresinin (yerleşik yazılım yük dengeleyici kullanılıyorsa VIP) ICMP ile erişilebilir olması.
1. Wallarm Filtering Nodes'un gerekli tüm verileri zamanında Wallarm Cloud örneğine yüklemesi ([bu sayfa](../../admin-en/configure-statistics-service.md) kullanılabilir Filtering Node metrikleri hakkında bilgi sağlar).
1. Wallarm Filtering Nodes'un Wallarm Cloud örneğiyle iletişimde herhangi bir hata raporlamaması.

## Yazılım sürümleri

Wallarm Cloud sürümü, kullanılan **wctl** aracının sürümü tarafından belirlenir.

[Wallarm Filtering Node'un sürümleme politikasına](../../updating-migrating/versioning-policy.md) benzer şekilde, Wallarm Cloud bileşeni `MAJOR.MINOR.PATCH-BUILD` yazılım sürümleme şeklini kullanır:

* Wallarm, Wallarm Cloud yazılımının majör sürümünü her 6 ayda bir veya büyük değişiklikler gerektiğinde yayınlar.
* Minör sürümler (mevcut işlevler içinde iyileştirmeler ve yeni yetenekler, büyük yeni kullanım durumları sunmaksızın) aylık olarak yayınlanabilir.
* Yama sürümleri (küçük hata düzeltmeleri veya belirli iyileştirmeler için yamalar) gerektiğinde yayınlanır.

Filtering Node'a benzer şekilde, bazı Wallarm Cloud sürümleri LTS (Uzun Süreli Destek) olarak işaretlenir ve 14 ay boyunca kritik hata ve güvenlik açığı düzeltmeleriyle desteklenir.

Tüm yeni Wallarm şirket içi müşterilerinin başlangıçta Wallarm Cloud yazılımının en son sürümünü (LTS sürümü değil) dağıtması ve yeni Wallarm Cloud sürümlerine mümkün olduğunca hızlı güncellenebilmek için gerekli politika ve süreçleri oluşturması önerilir.

Desteklenen Wallarm Filtering Node ve Wallarm Cloud sürümleri arasında bir bağımlılık olduğunu unutmayın:

* Her Wallarm Cloud yazılım sürümü, bu sürüm tarafından hangi Wallarm Filtering Node sürümlerinin desteklendiğini belgelendirir.
* Genellikle Wallarm Filtering Node'un en güncel sürümü yalnızca en son Wallarm Cloud yazılım sürümü tarafından desteklenir (LTS sürümü değil).

## Yüksek düzey yazılım güncelleme sürecine genel bakış

Aşağıda Wallarm Cloud bileşeni yazılım güncelleme sürecine yüksek düzeyde bir genel bakış yer almaktadır:

1. Wallarm Cloud sürüm notlarını inceleyin ve ortamınıza özel olası riskleri veya yeni unsurları belirleyin (yeni ürün özellikleri, mevcut özelliklerde değişiklikler, hata düzeltmeleri, güncellenmiş Wallarm yapılandırma verileri, güvenlik güncellemeleri vb.).
1. Kuruluşunuzun [değişiklik yönetimi sürecini](https://www.atlassian.com/itsm/change-management) takip ederek yazılım yükseltme prosedürünü uygulamaya yönelik yazılı bir plan hazırlayın ve gözden geçirin. Gerekirse Wallarm ekibinden yardım isteyin.
1. Staging (ön üretim) ortamınızı yükseltin ve önceden tanımlı test kontrol listesini kullanarak sistem işlevselliğini doğrulayın. Tespit edilen API saldırılarının [yanlış pozitiflerine](../../user-guides/events/check-attack.md#false-positives) dikkat edin.
1. Üretim ortamınız için bir bakım penceresi planlayın.
1. Üretim ortamınızı geçici olarak `monitoring` moduna alın (API saldırılarının işlenmesi için `block` [modunu](../../admin-en/configure-wallarm-mode.md) devre dışı bırakın).
1. Üretim ortamınızı yükseltin ve önceden tanımlı test kontrol listesini kullanarak sistem işlevselliğini doğrulayın (özellikle saldırı tespiti ve yanlış pozitifleri kontrol edin).
1. Üretim ortamınızı tekrar `block` moduna alın.
1. Wallarm Cloud DR örneğinizi planlayın ve yükseltin.
1. Yeni güncellenen ortamları belgelendirin.