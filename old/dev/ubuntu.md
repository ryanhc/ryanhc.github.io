# Ubuntu

## Apache
### Enable personal public\_html

```sh
sudo a2enmod userdir
sudo service apache2 restart
```

## Samba

### Set up a Samba server
```sh
sudo vi /etc/samba/smb.conf
...
[ryanc]
comment = Ubuntu File Server
path = /home/ryanc
browsable = yes
guest ok = no
read only = no
create mask = 0644
directory mask = 0755

sudo service smbd restart
```

### Automounting a Network Drive
http://ubuntuhandbook.org/index.php/2014/08/map-network-drive-onto-ubuntu-14-04/

## Webdav
### How to setup WebDav on Ubuntu

Tested on Ubuntu 16.04

```sh
# install apache
sudo apt-get install apache2 apache2-utils

# setup directory
sudo mkdir /var/www/webdav
sudo chown -R www-data:www-data /var/www/webdav

# enable apache modules
sudo a2enmod dav
sudo a2enmod dav_fs
sudo a2enmod auth_digest

# setup conf
vi /etc/apache2/sites-available/000-default.conf

<VirtualHost *:80>
ServerAdmin webmaster@localhost
DocumentRoot /var/www/html
ErrorLog ${APACHE_LOG_DIR}/error.log
CustomLog ${APACHE_LOG_DIR}/access.log combined

Alias /webdav /var/www/webdav
<Directory /var/www/webdav>
Options Indexes MultiViews FollowSymLinks
AllowOverride None
Order allow,deny
allow from all
</Directory>
<Location /webdav>
DAV On
AuthType Digest
AuthName "webdav"
AuthUserFile /etc/apache2/webdav.pwd
Require valid-user
</Location>
</VirtualHost>

# add a user account
sudo htdigest -c /etc/apache2/webdav.pwd webdav <userid>
sudo chown www-data:www-data /etc/apache2/webdav.pwd

# restart apache
sudo service apache2 restart
```

## Plex
### Running Plex on Port 80

```sh
vi /etc/apache2/sites-available/000-default.conf
<VirtualHost *:80>
...
<Location /web>
ProxyPass http://localhost:32400/web
ProxyPassReverse http://localhost:32400/web
</Location>

</VirtualHost>

sudo a2enmod proxy
sudo a2enmod proxy_http
sudo service apache2 restart
```

#### Need to verify
```sh
<VirtualHost *:80>
ServerName plex.mydomain.com
redirect / http://mydomain.com:4040/
</VirtualHost>
```
ref: http://stackoverflow.com/questions/12715195/how-to-forward-a-subdomain-to-a
ref: http://matt.coneybeare.me/how-to-map-plex-media-server-to-your-home-domain/


## VNC
http://ubuntuhandbook.org/index.php/2016/07/remote-access-ubuntu-16-04/

http://goodtogreate.tistory.com/entry/%EC%9A%B0%EB%B6%84%ED%88%AC-1604-%EC%9B%90%EA%B2%A9-%EB%8D%B0%EC%8A%A4%ED%81%AC%ED%83%91-%EC%84%A4%EC%A0%95

```sh
sudo apt-get install xrdp
sudo apt-get install mate-core mate-desktop-environment mate-notification-daemon
sudo sed -i.bak '/fi/a #xrdp multiple users configuration \n mate-session \n' /etc/xrdp/startwm.sh
```

