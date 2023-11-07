O Postanalytics usa o armazenamento em memória Tarantool. O banco de dados Tarantool é usado para manter em um buffer circular uma cópia local do fluxo de dados processados por um nó de filtragem, incluindo cabeçalhos de solicitação/resposta e corpos de solicitação (mas não corpos de resposta).

Para tornar um nó de filtragem eficiente, o banco de dados deve manter pelo menos 15 minutos de dados transmitidos com cerca de 2x de sobrecarga para a serialização de dados. Seguindo esses pontos, a quantidade de memória pode ser estimada pela fórmula:

```
Velocidade de processamento de solicitações por minuto em bytes * 15 * 2
```

Por exemplo, se um nó de filtragem está manipulando no pico 50 Mbps de solicitações de usuários finais, o consumo de memória do banco de dados Tarantool necessário pode ser estimado da seguinte forma:

```
50 Mbps / 8 (bits em um byte) * 60 (segundos em um minuto) * 15 * 2 = 11.250 MB (ou ~ 11 GB)
```