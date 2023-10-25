Tüm desteklenen [Wallarm dağıtım seçenekleri][platform] arasında, Docker görüntüsünü kullanarak AWS ECS üzerinde Wallarm'ın dağıtılması, bu **kullanım senaryoları** için önerilir:

* Uygulamalarınız mikroservis mimarisini kullanıyorsa ve zaten AWS ECS üzerinde konteynerleştirilmiş ve operasyonel durumdaysa.
* Her bir konteyner üzerinde ince taneli kontrol gerektiriyorsanız, Docker görüntüsü bu konuda üstündür. Geleneksel VM tabanlı dağıtımlarda genellikle mümkün olanın üzerinde bir kaynak izolasyonu sağlar.