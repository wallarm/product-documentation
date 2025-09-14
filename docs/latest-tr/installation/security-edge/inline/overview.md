# Security Edge Inline Genel Bakış <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

[**Security Edge**](../overview.md) platformu, Wallarm tarafından barındırılan bir ortamda coğrafi olarak dağıtılmış konumlarda Wallarm Nodes konuşlandırmak için yönetilen bir hizmet sağlar. Temel dağıtım seçeneklerinden biri, saha içi kurulum gerektirmeden tüm API altyapınız için gerçek zamanlı, sağlam koruma sunan **inline** dağıtımdır.

![!](../../../images/waf-installation/security-edge/inline/traffic-flow.png)

## Kullanım senaryoları

Aşağıdaki durumlarda API'leri güvence altına almak için ideal bir çözümdür:

* Minimum operasyonel karmaşıklığa sahip, tamamen yönetilen bir güvenlik çözümü arıyorsunuz.
* Trafiği DNS üzerinden Wallarm'a yönlendirebiliyorsunuz.

## Nasıl çalışır

Security Edge Inline ile API trafiğiniz, Wallarm Nodes'ların Wallarm tarafından konuşlandırıldığı, barındırıldığı ve yönetildiği Wallarm'ın küresel olarak dağıtılmış Points of Presence (PoP'ları) üzerinden yönlendirilir.

* DNS tabanlı trafik yönlendirme: DNS'inizi, API alan adlarınızı Wallarm Edge Node'a işaret edecek şekilde yapılandırırsınız.
* PoP seçimi ve yönlendirme: istekler, gecikmeye veya seçtiğiniz bölge(ler)e göre en yakın uygun PoP'a yönlendirilir.
* Gerçek zamanlı inceleme ve filtreleme: inline Node, gelen istekleri analiz eder ve meşru trafiği origin sunucularınıza iletmeden önce kötü amaçlı olanları engeller.
* Çoklu bulut ve çoklu bölge: yüksek kullanılabilirlik ve coğrafi yedeklilik için farklı bulut bölgelerine inline Node'lar konuşlandırabilirsiniz.
* Otomatik ölçeklendirme ve güncellemeler: Wallarm, Node ölçeklendirmesini, güncellemeleri ve bakımı üstlenir - sizin tarafınızdan herhangi bir işlem gerekmez.

## Sınırlamalar

* Yalnızca 64 karakterden kısa alan adları desteklenir.
* Yalnızca HTTPS trafiği desteklenir; HTTP'ye izin verilmez.
* [Özel engelleme kodu](../../../admin-en/configuration-guides/configure-block-page-and-code.md) yapılandırması henüz desteklenmiyor.

## Dağıtım

Security Edge Inline'ı dağıtmak için [adım adım talimatları](deployment.md) izleyin.