# Compatibilidade do nó de filtragem Wallarm com versões do NGINX

Se a versão do NGINX instalada em seu ambiente for diferente da estável, Plus ou daquela instalada a partir do repositório Debian/CentOS, aprenda como instalar o Wallarm a partir deste documento.

## O nó de filtragem Wallarm é compatível com o NGINX mainline?

Não, o nó de filtragem Wallarm é incompatível com o NGINX `mainline`. Você pode instalar o nó Wallarm das seguintes maneiras:

* conectar-se ao NGINX `estável` de código aberto oficial seguindo estas [instruções](../installation/nginx/dynamic-module.md)
* conectar-se ao NGINX instalado a partir de repositórios Debian/CentOS seguindo estas [instruções](../installation/nginx/dynamic-module-from-distr.md)
* conectar-se ao NGINX Plus comercial oficial seguindo estas [instruções](../installation/nginx-plus.md)

## O nó de filtragem Wallarm é compatível com a compilação personalizada do NGINX?

Sim, o módulo Wallarm pode ser conectado à compilação personalizada do NGINX após a reconstrução dos pacotes Wallarm. Para reconstruir os pacotes, entre em contato com a [equipe de suporte técnico da Wallarm](mailto:support@wallarm.com) e envie os seguintes dados:

* Versão do kernel do Linux: `uname -a`
* Distribuição Linux: `cat /etc/*release`
* Versão do NGINX:

    * [Compilação oficial do NGINX](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * Compilação personalizada do NGINX: `<caminho para o nginx>/nginx -V`

* Assinatura de compatibilidade:
  
      * [Compilação oficial do NGINX](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * Compilação personalizada do NGINX: `egrep -ao '.,.,.,[01]{33}' <caminho para o nginx>/nginx`

* O usuário (e o grupo do usuário) que está executando os processos de trabalho do NGINX: `grep -w 'user' <caminho-para-os-arquivos-de-configuração-do-NGINX/nginx.conf>`