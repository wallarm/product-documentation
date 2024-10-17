* Acesso à conta com a função **Administrador** e autenticação de dois fatores desativada no Console Wallarm para a [Nuvem US](https://us1.my.wallarm.com/) ou [Nuvem EU](https://my.wallarm.com/)
* SELinux desabilitado ou configurado de acordo com as [instruções][configure-selinux-instr]
* Versão NGINX Plus 28 (R28)

    !!! info "Versões personalizadas do NGINX Plus"
        Se você tiver uma versão diferente, consulte as instruções sobre [como conectar o módulo Wallarm à compilação personalizada do NGINX][nginx-custom]
* Execução de todos os comandos como um superusuário (por exemplo, `root`)
* Para processamento de solicitações e pós-análise em servidores diferentes: pós-análise instalada em um servidor separado de acordo com as [instruções][install-postanalytics-instr]
* Acesso a `https://repo.wallarm.com` para baixar pacotes. Certifique-se de que o acesso não está bloqueado por um firewall
* Acesso a `https://us1.api.wallarm.com` para trabalhar com a Nuvem Wallarm US ou `https://api.wallarm.com` para trabalhar com a Nuvem EU Wallarm. Se o acesso só pode ser configurado via servidor proxy, use as [instruções][configure-proxy-balancer-instr]
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
* Editor de texto instalado **vim**, **nano** ou qualquer outro. Na instrução, **vim** é usado.