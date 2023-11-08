# Lista de Verificação de Teste de Aceitação do Usuário Wallarm

Esta seção fornece uma lista de verificação para garantir que sua instância Wallarm está operando corretamente.

| Operação                                                                                                                                                        | Comportamento esperado                   | Verificar |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|--------|
| [Nó Wallarm detecta ataques](#wallarm-node-detects-attacks)                                                                     | Ataques são detectados                |        |
| [Você pode fazer login na interface Wallarm](#you-can-log-into-the-wallarm-interface)                                                 | Você pode fazer login                      |        |
| [Interface Wallarm mostra requisições por segundo](#wallarm-interface-shows-requests-per-second)                                       | Você vê as estatísticas de requisições          |        |
| [Wallarm marca requisições como falsas e para de bloqueá-las](#wallarm-marks-requests-as-false-and-stops-blocking-them)               | Wallarm não bloqueia as requisições |        |
| [Wallarm detecta vulnerabilidades e cria incidentes de segurança](#wallarm-detects-vulnerabilities-and-creates-security-incidents) | Incidentes de segurança são criados      |        |
| [Wallarm detecta perímetro](#wallarm-detects-perimeter)                                                                                   | Escopo é descoberto                 |        |
| [Funciona a permissão de IPs, a lista de negação e a lista cinza](#ip-allowlisting-denylisting-and-graylisting-work)                                                                                         | Endereços IP são bloqueados            |        |
| [Usuários podem ser configurados e têm direitos de acesso adequados](#users-can-be-configured-and-have-proper-access-rights)                   | Usuários podem ser criados e atualizados    |        |
| [O log de atividades do usuário tem registros](#user-activity-log-has-records)                                                                   | O log tem registros                 |        |
| [Relatório funciona](#reporting-works)                                                                                               | Você recebe relatórios                 |        | |

## Wallarm Detecta Ataques

1. Envie uma solicitação maliciosa para seu recurso:

   ```
   http://<URL_do_recurso>/etc/passwd
   ```

2. Execute o seguinte comando para verificar se a contagem de ataques aumentou:

   ```
   curl http://127.0.0.8/wallarm-status
   ```

Veja também [Verificando a operação do nó de filtro](installation-check-operation-en.md)

## Você Pode Fazer Login na Interface Wallarm

1.  Prossiga com o link que corresponde ao cloud que você está usando: 
    *   Se você está usando o cloud dos EUA, prossiga para o link <https://us1.my.wallarm.com>.
    *   Se você está usando o cloud da UE, prossiga para o link <https://my.wallarm.com/>.
2.  Veja se você pode fazer login com sucesso.

Veja também a [Visão geral do Painel de Prevenção de Ameaças](../user-guides/dashboards/threat-prevention.md).

## Interface Wallarm Mostra Requisições por Segundo

1. Envie uma solicitação para seu recurso:

   ```
   curl http://<URL_do_recurso>
   ```
   
   Ou envie várias solicitações com um script bash:

   ```
   for (( i=0 ; $i<10 ; i++ )) ;
   do 
      curl http://<URL_do_recurso> ;
   done
   ```

   Este exemplo é para 10 solicitações.

2. Verifique se a interface Wallarm mostra solicitações detectadas por segundo.

Veja também o [Painel de Prevenção de Ameaças](../user-guides/dashboards/threat-prevention.md).

## Wallarm Marca Requisições como Falsas e Para de Bloquear

1. Expanda um ataque na aba *Ataques*. 
2. Selecione um hit e clique em *Falso*.
3. Espere cerca de 3 minutos.
4. Reenvie a solicitação e verifique se Wallarm a detecta como um ataque e a bloqueia.

Veja também [Trabalhando com ataques falsos](../user-guides/events/false-attack.md).

## Wallarm Detecta Vulnerabilidades e Cria Incidentes de Segurança

1. Certifique-se de ter uma vulnerabilidade aberta em seu recurso.
2. Envie uma solicitação maliciosa para explorar a vulnerabilidade.
3. Verifique se há um incidente detectado na interface Wallarm.

Veja também [Verificando ataques e incidentes](../user-guides/events/check-attack.md).

## Wallarm Detecta Perímetro

1. Na aba *Scanner*, adicione o domínio do seu recurso.
2. Verifique se Wallarm descobre todos os recursos associados ao domínio adicionado.

Veja também [Trabalhando com o scanner](../user-guides/scanner.md).

## Permissão de IPs, Lista de Negação e Lista Cinza Funcionam

1. Aprenda a [lógica principal das listas de IP](../user-guides/ip-lists/overview.md).
2. Adicione endereços IP à [lista de permissões](../user-guides/ip-lists/allowlist.md), [lista de negação](../user-guides/ip-lists/denylist.md) e [lista cinza](../user-guides/ip-lists/graylist.md).
3. Verifique se o nó de filtragem processa corretamente as solicitações originadas dos IPs adicionados às listas.

## Usuários Podem Ser Configurados e Têm Direitos de Acesso Adequados

1. Certifique-se de ter o papel de *Administrador* no sistema Wallarm.
2. Crie, altere a função, desabilite e exclua um usuário conforme descrito em [Configurando usuários](../user-guides/settings/users.md).

Veja também [Configurando usuários](../user-guides/settings/users.md).

## O Log de Atividades do Usuário Possui Registros

1. Vá para *Configurações* –> *Usuários*.
2. Verifique se o *Log de Atividade do Usuário* possui registros.

Veja também [Log de atividade do usuário](../user-guides/settings/audit-log.md).

## Relatórios Funcionam

1. Na guia *Ataques*, coloque uma consulta de pesquisa.
2. Clique no botão de relatório à direita.
3. Coloque seu e-mail e clique novamente no botão de relatório.
5. Verifique se você recebe o relatório.

Veja também [Criando um relatório personalizado](../user-guides/search-and-filters/custom-report.md).
