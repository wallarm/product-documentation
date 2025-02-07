Among all supported [Wallarm deployment options][platform], DEB/RPM packages for distribution-provided NGINX is recommended for Wallarm deployment in these **use cases**:

Tüm desteklenen [Wallarm deployment options][platform] arasında, dağıtım tarafından sağlanan NGINX için DEB/RPM paketleri, Wallarm dağıtımı için bu **use cases** kapsamında önerilmektedir:

* Your infrastructure is based on bare metal or virtual machines without using container-based methods. Typically, these setups are managed with Infrastructure as Code (IaC) tools like Ansible or SaltStack.

* İç altyapınız, konteyner tabanlı yöntemler kullanılmadan bare metal veya sanal makineler üzerine kuruludur. Genellikle bu yapılar, Ansible veya SaltStack gibi Infrastructure as Code (IaC) araçları ile yönetilmektedir.

* Your services are built around distribution-provided NGINX. Wallarm can extend its functionalities using these packages.

* Hizmetleriniz, dağıtım tarafından sağlanan NGINX etrafında inşa edilmiştir. Wallarm, bu paketleri kullanarak işlevselliğini artırabilir.