```
apiVersion: v1
kind: ConfigMap
metadata:
  name: wallarm-sidecar-nginx-conf
data:
  default: |
    geo $remote_addr $wallarm_mode_real {
      # Por favor substitua <WALLARM_MODE> abaixo pelo modo de filtração de solicitação: 
      # desligado para desabilitar o processamento de solicitações
      # monitoramento para processar, mas não bloquear as solicitações
      # bloquear para processar todas as solicitações e bloquear as maliciosas
      default <WALLARM_MODE>;
      # Endereços IP e regras para scanners da nuvem dos EUA
      104.237.151.202 desligado;104.237.155.105 desligado;172.104.208.113 desligado;172.104.21.210 desligado;172.104.22.150 desligado;173.255.193.92 desligado;192.155.82.205 desligado;192.155.92.134 desligado;192.81.135.28 desligado;23.239.30.236 desligado;23.239.4.41 desligado;23.92.30.204 desligado;34.94.218.5 desligado;35.236.1.4 desligado;35.236.118.146 desligado;35.236.20.89 desligado;45.33.15.249 desligado;45.33.16.32 desligado;45.33.43.225 desligado;45.33.65.37 desligado;45.33.79.18 desligado;45.33.86.254 desligado;45.56.113.41 desligado;45.56.114.24 desligado;45.56.122.184 desligado;45.56.71.221 desligado;45.56.72.191 desligado;45.79.10.15 desligado;45.79.115.178 desligado;45.79.143.18 desligado;45.79.186.159 desligado;45.79.194.128 desligado;45.79.216.187 desligado;45.79.75.59 desligado;45.79.75.91 desligado;45.79.93.164 desligado;50.116.11.251 desligado;50.116.42.181 desligado;66.175.222.237 desligado;69.164.202.55 desligado;72.14.184.100 desligado;74.207.237.202 desligado;96.126.124.141 desligado;96.126.127.23 desligado;88.80.188.20 desligado;198.58.123.222 desligado;192.155.84.216 desligado;23.92.18.193 desligado;23.92.18.191 desligado;170.187.207.244 desligado;198.58.123.201 desligado;192.155.84.159 desligado;88.80.188.16 desligado;170.187.207.246 desligado;45.56.103.238 desligado;45.79.142.174 desligado;45.79.142.244 desligado;74.207.253.54 desligado;74.207.253.122 desligado;45.56.84.94 desligado;45.79.73.64 desligado;74.207.253.65 desligado;74.207.253.161 desligado;45.33.63.36 desligado;23.239.21.250 desligado;45.79.74.89 desligado;45.79.100.81 desligado;45.79.100.119 desligado;45.79.100.174 desligado;50.116.2.193 desligado;50.116.2.228 desligado;50.116.12.25 desligado;192.155.81.166 desligado;192.155.81.32 desligado;192.155.81.97 desligado;192.155.81.39 desligado;192.155.81.195 desligado;192.155.81.173 desligado;192.155.81.166 desligado;192.155.81.32 desligado;192.155.81.97 desligado;192.155.81.39 desligado;192.155.81.195 desligado;192.155.81.173 desligado;192.155.81.62 desligado;192.155.81.201 desligado;192.155.81.193 desligado;192.155.81.185 desligado;192.155.81.204 desligado;192.155.81.210 desligado;192.155.81.205 desligado;192.155.81.220 desligado;139.162.181.97 desligado;172.104.203.137 desligado;172.105.78.225 desligado;
      # Endereços IP e regras para scanners da nuvem europeia
      104.200.29.36 desligado;104.237.151.23 desligado;139.162.130.123 desligado;139.162.130.66 desligado;139.162.132.87 desligado;139.162.144.202 desligado;139.162.145.238 desligado;139.162.146.245 desligado;139.162.151.10 desligado;139.162.151.155 desligado;139.162.153.16 desligado;139.162.156.102 desligado;139.162.157.131 desligado;139.162.158.79 desligado;139.162.159.137 desligado;139.162.159.244 desligado;139.162.162.71 desligado;139.162.163.61 desligado;139.162.164.41 desligado;139.162.166.202 desligado;139.162.167.19 desligado;139.162.167.48 desligado;139.162.167.51 desligado;139.162.168.17 desligado;139.162.170.84 desligado;139.162.171.141 desligado;139.162.171.208 desligado;139.162.172.35 desligado;139.162.174.220 desligado;139.162.174.26 desligado;139.162.175.71 desligado;139.162.176.169 desligado;139.162.177.83 desligado;139.162.178.148 desligado;139.162.179.214 desligado;139.162.180.37 desligado;139.162.182.156 desligado;139.162.182.20 desligado;139.162.184.225 desligado;139.162.184.33 desligado;139.162.185.243 desligado;139.162.186.129 desligado;139.162.186.136 desligado;139.162.187.138 desligado;139.162.188.246 desligado;139.162.190.165 desligado;139.162.190.22 desligado;139.162.190.86 desligado;139.162.191.89 desligado;172.104.128.103 desligado;172.104.128.67 desligado;172.104.139.37 desligado;172.104.146.90 desligado;172.104.150.243 desligado;172.104.151.59 desligado;172.104.152.244 desligado;172.104.152.28 desligado;172.104.152.96 desligado;172.104.154.128 desligado;172.104.157.26 desligado;172.104.229.59 desligado;172.104.233.100 desligado;172.104.240.115 desligado;172.104.241.162 desligado;172.104.250.27 desligado;172.104.252.112 desligado;172.105.64.135 desligado;172.105.65.182 desligado;173.230.130.253 desligado;173.230.138.206 desligado;173.230.156.200 desligado;173.230.158.207 desligado;173.255.192.83 desligado;173.255.200.80 desligado;173.255.214.180 desligado;23.239.11.21 desligado;23.92.18.13 desligado;34.90.114.30 desligado;34.91.133.93 desligado;34.91.54.247 desligado;34.90.24.155 desligado;35.204.60.30 desligado;45.33.105.35 desligado;45.33.115.7 desligado;45.33.33.19 desligado;45.33.41.31 desligado;45.33.64.71 desligado;45.33.72.81 desligado;45.33.73.43 desligado;45.33.80.65 desligado;45.33.81.109 desligado;45.33.88.42 desligado;45.33.97.86 desligado;45.33.98.89 desligado;45.56.102.9 desligado;45.56.104.7 desligado;45.56.119.39 desligado;45.56.69.211 desligado;45.79.16.240 desligado;50.116.23.110 desligado;50.116.35.43 desligado;50.116.43.110 desligado;66.228.58.101 desligado;72.14.181.105 desligado;72.14.191.76 desligado;85.90.246.120 desligado;85.90.246.49 desligado;176.58.99.236 desligado;212.71.244.22 desligado;212.71.244.239 desligado;176.58.99.214 desligado;212.71.244.128 desligado;212.71.244.92 desligado;
    }
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html index.htm;
        wallarm_mode $wallarm_mode_real;
        # wallarm_instance 1;
        # Descomente a linha seguinte para habilitar
        # a funcionalidade de bloqueio de IP
        # wallarm_acl default;
        set_real_ip_from 0.0.0.0/0;
        real_ip_header X-Forwarded-For;
        location / {
                # Por favor substitua <APP_CONTAINER_PORT> abaixo pelo número da porta
                # na qual o contêiner aceita solicitações de entrada,
                # o valor deve ser idêntico a ports.containerPort
                # na definição do seu contêiner principal de aplicativo
                proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                include proxy_params;
        }
    }
```