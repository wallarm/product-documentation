Desteklenen tüm [Wallarm dağıtım seçenekleri][platform] arasında, dağıtım tarafından sağlanan NGINX için DEB/RPM paketleri, Wallarm dağıtımı için şu **kullanım durumlarında** önerilir:

* Altyapınız, konteyner tabanlı yöntemler kullanılmadan bare metal veya sanal makineler üzerine kuruludur. Genellikle, bu kurulumlar Ansible veya SaltStack gibi Kod olarak Altyapı (IaC) araçlarıyla yönetilir.
* Hizmetleriniz, dağıtım tarafından sağlanan NGINX etrafında inşa edilmiştir. Wallarm, bu paketleri kullanarak işlevlerini genişletebilir.