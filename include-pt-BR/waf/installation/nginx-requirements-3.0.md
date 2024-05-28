* Acesso à conta com a função de **Administrador** ou **Deploy** e autenticação de dois fatores desativada no Wallarm Console para a [Nuvem dos EUA](https://us1.my.wallarm.com/) ou [Nuvem da UE](https://my.wallarm.com/)
* SELinux desativado ou configurado conforme as [instruções][configure-selinux-instr]
* Execução de todos os comandos como superusuário (por exemplo, `root`)
* Para o processamento de solicitações e pós-análises em servidores diferentes: pós-análise instalada no servidor separado conforme as [instruções][install-postanalytics-instr]
* Acesso a `https://repo.wallarm.com` para baixar pacotes. Garanta que o acesso não seja bloqueado por um firewall
* Acesso a `https://us1.api.wallarm.com:444` para trabalhar com a Wallarm Cloud dos EUA ou a `https://api.wallarm.com:444` para trabalhar com a Wallarm Cloud da UE. Se o acesso puder ser configurado apenas através do servidor proxy, use as [instruções][configure-proxy-balancer-instr]
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