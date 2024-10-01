* Acesso à conta com a função de **Administrador** e autenticação de dois fatores desativada no Console Wallarm para [US Cloud](https://us1.my.wallarm.com/) ou [EU Cloud](https://my.wallarm.com/)
* SELinux desativado ou configurado conforme as [instruções][configure-selinux-instr]
* Execução de todos os comandos como um superusuário (por exemplo, `root`)
* Para processamento de solicitações e pós-análise em servidores diferentes: pós-análise instalada no servidor separado conforme as [instruções][install-postanalytics-instr]
* Acesso a `https://repo.wallarm.com` para baixar os pacotes. Garanta que o acesso não seja bloqueado por um firewall
* Acesso a `https://us1.api.wallarm.com` para trabalho com o US Wallarm Cloud ou a `https://api.wallarm.com` para trabalho com o EU Wallarm Cloud. Se o acesso puder ser configurado apenas via servidor proxy, então use as [instruções][configure-proxy-balancer-instr]
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
* Editor de texto instalado **vim**, **nano** ou qualquer outro. Na instrução, o **vim** é usado