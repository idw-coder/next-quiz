## Nginxの設定

インストール、起動、自動起動
```bash
sudo dnf install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

**アプリ用ディレクトリの作成**

GitHub Actionsからのデプロイ時にも権限エラーのため所有権を変更
```bash
sudo mkdir -p /var/www/nextjs
sudo chown ec2-user:ec2-user /var/www/nextjs
```

**git**

```bash
sudo dnf install git -y
```

GitHub Actionsではなく一旦手動でクローン→動作確認
```bash
cd /var/www/nextjs
git clone https://github.com/idw-coder/next-quiz.git .
npm install --prefer-offline --no-audit --no-fund
npm run build
npm run start
```

PM2を入れてバックグラウンド
```bash
npm install -g pm2
pm2 start npm --name "nextjs" -- start
pm2 startup
pm2 save
```


Nginxのリバースプロキシ設定
```bash
sudo vi /etc/nginx/conf.d/nextjs.conf
```
```nginx
server {
    listen 80;
    server_name 18.177.141.112;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

テスト、再起動、CentOSではSELinux（セキュリティ機能）がデフォルトで有効になっていて、Nginxが他のポート（3000）に接続するのをブロックしていました。
```bash
sudo nginx -t
sudo systemctl reload nginx
sudo setsebool -P httpd_can_network_connect 1
```

git pull

```bash
cd /var/www/nextjs
git pull
npm run build
pm2 restart nextjs
```

## git action CI/CD

ssh鍵の生成
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions
```

公開鍵をauthorized_keysに追加
```bash
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

秘密鍵をGithubに登録
```bash
cat ~/.ssh/github-actions
```

.github/workflows/deploy.ymlを作成