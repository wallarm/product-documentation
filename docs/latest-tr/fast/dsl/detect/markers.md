# İşaretleyicilerle Algılama Aşamasının Nasıl Çalıştığı
İşaretleyiciler, bir test isteği tarafından bir zafiyetin istismar edilip edilmediğini kontrol etmeyi sağlayan kullanışlı araçlardır. İşaretleyiciler, algılama bölümü parametrelerinin çoğuna yerleştirilebilir.

Şu anda, FAST eklemeleri aşağıdaki işaretleyicileri desteklemektedir:
* `STR_MARKER` dizesi işaretleyici, rastgele sembollerden oluşan bir dizedir.

    `STR_MARKER` 'ı yükün bir parçası olarak aktardığınızda, bunu yanıtta algılamak, hedef uygulamada saldırının başarılı olduğu anlamına gelebilir.

    Örneğin, `alert`'in sunucunun yanıt HTML işaretleme dilinde mevcut olması, uygulamanın zafiyete sahip olduğu anlamına gelmez. Sunucu `<alert>` oluşturabilir. Yanıtta `alert` (`STR_MARKER`) mevcudiyeti, bu durumun, dize işaretleyici içeren yüklü test isteğine yanıt olduğu anlamına gelir (yani, zafiyetin istismarı başarılı oldu).

    Dize işaretleyicisi, çoğunlukla XXS zafiyetlerini istismar etmek için kullanılır.

* Sayısal `CALC_MARKER`, zafiyetin istismarı sırasında hesaplanabilecek bir aritmetik ifadedir.

    `CALC_MARKER`'ı yükün bir parçası olarak aktardığınızda, yanıtta hesaplanan ifadenin sonucunu algılamak, hedef uygulamada saldırının başarılı olduğu anlamına gelebilir.

    Sayısal değer, çoğunlukla RCE zafiyetlerini istismar etmek için kullanılır.

* `DNS_MARKER`, `abc123.wlrm.tl` gibi rastgele oluşturulan bir alan adıdır. Hedef uygulama, bu adı bir IP adresine çözmeye çalışabilir.

    `DNS_MARKER`'ı yükün bir parçası olarak aktardığınızda, oluşturulan alan adına DNS isteğini algılamak, hedef uygulamada saldırının başarılı olduğu anlamına gelebilir.