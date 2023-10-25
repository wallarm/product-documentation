Tüm desteklenen [Wallarm dağıtım seçenekleri][platform] arasında, aşağıdaki **kullanım durumlarında** Docker imajını kullanarak Azure Container Instances üzerinde Wallarm'ın dağıtılması önerilir:

* Eğer uygulamalarınız bir mikro servisler mimarisinden faydalanıyorsa ve zaten Azure Container Instances üzerinde konteynerize edilmiş ve operasyonel durumdaysa.
* Eğer her bir konteynir üzerinde ince ayarlı kontrol gerektiriyorsanız, Docker imajı öne çıkar. Geleneksel VM tabanlı dağıtımlarla genellikle mümkün olanın ötesinde daha fazla kaynak izolasyonu sunar.