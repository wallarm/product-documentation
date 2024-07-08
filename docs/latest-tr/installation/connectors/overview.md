# Wallarm'ı Konnektörler ile Dağıtmak

API dağıtımı Azion Edge, Akamai Edge, Mulesoft, Apigee ve AWS Lambda gibi dış araçları kullanma dahil olmak üzere çeşitli yöntemlerle gerçekleştirilebilir. Bu API'ları Wallarm ile koruma yolunda arıyorsanız, bu durumlar için özel olarak tasarlanmış "konnektörler" şeklinde bir çözüm sunuyoruz.

## Nasıl çalışır

Çözüm, Wallarm düğümünü dışarıda dağıtmayı ve özel kodu veya politikaları belirli bir platforma enjekte etmeyi içerir. Bu, trafiğin potansiyel tehditlere karşı analiz ve koruma için dış Wallarm düğümüne yönlendirilmesini sağlar. Wallarm'ın konnektörleri olarak adlandırılanlar, platformlar ve dış Wallarm düğümü arasındaki temel bağlantıyı sağlarlar.

Aşağıdaki şema, Wallarm bloklama [modundaki](../../admin-en/configure-wallarm-mode.md) yüksek düzeyli trafik akışını göstermektedir:

![image](../../images/waf-installation/general-traffic-flow-for-connectors.png)

Trafik sıralı bir şekilde analiz edilir, enjekte edilen Wallarm scripti istekleri yakalar ve analiz için düğüme yönlendirir. Düğümden gelen yanıta bağlı olarak, kötü amaçlı aktiviteler engellenir ve yalnızca meşru isteklere API'lara erişime izin verilir.

Alternatif olarak, izleme modu, kullanıcıların web uygulamaları ve API'lerin karşılaşabileceği potansiyel tehditler hakkında bilgi edinmelerini sağlar. Bu modda, trafik akışının mantığı aynı kalır, ancak düğüm saldırıları engellemez, yalnızca onları Wallarm Bulutu'nda kaydeder ve Wallarm Konsolu üzerinden erişilebilir durumda tutar.

## Kullanım durumları

* Azion Edge, Akamai Edge, Mulesoft, Apigee, AWS Lambda veya benzeri bir araçla dağıtılan tüm API'ları güvence altına almak için mevcut alt yapıda yalnızca bir bileşen oluşturarak - kullanılan çözüme bağlı olarak Wallarm kodu/politikası/proxy gibi bir bileşen.
* Kapsamlı saldırı gözlemi, raporlama ve kötü amaçlı isteklerin anında engellenmesi sunan bir güvenlik çözümü gerektiriyor.

## Sınırlamalar

Çözüm, yalnızca gelen isteklerle çalıştığı için belirli sınırlamaları vardır:

* [Pasif algılama](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) yöntemi kullanılarak gerçekleştirilen güvenlik açığı keşfi düzgün çalışmaz. Çözüm, test ettiği güvenlik açıklarına tipik olan kötü amaçlı isteklere sunucu yanıtlarına dayanarak bir API'nin güvenlik açığı olup olmadığını belirler.
* [Wallarm API Keşfi](../../api-discovery/overview.md) yanıt analizine dayandığı için trafiğinize dayalı olarak API envanterinizi keşfedemez.
* Yanıt kodu analizi gerektiren [zorlamalı taramaya karşı koruma](../../admin-en/configuration-guides/protecting-against-bruteforce.md) mevcut değildir.

## Desteklenen dağıtım seçenekleri

Şu anda Wallarm, aşağıdaki platformlar için konnektörler sunmaktadır:

* [Mulesoft](mulesoft.md)
* [Apigee](apigee.md)
* [Akamai EdgeWorkers](akamai-edgeworkers.md)
* [Azion Edge](azion-edge.md)
* [AWS Lamdba](aws-lambda.md)

Aradığınız konnektörü bulamadıysanız, lütfen gereksinimlerinizi görüşmek ve potansiyel çözümleri keşfetmek için [Satış ekibimizle](mailto:sales@wallarm.com) iletişime geçmekten çekinmeyin.