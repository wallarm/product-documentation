# Gerenciando os Ativos Expostos da Empresa <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

A seção **Scanner** do Console Wallarm permite que você veja todos os seus ativos públicos, como domínios, endereços IP e portas, que foram descobertos automaticamente pelo Scanner Wallarm.

À medida que o projeto cresce, os recursos aumentam e o controle diminui. Os recursos podem estar localizados fora dos data centers da empresa, o que pode comprometer a segurança. A Wallarm ajuda a avaliar a segurança usando métodos semelhantes aos hackers éticos, dando visibilidade sobre os resultados.

![Seção Scanner](../images/user-guides/scanner/check-scope.png)

## Adicionando ativos

Para acionar a Wallarm para descobrir os ativos expostos da sua empresa, adicione o primeiro ativo público manualmente. Clique em **Add domain or IP** e insira um de seus domínios ou IPs:

![Seção Scanner](../images/user-guides/scanner/add-asset-manually.png)

Após o novo domínio ou endereço IP ser adicionado, o Scanner Wallarm inicia o procedimento de verificação para pesquisar ativos conectados com o recurso e adiciona-os à lista. A Wallarm primeiro verifica as portas e depois detecta os recursos de rede nessas portas.

Vários métodos são usados no processo contínuo de coleta e atualização de ativos expostos:

