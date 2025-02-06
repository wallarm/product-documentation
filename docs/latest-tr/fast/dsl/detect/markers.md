# Detect Aşaması Marker'lar ile Nasıl Çalışır
Marker'lar, test isteği tarafından bir güvenlik açığının kullanılıp kullanılmadığını kontrol etmeyi sağlayan faydalı araçlardır. Marker'lar, detect bölümündeki parametrelerin çoğuna eklenebilir.

Şu anda, FAST extensions aşağıdaki marker'ları desteklemektedir:
* The `STR_MARKER` string marker, rastgele sembollerden oluşan bir dizedir.
    
    `STR_MARKER` yükün bir parçası olarak aktarılırsa, yanıt içerisinde tespit edilmesi, hedef uygulamadaki saldırının başarılı olduğu anlamına gelebilir.
    
    Örneğin, sunucunun yanıt HTML işaretlemesinde `alert`'in bulunması, mutlaka uygulamanın güvenlik açığına sahip olduğu anlamına gelmez. Sunucu `<alert>`'i kendisi oluşturabilir. Yanıttaki `alert`'in (`STR_MARKER`) bulunması, bu yanıtın dize marker'ı içeren yükü barındıran test isteğine ait olduğunu gösterir (yani, güvenlik açığının kullanımı başarılı olmuştur).
    
    String marker, genellikle XXS güvenlik açıklarını kullanmak için tercih edilir.

* The numerical `CALC_MARKER` saldırı sırasında hesaplanabilen aritmetik bir ifadedir.
    
    `CALC_MARKER` yükün bir parçası olarak aktarılırsa, hesaplanan ifadenin sonucunun yanıt içerisinde tespit edilmesi, hedef uygulamadaki saldırının başarılı olduğu anlamına gelebilir.
    
    Numerical marker, genellikle RCE güvenlik açıklarını kullanmak için tercih edilir.

* The `DNS_MARKER` rastgele oluşturulan bir alan adıdır, örneğin `abc123.wlrm.tl`. Hedef uygulama, bu adı bir IP adresine çözümlemeye çalışabilir.
    
    `DNS_MARKER` yükün bir parçası olarak aktarılırsa, oluşturulan alan adına yönelik DNS isteğinin tespit edilmesi, hedef uygulamadaki saldırının başarılı olduğu anlamına gelebilir.