Among all supported [Wallarm deployment options][platform], Google Compute Engine (GCE) üzerinde Docker image kullanılarak yapılan Wallarm dağıtımı şu **kullanım durumları** için önerilir:

* Uygulamalarınız mikroservis mimarisinden yararlanıyor ve zaten konteynerleştirilip GCE üzerinde çalışıyorsa.
* Her bir konteyner üzerinde ince ayarlı kontrol ihtiyacınız varsa, Docker image bu konuda öne çıkar. Bu, geleneksel VM tabanlı dağıtımlarda genellikle mümkün olanın ötesinde bir kaynak izolasyonu seviyesi sağlar.