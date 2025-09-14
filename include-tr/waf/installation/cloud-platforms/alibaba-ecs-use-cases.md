Desteklenen tüm [Wallarm dağıtım seçenekleri][platform] arasında, Docker image kullanılarak Alibaba Cloud ECS üzerinde Wallarm dağıtımı aşağıdaki **kullanım durumlarında** önerilir:

* Uygulamalarınız mikroservis mimarisinden yararlanıyor ve halihazırda konteynerleştirilmiş olarak Alibaba Cloud ECS üzerinde çalışıyorsa.
* Her bir konteyner üzerinde ince taneli (granüler) kontrol gerekiyorsa, Docker image bu konuda öne çıkar. Geleneksel VM tabanlı dağıtımlarda tipik olarak mümkün olandan daha yüksek düzeyde kaynak izolasyonu sağlar.