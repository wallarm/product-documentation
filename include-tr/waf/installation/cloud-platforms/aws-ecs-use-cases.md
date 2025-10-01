Desteklenen tüm [Wallarm dağıtım seçenekleri][platform] arasında, Docker imajı kullanılarak AWS ECS üzerinde Wallarm dağıtımı şu **kullanım durumlarında** önerilir:

* Uygulamalarınız mikroservis mimarisinden yararlanıyor ve zaten konteynerleştirilmiş olup AWS ECS üzerinde çalışıyorsa.
* Her bir konteyner üzerinde ince taneli kontrol gerekiyorsa, Docker imajı bu konuda öne çıkar. Geleneksel VM tabanlı dağıtımlarda tipik olarak mümkün olandan daha yüksek bir kaynak izolasyonu düzeyi sağlar.