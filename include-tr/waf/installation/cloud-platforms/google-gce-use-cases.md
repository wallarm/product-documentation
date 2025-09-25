Desteklenen tüm [Wallarm dağıtım seçenekleri][platform] arasında, Docker imajı kullanılarak Google Compute Engine (GCE) üzerinde Wallarm dağıtımı şu **kullanım durumlarında** önerilir:

* Uygulamalarınız mikroservis mimarisinden yararlanıyorsa ve halihazırda konteynerleştirilmiş ve GCE üzerinde çalışır durumdaysa.
* Her bir konteyner üzerinde granüler kontrol gerekiyorsa, Docker imajı öne çıkar. Geleneksel VM tabanlı dağıtımlarda tipik olarak mümkün olandan daha yüksek düzeyde kaynak izolasyonu sağlar.