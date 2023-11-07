Dentre todas as [opções de implantação da Wallarm][platform] suportadas, os pacotes DEB/RPM para NGINX fornecidos pela distribuição são recomendados para a implantação da Wallarm nestes **casos de uso**:

* Sua infraestrutura é baseada em metal puro ou máquinas virtuais sem o uso de métodos baseados em contêineres. Normalmente, essas configurações são gerenciadas com ferramentas de Infraestrutura como Código (IaC), como Ansible ou SaltStack.
* Seus serviços são construídos em torno do NGINX fornecido pela distribuição. A Wallarm pode estender suas funcionalidades usando esses pacotes.