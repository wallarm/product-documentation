```
apiVersion: v1
kind: ConfigMap
metadata:
  name: wallarm-sidecar-nginx-conf
data:
  default: |
    geo $remote_addr $wallarm_mode_real {
      # Lütfen aşağıdaki <WALLARM_MODE> kelimesini talep filtreleme modu ile değiştirin:
      # işlemeyi devre dışı bırakmak için off
      # talepleri işlemek ama bloklamamak için monitoring
      # tüm talepleri işleyip kötü niyetli olanları bloklamak için block
      default <WALLARM_MODE>;
      # ABD bulut tarayıcıları için IP adresleri ve kurallar
      104.237.151.202 off;104.237.155.105 off;172.104.208.113 off;172.104.21.210 off;172.104.22.150 off;173.255.193.92 off;192.155.82.205 off;192.155.92.134 off;192.81.135.28 off;23.239.30.236 off;23.239.4.41 off;23.92.30.204 off;34.94.218.5 off;34.94.203.193 off;34.94.238.221 off;35.236.1.4 off;35.236.118.146 off;35.236.20.89 off;45.33.15.249 off;45.33.16.32 off;45.33.43.225 off;45.33.65.37 off;45.33.79.18 off;45.33.86.254 off;45.56.113.41 off;45.56.114.24 off;45.56.122.184 off;45.56.71.221 off;45.56.72.191 off;45.79.10.15 off;45.79.115.178 off;45.79.143.18 off;45.79.186.159 off;45.79.194.128 off;45.79.216.187 off;45.79.75.59 off;45.79.75.91 off;45.79.93.164 off;50.116.11.251 off;50.116.42.181 off;66.175.222.237 off;69.164.202.55 off;72.14.184.100 off;74.207.237.202 off;96.126.124.141 off;96.126.127.23 off;88.80.188.20 off;198.58.123.222 off;192.155.84.216 off;23.92.18.193 off;23.92.18.191 off;170.187.207.244 off;198.58.123.201 off;192.155.84.159 off;88.80.188.16 off;170.187.207.246 off;45.56.103.238 off;45.79.142.174 off;45.79.142.244 off;74.207.253.54 off;74.207.253.122 off;45.56.84.94 off;45.79.73.64 off;74.207.253.65 off;74.207.253.161 off;45.33.63.36 off;23.239.21.250 off;45.79.74.89 off;45.79.100.81 off;45.79.100.119 off;45.79.100.174 off;50.116.2.193 off;50.116.2.228 off;50.116.12.25 off;192.155.81.166 off;192.155.81.32 off;192.155.81.97 off;192.155.81.39 off;192.155.81.195 off;192.155.81.173 off;192.155.81.62 off;192.155.81.201 off;192.155.81.193 off;192.155.81.185 off;192.155.81.204 off;192.155.81.210 off;192.155.81.205 off;192.155.81.220 off;139.162.181.97 off;172.104.203.137 off;172.105.78.225 off;34.94.85.217 off;34.94.51.234 off;35.235.100.79 off;34.102.45.38 off;34.94.241.21 off;34.102.59.122 off;34.94.238.72 off;34.102.90.100 off;34.94.156.115 off;35.235.115.105 off;34.94.203.193 off;34.94.238.221 off;34.94.9.235 off;
      # Avrupa bulut tarayıcıları için IP adresleri ve kurallar
      104.200.29.36 off;104.237.151.23 off;139.162.130.123 off;139.162.130.66 off;139.162.132.87 off;139.162.144.202 off;139.162.145.238 off;139.162.146.245 off;139.162.151.10 off;139.162.151.155 off;139.162.153.16 off;139.162.156.102 off;139.162.157.131 off;139.162.158.79 off;139.162.159.137 off;139.162.159.244 off;139.162.162.71 off;139.162.163.61 off;139.162.164.41 off;139.162.166.202 off;139.162.167.19 off;139.162.167.48 off;139.162.167.51 off;139.162.168.17 off;139.162.170.84 off;139.162.171.141 off;139.162.171.208 off;139.162.172.35 off;139.162.174.220 off;139.162.174.26 off;139.162.175.71 off;139.162.176.169 off;139.162.177.83 off;139.162.178.148 off;139.162.179.214 off;139.162.180.37 off;139.162.182.156 off;139.162.182.20 off;139.162.184.225 off;139.162.184.33 off;139.162.185.243 off;139.162.186.129 off;139.162.186.136 off;139.162.187.138 off;139.162.188.246 off;139.162.190.165 off;139.162.190.22 off;139.162.190.86 off;139.162.191.89 off;172.104.128.103 off;172.104.128.67 off;172.104.139.37 off;172.104.146.90 off;172.104.150.243 off;172.104.151.59 off;172.104.152.244 off;172.104.152.28 off;172.104.152.96 off;172.104.154.128 off;172.104.157.26 off;172.104.229.59 off;172.104.233.100 off;172.104.240.115 off;172.104.241.162 off;172.104.250.27 off;172.104.252.112 off;172.105.64.135 off;172.105.65.182 off;173.230.130.253 off;173.230.138.206 off;173.230.156.200 off;173.230.158.207 off;173.255.192.83 off;173.255.200.80 off;173.255.214.180 off;23.239.11.21 off;23.92.18.13 off;34.90.114.30 off;34.91.133.93 off;34.91.54.247 off;34.90.24.155 off;35.204.60.30 off;45.33.105.35 off;45.33.115.7 off;45.33.33.19 off;45.33.41.31 off;45.33.64.71 off;45.33.72.81 off;45.33.73.43 off;45.33.80.65 off;45.33.81.109 off;45.33.88.42 off;45.33.97.86 off;45.33.98.89 off;45.56.102.9 off;45.56.104.7 off;45.56.119.39 off;45.56.69.211 off;45.79.16.240 off;50.116.23.110 off;50.116.35.43 off;50.116.43.110 off;66.228.58.101 off;72.14.181.105 off;72.14.191.76 off;85.90.246.120 off;85.90.246.49 off;176.58.99.236 off;212.71.244.22 off;212.71.244.239 off;176.58.99.214 off;212.71.244.128 off;212.71.244.92 off;178.79.168.193 off;178.79.168.239 off;178.79.168.200 off;178.79.168.201 off;178.79.168.241 off;178.79.168.186 off;
    }
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html index.htm;
        wallarm_mode $wallarm_mode_real;
        # wallarm_instance 1;
        # IP engelleme fonksiyonalitesini etkinleştirmek için
        # aşağıdaki satırın açıklamasını kaldırın
        # wallarm_acl default;
        set_real_ip_from 0.0.0.0/0;
        real_ip_header X-Forwarded-For;
        location / {
                # Lütfen aşağıdaki <APP_CONTAINER_PORT> kelimesini, konteynırın gelen istekleri kabul ettiği port numarasıyla 
                # değiştirin, değer ana uygulama konteynırınızın tanımlamasındaki ports.containerPort ile aynı olmalıdır.
                proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                include proxy_params;
        }
    }
```