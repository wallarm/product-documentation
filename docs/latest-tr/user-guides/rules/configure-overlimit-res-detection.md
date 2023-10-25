# `overlimit_res` saldırı tespitinin ince ayarlarını yapma

Wallarm düğümü, tek bir gelen isteği işlemek için sınırlı bir zaman harcar ve eğer zaman sınırı aşılırsa, isteği [kaynak aşımı (`overlimit_res`)](../../attacks-vulns-list.md#overlimiting-of-computational-resources) saldırısı olarak işaretler. **overlimit_res saldırı tespitini ince ayarla** kuralı, tek bir isteğin işlenmesi için tahsis edilen zaman sınırını ve sınır aşıldığında varsayılan düğüm davranışını özelleştirmenize olanak sağlar.

İsteğin işlenme süresini sınırlamak, Wallarm düğümlerine yönelik geçiş saldırılarını önler. Bazı durumlard, `overlimit_res` olarak işaretlenen istekler, Wallarm düğüm modülleri için ayrılan yetersiz kaynakları ve sonuçta uzun istek işlemeyi gösterebilir.

## Varsayılan düğüm davranışı

Wallarm düğümü, varsayılan olarak tek bir gelen isteği işlemek için **1000 milisaniye**'den fazla zaman harcamamak üzere yapılandırılmıştır.

Eğer zaman sınırı aşılmışsa, Wallarm düğümü:

1. İsteğin işlenmesini durdurur.
1. İsteği `overlimit_res` saldırısı olarak işaretler ve saldırı ayrıntılarını Wallarm Buluta yükler.

    Eğer işlenen istek kısmı ayrıca diğer [saldırı türlerini](../../attacks-vulns-list.md) içeriyorsa, Wallarm düğümü, detayları Buluta yükler.

    İlgili türlerdeki saldırılar Wallarm Konsolunda [etkinlik listesi](../events/check-attack.md)nde görüntülenecektir.
1. <a name="request-blocking"></a>**İzleme** [modu](../../admin-en/configure-wallarm-mode.md)'nda, düğüm orijinal isteği uygulama adresine yönlendirir. Uygulamanın, işlenmiş ve işlenmemiş istek kısımlarına dahil saldırılardan sömürülme riski vardır.

    **Güvenli engelleme** modunda, düğüm, [gri listeye alınmış](../ip-lists/graylist.md) IP adresinden gelirse isteği engeller. Aksi takdirde, düğüm orijinal isteği uygulama adresine yönlendirir. Uygulamanın, işlenmiş ve işlenmemiş istek kısımlarına dahil saldırılardan sömürülme riski vardır.

    **Engelleme** modunda, düğüm isteği engeller.

!!! info "\"Devre Dışı\" modunda istek işleme"
    **Devre dışı** [modu](../../admin-en/configure-wallarm-mode.md)'nda, düğüm gelen trafiği analiz etmez ve dolayısıyla, kaynak aşımına yönelik saldırıları yakalamaz.

## Varsayılan düğüm davranışını değiştirme

!!! warning "Koruma by-pass veya sistem belleğinin tükenme riski"
    * İleri seviye dosya yüklemesinin gerçekleştirildiği, koruma by-pass ve güvenlik açığının sömürülme riskinin olmadığı yalnızca belirli yerlerde varsayılan düğüm davranışını değiştirmenizi öneririz.
    * Yüksek zaman sınırı ve/veya sınırlaştırıldıktan sonra isteğin işlenmesine devam etme, bellek tükenmesine veya zamanı aşan istek işlemesine tetikleyebilir.

**overlimit_res saldırı tespitini ince ayarla** kuralı, varsayılan düğüm davranışını aşağıdaki şekilde değiştirmenizi sağlar:

* Tek bir isteğin işlenmesi üzerinde özel bir limit belirle
* Zaman limiti aşıldığında isteğin işlenmesini durdur veya devam et

    Eğer düğüm, zaman limiti aşıldıktan sonra isteğin işlenmesine devam ediyorsa, istek işlemenin tamamı tamamlanmış olana kadar tespit edilen saldırılara dair verileri yalnızca Buluta yükler.

    Eğer kural, işleme durdurulmasını belirtiyorsa, düğüm zaman limiti aşıldıktan sonra isteğin işlenmesini durdurur. Daha sonra, bir saldırının kaydını ve engelleme modunda olmasını belirlenmedikçe, isteği yönlendirir. Bu durumda, düğüm isteği engeller ve `overlimit_res` saldırısını kaydeder.
* İstek işleme süre limiti aşıldığında `overlimit_res` saldırısını kaydet veya kaydetme

    Eğer düğüm, saldırıyı kaydetmek için yapılandırılmışsa, filtrasyon moduna bağlı olarak [isteği engeller veya uygulama adresine yönlendirir](#request-blocking).

    Eğer düğüm, saldırıyı kaydetmek için yapılandırılmamışsa ve istek diğer saldırı türlerini içermiyorsa, düğüm orijinal isteği uygulama adresine yönlendirir. Eğer istek diğer saldırı türlerini içeriyorsa, düğüm, filtrasyon moduna bağlı olarak isteği engeller veya uygulama adresine yönlendirir.

Kural, aşağıdakilere izin VERMEZ:

* `overlimit_res` saldırıları için engelleme modunu diğer yapılandırmalardan ayrı olarak belirle. Eğer **Kaydet ve olaylarda görüntüle** seçeneği seçilmişse, düğüm, ilgili uç nokta için belirlenen [filtrasyon moduna](../../admin-en/configure-wallarm-mode.md) bağlı olarak `overlimit_res` saldırısını ya engeller veya uygulama adresine yönlendirir.

## Kural örneği

* Kural, her POST isteğinin `https://example.com/upload` işlem süresini 1,020 milisaniyeye kadar artırır. Belirli uç nokta, büyük dosya yükleme işlemlerini gerçekleştirir.
* Düğümün diğer davranış parametreleri varsayılan olarak kalır - eğer düğüm isteği 1,020 milisaniyeden daha uzun süre işlerse, isteğin işlenmesini durdurur ve `overlimit_res` saldırısını kaydeder.

![\"Kaydet ve olaylarda görüntüle\" kural örneği](../../images/user-guides/rules/fine-tune-overlimit-detection-example.png)
