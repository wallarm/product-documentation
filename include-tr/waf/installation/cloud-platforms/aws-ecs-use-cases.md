Among all supported [Wallarm deployment options][platform], Docker image kullanılarak AWS ECS üzerinde gerçekleştirilen Wallarm deployment, bu **kullanım durumları** için önerilir:

* Uygulamalarınız mikroservis mimarisini kullanıyor ve AWS ECS üzerinde zaten containerize edilip çalışıyorsa.
* Her bir container üzerinde ayrıntılı kontrol gerektiriyorsa, Docker image öne çıkar. Geleneksel VM tabanlı deploymentlarda tipik olarak mümkün olanın ötesinde bir kaynak izolasyonu sağlar.