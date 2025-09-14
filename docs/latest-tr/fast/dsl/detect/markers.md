# Tespit Aşaması İşaretçilerle Nasıl Çalışır
İşaretçiler, bir güvenlik açığının test isteği tarafından istismar edilip edilmediğini kontrol etmeyi sağlayan kullanışlı araçlardır. İşaretçiler, tespit bölümündeki parametrelerin büyük çoğunluğuna yerleştirilebilir.

Şu anda, FAST uzantıları aşağıdaki işaretçileri destekler:
* `STR_MARKER` dizge işaretçisi, rastgele sembollerden oluşan bir metin dizgesidir. 
    
    Yükün bir parçası olarak `STR_MARKER` iletildiğinde, bunun yanıtta tespit edilmesi hedef uygulamaya yönelik saldırının başarılı olduğu anlamına gelebilir.
    
    Örneğin, sunucunun yanıtının HTML işaretlemesinde `alert` bulunması, uygulamada güvenlik açığı olduğu anlamına gelmeyebilir. Sunucu `<alert>` ifadesini kendi başına üretebilir. Yanıtta `alert` (`STR_MARKER`) bulunması, bunun, dizge işaretçisini içeren yükü barındıran test isteğine verilen yanıt olduğunu ifade eder (yani, güvenlik açığının istismarı başarılı olmuştur). 
    
    Dizge işaretçisi çoğunlukla XXS güvenlik açıklarını istismar etmek için kullanılır.

* Sayısal `CALC_MARKER`, güvenlik açığının istismarı sırasında hesaplanabilecek bir aritmetik ifadedir.  
      
    Yükün bir parçası olarak `CALC_MARKER` iletildiğinde, hesaplanan ifadenin sonucunun yanıtta tespit edilmesi hedef uygulamaya yönelik saldırının başarılı olduğu anlamına gelebilir.
    
    Bu sayısal işaretçi çoğunlukla RCE güvenlik açıklarını istismar etmek için kullanılır.

* `DNS_MARKER`, `abc123.wlrm.tl` gibi rastgele oluşturulan bir alan adıdır. Hedef uygulama bu adı bir IP adresine çözümlemeyi deneyebilir.
    
    Yükün bir parçası olarak `DNS_MARKER` iletildiğinde, oluşturulan alan adına yönelik DNS isteğinin tespit edilmesi hedef uygulamaya yönelik saldırının başarılı olduğu anlamına gelebilir.