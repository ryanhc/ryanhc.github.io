# How to setup WebDav on Ubuntu

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
