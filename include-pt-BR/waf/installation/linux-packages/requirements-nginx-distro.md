* Acesso à conta com a função de **Administrador** e autenticação de dois fatores desativada na Console Wallarm para a [Nuvem EUA](https://us1.my.wallarm.com/) ou [Nuvem UE](https://my.wallarm.com/)
* SELinux desativado ou configurado de acordo com as [instruções][configure-selinux-instr]
* Execução de todos os comandos como superusuário (por exemplo, `root`)
* Acesso a `https://repo.wallarm.com` para baixar pacotes. Certifique-se de que o acesso não está bloqueado por um firewall
* Acesso a `https://us1.api.wallarm.com` para trabalhar com a Nuvem Wallarm EUA ou a `https://api.wallarm.com` para trabalhar com a Nuvem Wallarm UE. Se o acesso pode ser configurado apenas via servidor proxy, então use as [instruções][configure-proxy-balancer-instr]
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        ```
* Editor de texto instalado **vim**, **nano**, ou qualquer outro. Na instrução, **vim** é usado