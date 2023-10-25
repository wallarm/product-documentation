Tüm desteklenen [Wallarm dağıtım seçenekleri][platform] arasında, dağıtım tarafından sağlanan NGINX için DEB/RPM paketlerinin kullanılması, aşağıdaki **kullanım durumları** için Wallarm'ın kullanılmasını öneririz:

* Altyapınız, konteyner tabanlı yöntemler kullanmadan çıplak metal veya sanal makineler üzerine kuruludur. Tipik olarak, bu kurulumlar Infrastructure as Code (IaC) araçları olan Ansible veya SaltStack ile yönetilir.
* Hizmetleriniz dağıtım tarafından sağlanan NGINX etrafında oluşturulmuştur. Wallarm, bu paketleri kullanarak işlevlerini genişletebilir.
