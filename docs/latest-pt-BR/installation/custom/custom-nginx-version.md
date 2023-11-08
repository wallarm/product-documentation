# Pacotes Personalizados NGINX

Se você precisar de pacotes DEB/RPM da Wallarm para uma versão do NGINX que seja diferente da versão estável, NGINX Plus ou da versão do distributivo, você pode solicitar uma construção personalizada da Wallarm seguindo estas instruções.

Por padrão, os pacotes DEB/RPM da Wallarm estão disponíveis para as seguintes versões do NGINX:

* NGINX oficial de código aberto versão `estável` - consulte as [instruções de instalação](../nginx/dynamic-module.md)
* NGINX fornecido pelo distributivo - consulte as [instruções de instalação](../nginx/dynamic-module-from-distr.md)
* NGINX Plus oficial comercial - consulte as [instruções de instalação](../nginx-plus.md)

O módulo Wallarm pode ser integrado com uma construção personalizada do NGINX, incluindo o NGINX `mainline`, ao reconstruir os pacotes Wallarm. Para reconstruir os pacotes, entre em contato com a equipe de [suporte técnico da Wallarm](mailto:support@wallarm.com) e forneça as seguintes informações:

* Versão do kernel do Linux: `uname -a`
* Distributivo Linux: `cat /etc/*release`
* Versão do NGINX:

    * [Construção oficial do NGINX](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * Construção personalizada do NGINX: `<caminho para nginx>/nginx -V`

* Assinatura de compatibilidade:

    * [Construção oficial do NGINX](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
    * Construção personalizada do NGINX: `egrep -ao '.,.,.,[01]{33}' <caminho para nginx>/nginx`

* O usuário (e o grupo do usuário) que está executando os processos de trabalho do NGINX: `grep -w 'user' <path-to-the-NGINX-configuration-files/nginx.conf>`