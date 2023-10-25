Tüm desteklenen [Wallarm dağıtım seçenekleri][platform] arasında, aşağıdaki **kullanım durumlarında** Docker imajını kullanarak Google Compute Engine (GCE) üzerinde Wallarm dağıtımı önerilir:

* Uygulamalarınız bir mikroservis mimarisi kullanıyorsa ve zaten GCE'de konteynerleştirilmiş ve çalışır durumdaysa.
* Her konteyner üzerinde ince ayarlı kontrol gerektiriyorsanız, Docker imajı öne çıkar. Geleneksel VM tabanlı dağıtımlarla genellikle mümkün olanın ötesinde bir kaynak izolasyonu sağlar.