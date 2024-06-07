# Proteção DDoS

Um ataque DDoS (Distributed Denial of Service) é um tipo de ataque cibernético no qual um invasor busca tornar um site ou serviço online indisponível, sobrecarregando-o com tráfego de várias fontes. Este documento descreve recomendações para proteção DDoS e métodos para proteger seus recursos com o Wallarm.

Ataques DDoS são frequentemente lançados a partir de uma rede de sistemas de computador comprometidos, frequentemente referida como botnet. Os invasores usam esses sistemas para enviar um grande volume de tráfego ao alvo, sobrecarregando o servidor e impedindo-o de ser capaz de responder a solicitações legítimas. Ataques DDoS podem ser direcionados a qualquer tipo de serviço online, incluindo sites, jogos online e até plataformas de mídia social.

Existem muitas técnicas que os invasores podem usar para lançar um ataque DDoS, e os métodos e ferramentas que usam podem variar significativamente. Alguns ataques são relativamente simples e usam técnicas de baixo nível, como o envio de um grande número de solicitações de conexão a um servidor, enquanto outros são mais sofisticados e usam táticas complexas como falsificação de endereços IP ou exploração de vulnerabilidades na infraestrutura de rede.

## Taxonomia de ataque DDoS

Existem vários tipos de ataques DDoS que os invasores podem usar para interromper a disponibilidade de um site ou serviço online. Aqui estão os tipos comuns de ataques DDoS:

