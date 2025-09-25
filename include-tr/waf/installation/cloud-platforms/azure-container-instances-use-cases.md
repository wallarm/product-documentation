Desteklenen tüm [Wallarm dağıtım seçenekleri][platform] arasında, Docker image kullanılarak Azure Container Instances üzerinde Wallarm dağıtımı şu **kullanım senaryolarında** önerilir:

* Uygulamalarınız mikroservis mimarisinden yararlanıyor ve zaten konteynerleştirilip Azure Container Instances üzerinde çalışır durumdaysa.
* Her bir konteyner üzerinde granüler kontrol gerekiyorsa, Docker image öne çıkar. Geleneksel VM tabanlı dağıtımlarda tipik olarak mümkün olandan daha yüksek düzeyde kaynak izolasyonu sağlar.