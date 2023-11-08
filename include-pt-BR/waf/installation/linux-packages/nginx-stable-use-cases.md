Entre todas as [opções de implantação do Wallarm][platform] suportadas, os pacotes DEB/RPM para NGINX Stable são recomendados para a implantação do Wallarm nestes **casos de uso**:

* Sua infraestrutura é baseada em um hardware puro ou máquinas virtuais sem o uso de métodos baseados em contêineres. Normalmente, essas configurações são gerenciadas com ferramentas de Infraestrutura como Código (IaC) como Ansible ou SaltStack.
* Seus serviços são construídos em torno do NGINX Stable. O Wallarm pode estender suas funcionalidades usando esses pacotes.