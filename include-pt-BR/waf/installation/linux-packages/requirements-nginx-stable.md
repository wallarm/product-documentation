* Acesso à conta com a função de **Administrador** e autenticação de dois fatores desativada na Consola Wallarm para a [Nuvem US](https://us1.my.wallarm.com/) ou [Nuvem EU](https://my.wallarm.com/)
* SELinux desativado ou configurado de acordo com as [instruções][configure-selinux-instr]
* NGINX versão 1.24.0

    !!! info "Versões personalizadas do NGINX"
        Se você possui uma versão diferente, consulte as instruções sobre [como conectar o módulo Wallarm a uma compilação personalizada do NGINX][nginx-custom]
* Executando todos os comandos como superusuário (por exemplo, `root`)
* Acesso a `https://repo.wallarm.com` para baixar pacotes. Certifique-se de que o acesso não está bloqueado por um firewall
* Acesso a `https://us1.api.wallarm.com` para trabalhar com a Nuvem Wallarm EUA ou a `https://api.wallarm.com` para trabalhar com a Nuvem Wallarm UE. Se o acesso só puder ser configurado via servidor proxy, use as [instruções][configure-proxy-balancer-instr]
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        35.235.66.155
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        34.90.110.226
        ```
* Editor de texto instalado **vim**, **nano**, ou qualquer outro. Na instrução, **vim** é usado