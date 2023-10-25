Tüm desteklenen [Wallarm dağıtım seçenekleri][platform] arasında, şu **kullanım durumlarında** Wallarm'ın dağıtılması için NGINX Stable için DEB / RPM paketleri önerilmektedir:

* Altyapınız, konteyner tabanlı yöntemler kullanmadan çıplak metal veya sanal makineler üzerine kurulmuştur. Tipik olarak, bu ayarlar Ansible veya SaltStack gibi Altyapı kodu olarak (IaC) araçları ile yönetilir.
* Hizmetleriniz NGINX Stable etrafında inşa edilmiştir. Wallarm, bu paketleri kullanarak işlevselliğini genişletebilir.