* Modos automáticos
    * Transferência de zona DNS ([AXFR](https://tools.ietf.org/html/rfc5936))
    * Recebimento de registros NS e MX
    * Recebimento de dados de registros SPF
    * Pesquisa de dicionário de subdomínio
    * Análise de certificado SSL
* Entrada manual de dados via UI do Console Wallarm ou [API Wallarm](../api/overview.md).

Você pode [controlar os métodos de descoberta de ativos](#fine-tuning-asset-scanning) na seção **Configurar**.

## Reservando um domínio

Você pode solicitar à Wallarm para reservar domínios que só podem ser adicionados à lista dos ativos expostos da sua empresa. Para evitar que outras contas adicionem esses domínios, envie uma solicitação de reserva para [support@wallarm.com](mailto:support@wallarm.com).

## Gerenciando ativos

A Wallarm categoriza ativos expostos em grupos de domínios, IPs e serviços. Se um endereço IP pertence a um data center específico, a tag correspondente, como AWS para Amazon ou GCP para Google, é exibida ao lado do ativo.

Ativos recém-descobertos que não foram visualizados por nenhum usuário são exibidos na guia **Novo**, enquanto a guia **Desativado** mostra ativos para os quais a verificação de vulnerabilidade está [desativada](#disabling-vulnerability-scanning-for-certain-assets).

O domínio do recurso, o endereço IP e a porta são interdependentes. Ao selecionar um ativo, você pode ver suas associações, como um domínio associado a um endereço IP selecionado:

![Elemento de escopo com suas associações](../images/user-guides/scanner/asset-with-associations.png)

### Controlando conexões de ativos

Por padrão, ativos de prioridade mais alta permanecem ativos quando os de prioridade mais baixa são desativados. [Desativar](#disabling-vulnerability-scanning-for-certain-assets) um domínio desativa os endereços IP e portas associados. [Excluir](#deleting-assets) um endereço IP exclui as portas associadas, mas mantém o domínio ativo. Ao excluir as conexões de ativos, você pode desativar ou excluir cada um deles individualmente.

Para gerenciar as configurações de verificação de cada ativo independentemente:

1. Selecione um ativo do par de ativos que você precisa desconectar um do outro.
1. Clique no interruptor ao lado do ativo emparelhado com o atual.

    O nome do recurso atual é mostrado em negrito. A UI também exibe a data de sua descoberta.

![Desativar a conexão do recurso](../images/user-guides/scanner/disable-association.png)

Para habilitar a interconexão de ativos, siga as mesmas etapas de quando você estava desativando a interconexão.

### Excluindo ativos

Ao **excluir** ativos, você pode reportar ativos adicionados acidentalmente pela Wallarm à lista. Os ativos excluídos não serão descobertos durante futuras varreduras.

Para recuperar ativos excluídos por engano, entre em contato com a [equipe de suporte Wallarm](mailto:support@wallarm.com).

### Notificações sobre mudanças na lista de ativos expostos

A Wallarm pode enviar a você notificações sobre alterações na lista de ativos expostos: ativos expostos recém-descobertos, desativados e excluídos.

Para receber as notificações, configure as [integrações nativas](settings/integrations/integrations-intro.md) apropriadas com os mensageiros ou sistemas SOAR (por exemplo, PagerDuty, Opsgenie, Slack, Telegram).

Exemplo de mensagem do Slack:

```
[Mensagem de teste] [Parceiro de teste] O perímetro de rede mudou

Tipo de notificação: new_scope_object_ips

Novos endereços IP foram descobertos no perímetro de rede:
8.8.8.8

Cliente: TestCompany
Cloud: EU
```

## Ajustando a varredura de ativo

Para ajustar a varredura de ativos no Wallarm, clique no botão **Configurar**. A partir daí, você pode controlar quais métodos o Scanner Wallarm usa para encontrar os ativos expostos da sua empresa. Por padrão, todos os métodos disponíveis são usados.

![Configuração do Scanner](../images/user-guides/vulnerabilities/scanner-configuration-options.png)

Também existe o interruptor global para o Scanner Wallarm chamado **Funcionalidade básica do Scanner**. Este interruptor habilita ou desabilita o Scanner para toda a conta da sua empresa, controlando tanto o processo de varredura de ativos quanto o de descoberta de vulnerabilidades. Você também pode encontrar o mesmo interruptor na seção **Vulnerabilidades**. Alterar o interruptor em uma seção atualizará automaticamente a configuração na outra seção também.

## Verificando ativos expostos quanto a vulnerabilidades

A Wallarm usa vários métodos para descobrir problemas de segurança na sua infraestrutura, incluindo a verificação de seus ativos expostos para vulnerabilidades típicas. O Scanner verifica automaticamente todos os endereços IP e domínios para vulnerabilidades após coletar os ativos expostos.

A [seção **Vulnerabilidades**](vulnerabilities.md) do Console Wallarm exibe as vulnerabilidades descobertas e permite controlar quais vulnerabilidades devem ser descobertas.

### Desativando a verificação de vulnerabilidades para determinados ativos

Na seção **Scanner**, cada ativo tem um interruptor que permite ligar ou desligar a verificação de vulnerabilidades para aquele ativo específico. O interruptor está localizado à esquerda do ativo que está atualmente selecionado e é exibido em texto em negrito. Você não precisa passar o mouse sobre o elemento para localizar o interruptor.

### Limitando a verificação de vulnerabilidades

O Scanner Wallarm usa solicitações maliciosas de teste para detectar vulnerabilidades nos recursos descobertos com base na resposta do recurso. Para evitar sobrecarregar seus recursos, você pode gerenciar as Solicitações Por Segundo (RPS) e Solicitações Por Minuto (RPM) das solicitações do Scanner Wallarm. O módulo Verificação Ativa de Ameaças também limita as solicitações com base nos valores definidos pelo usuário quando são direcionados a recursos de ativos expostos.

Para definir os mesmos limites para todos os domínios e endereços IP, clique em **Configurar** e defina os valores na seção correspondente.

Para substituir os limites para endereços IP ou domínios específicos:

1. Abra um ativo do tipo **Domínio** ou **IP**.
1. Clique no botão **Definir limites de RPS** e especifique o limite.

    Ao definir RPS para um domínio, você pode definir para cada um dos endereços IP dependentes do domínio, inserindo o valor desejado no campo **RPS por IP**.
1. Clique em **Salvar**.

Para retornar às configurações padrão, use um valor vazio ou insira `0`.

![Configurando o RPS do domínio](../images/user-guides/scanner/set-rps-for-domain.png)

Se vários domínios estiverem associados ao mesmo endereço IP, a velocidade das solicitações para este endereço IP não excederá os limites para o endereço IP. Se vários endereços IP estiverem associados a um domínio, então a velocidade total das solicitações a esses endereços IP dentro deste domínio não excederá os limites para o domínio.