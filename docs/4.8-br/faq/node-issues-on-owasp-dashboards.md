# Lidando com problemas do nó Wallarm alertados pelos painéis do OWASP

Quando os nós do Wallarm não são atualizados ou enfrentam problemas de sincronização com a Cloud, mensagens de erro aparecem nos [painéis OWASP](../user-guides/dashboards/owasp-api-top-ten.md) indicando problemas que podem impactar a segurança da infraestrutura. Este artigo descreve como lidar com esses problemas.

Nós desatualizados podem carecer de importantes atualizações de segurança, permitindo que o tráfego malicioso contorne as defesas. Problemas de sincronização podem interromper a funcionalidade dos nós, impedindo-os de receber políticas de segurança vitais da Cloud. Esses problemas estão principalmente relacionados à ameaça **OWASP API7 (Má Configuração de Segurança)**, onde uma solução de segurança faltante em qualquer parte da pilha de aplicativos pode tornar o sistema vulnerável. Para prevenir isso, o painel alerta você para problemas de operação do nó, por exemplo:

![Painel OWASP com problemas no nó](../images/user-guides/dashboard/owasp-dashboard-node-issues.png)

Para manter um ambiente seguro, é crucial atualizar regularmente os nós do Wallarm e resolver problemas de sincronização. Aqui estão as instruções sobre como lidar com as mensagens de erro:

1. Se a versão do seu nó Wallarm estiver [no final da vida útil ou se aproximando do fim](../updating-migrating/versioning-policy.md#version-list), recomenda-se atualizar seu nó para a última versão.
1. Se você encontrar problemas com a sincronização da Cloud Wallarm, verifique se as [configurações correspondentes](../admin-en/configure-cloud-node-synchronization-en.md) estão corretas.

Se você precisar de assistência para resolver problemas de sincronização ou outros problemas ou qualquer outro pedido, poderá procurar ajuda da [equipe de suporte da Wallarm](mailto:support@wallarm.com). Forneça a eles os seguintes [registros](../admin-en/configure-logging.md) para análise:

* Registros de `/var/log/wallarm/syncnode.log` para verificar se há algum problema com o script `syncnode`
* Registros do diretório `/var/log/syslog` ou `/var/log/messages` (dependendo da opção de implantação) para fornecer detalhes adicionais sobre o problema de sincronização