| Camada OSI / Tipo de Ataque | [Ataques de volume e amplificação](#volum-amplif-attacks) | [Exploits de protocolo e Bombas lógicas](#proto-attacks-logicbombs) |
| ---- | ----------- | -------- |
| L3/L4 | <ul><li>Inundação de UDP: Esses ataques enviam um grande número de pacotes UDP para um alvo na tentativa de consumir a largura de banda disponível e interromper o serviço.</li><li>Inundação ICMP (Ataques Smurf): Esses ataques usam ICMP para enviar um grande número de pacotes de solicitação de eco (comumente conhecidos como solicitações de "ping") para um alvo na tentativa de consumir largura de banda e interromper o serviço.</li></ul> | <ul><li>Inundação de SYN: Esses ataques exploram a maneira como as conexões TCP são estabelecidas. O invasor envia um grande número de pacotes SYN para um alvo, mas nunca conclui o processo de handshake de três vias que é usado para estabelecer uma conexão. Isso pode amarrar os recursos do servidor alvo, pois ele espera pela conclusão do processo de handshake.</li><li>Ping da Morte: Esses ataques enviam pacotes grandes demais para um alvo na tentativa de fazê-lo falhar. Os pacotes são maiores do que o tamanho máximo que o alvo pode processar, e a tentativa de lidar com eles pode fazer o alvo falhar ou se tornar indisponível.</li></ul> |
| L7 | <ul><li>Inundação HTTP: Esses ataques usam um grande número de aparentemente legítimos pedidos GET ou POST para um servidor ou aplicativo da web para sobrecarregar um alvo. Este tipo de ataque é frequentemente realizado usando botnets, que são redes de computadores comprometidos infectados com malware e controlados pelo invasor.</li><li>Ataques de amplificação: Esses ataques exploram o uso de técnicas de amplificação para ampliar o volume de tráfego enviado a um alvo. Por exemplo, um atacante pode enviar uma pequena solicitação a um servidor que responde com uma resposta muito maior, amplificando efetivamente o volume de tráfego que é enviado para o alvo. Existem várias técnicas diferentes que os invasores podem usar para lançar um ataque de amplificação, incluindo: amplificação NTP, amplificação DNS, etc.</li></ul> | <ul><li>Slowloris: Os ataques Slowloris são únicos porque requerem banda mínima e podem ser realizados usando apenas um computador. O ataque funciona iniciando várias conexões concorrentes a um servidor da web e mantendo-as por um período de tempo estendido. O invasor envia solicitações parciais e ocasionalmente as complementa com cabeçalhos HTTP para impedir que elas atinjam uma fase de conclusão.</li></ul>
| Específico de API/App (L7+) | <ul><li>Requisição pesada: Esses ataques usam solicitações especialmente criadas que levam o servidor a enviar uma grande quantidade de dados em resposta. Este tipo de ataque é comumente usado em ataques direcionados porque requer um estudo preliminar de sua aplicação na web e é baseado na exploração de suas vulnerabilidades.</li></ul> | <ul><li>Bomba lógica: Esses ataques usam solicitações especialmente elaboradas que contêm uma grande quantidade de dados e são projetadas para explorar vulnerabilidades durante o processamento da solicitação que levam a um grande consumo de recursos nos sistemas alvo. Existem diferentes tipos de bombas lógicas: Bomba XML, Bomba JSON, etc.</li></ul> |

<a name="volum-amplif-attacks"></a>**Ataques de volume e amplificação** buscam sobrecarregar um alvo com um grande volume de tráfego. O objetivo é saturar a largura de banda ou os recursos de computação do servidor ou rede alvo, tornando-o incapaz de responder a solicitações legítimas.

<a name="proto-attacks-logicbombs"></a>**Explorações de protocolo e Bombas lógicas** são ataques DDoS destinados a explorar vulnerabilidades na forma como um serviço ou rede se comunica. Esses ataques podem interromper o fluxo normal de tráfego, explorando certos protocolos ou enviando pacotes malformados que são difíceis de processar por parte do alvo.

## Mitigação de ataques DDoS

Como os ataques DDoS podem tomar várias formas e alvejar diferentes camadas OSI, medidas simples não são efetivas, é importante usar uma combinação de medidas para fornecer proteção abrangente contra ataques DDoS.

* Provedores de Serviço de Internet e Provedores de Serviço na Nuvem geralmente fornecem a primeira linha de defesa contra ataques DDoS L3-L4. Quanto aos ataques DDoS L3-L4 de alta severidade, são necessárias ferramentas de mitigação adicionais, como:

    O ataque DDoS que gera tráfego a uma taxa de 1 Gbps ou mais pode exigir serviços especializados de proteção DDoS para a limpeza de tráfego. A limpeza de tráfego é uma técnica para rotear o tráfego através de um serviço terceirizado que filtra todo o tráfego malicioso e transfere para o seu serviço apenas as solicitações legítimas. Como uma medida adicional de proteção contra ataques DDoS L3-L4, você também pode usar soluções como NGFW.
* Ataques DDoS L7, também conhecidos como ataques de "camada de aplicação", são mais direcionados e sofisticados do que ataques L3-L4. Tipicamente, ataques DDoS L7 são direcionados às peculiaridades das aplicações atacadas e podem ser difíceis de distinguir do tráfego legítimo. Para proteção contra ataques DDoS L7, use WAF/WAAP ou soluções Anti-DDoS especializadas que analisam o tráfego na camada de aplicação. Também é recomendado configurar o API Gateway ou servidor WEB para ser capaz de lidar com cargas de pico.

Ao escolher medidas de proteção, avalie cuidadosamente as necessidades e recursos da organização com base nos seguintes fatores:

* Tipo de ataques
* Volume de ataques
* Complexidade de uma aplicação web ou API, e seus custos

Também é necessário preparar um plano de resposta para identificar o ataque DDoS o mais rápido possível e tomar contramedidas oportunas para mitigá-los.

## Proteção DDoS L7 com Wallarm

O Wallarm fornece uma ampla gama de medidas de proteção contra ameaças DDoS L7:

* [Prevenção de Abuso de API](../../api-abuse-prevention/overview.md). Ative a funcionalidade Prevenção de Abuso de API para identificar e interromper vários tipos de bots maliciosos.
* [Gatilho de força bruta](protecting-against-bruteforce.md) para prevenir um número massivo de solicitações forçando alguns valores de parâmetros, como senhas.
* [Gatilho de navegação forçada](protecting-against-bruteforce.md) para prevenir tentativas maliciosas de detectar recursos ocultos de um aplicativo da web, nomeadamente diretórios e arquivos.
* Filtragem geográfica usando [listas de negação e de cinza](../../user-guides/ip-lists/overview.md). Previnir o acesso aos aplicativos e APIs de determinadas regiões que distribuem ataques.
* Bloquear origens não confiáveis usando [listas de negação e de cinza](../../user-guides/ip-lists/overview.md). Para proteger contra ataques direcionados, pode ser útil bloquear quaisquer origens não confiáveis (Tor, Proxy, VPN), que permitem ao invasor ocultar a localização e contornar geofiltros.
* Detecção de [bomba lógica (Data)](#data-bomb). O Wallarm detecta automaticamente e bloqueia solicitações maliciosas que contêm uma bomba Zip ou XML.
* Configuração de [limite de taxa](../../user-guides/rules/rate-limiting.md). Especifique o número máximo de conexões que podem ser feitas a um determinado escopo de API. Se uma solicitação exceder o limite definido, o Wallarm a rejeita.

Se você está usando um nó Wallarm baseado em NGINX, é recomendado configurar o NGINX para aprimorar sua segurança em DDoS L7 da seguinte maneira:

* Caching. Configure as respostas de cache para solicitações comuns para absorver parte do tráfego gerado sob ataques DDoS e impedir que ele alcance sua aplicação web ou API.
* Limitação de taxa. Crie regras de limitação de taxa para solicitações de entrada para restringir o volume de tráfego que pode ser enviado a uma aplicação web ou API alvo.
* Limitando o número de conexões. Você pode evitar o uso excessivo de recursos definindo um limite no número de conexões que podem ser abertas por um único endereço IP do cliente para um valor apropriado para usuários reais.
* Fechamento de conexões lentas. Se uma conexão não escrever dados com frequência suficiente, ela pode ser fechada para evitar que permaneça aberta por um período de tempo estendido e possivelmente impeça a capacidade do servidor de aceitar novas conexões.

[Veja exemplos de configuração do NGINX e outras recomendações](https://www.nginx.com/blog/mitigating-ddos-attacks-with-nginx-and-nginx-plus/)

Se você está usando o [Kong-based Ingress controller com os serviços Wallarm](../../installation/kubernetes/kong-ingress-controller/deployment.md), é recomendado seguir as [melhores práticas para assegurar a API Gateway](https://konghq.com/learning-center/api-gateway/secure-api-gateway).
