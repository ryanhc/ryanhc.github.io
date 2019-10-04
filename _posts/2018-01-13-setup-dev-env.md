---
layout: post
title:  "Development Settings"
date:   2018-01-13 00:00:00
update: 2018-05-01 00:00:00
categories: dev
---

This page describes my development settings that I use everyday.
It also serves me as a reminder page to use when setting up a new work environment.

The content is tested on Ubuntu 16.04.

<!--
image: /assets/article_images/2014-11-30-mediator_features/night-track.JPG
image2: /assets/article_images/2014-11-30-mediator_features/night-track-mobile.JPG
-->


## SpaceVim setup

Ubuntu 16.04: If you use ``terminator``, update it to the lastest using PPA.
Otherwise, some features of SpaceVim will be broken due to the bugs and missing
features of the stock ``terminator``.

Also, consider using vim-gtk3 to make it easier to interact with the system's
clipboard.

```sh
sudo apt install vim-gtk3
```

### More language support
Add the following to support markdown preview.

TODO: The HTML support is not satisfying. Need to find a better
way of writing HTML tags in vim.

```sh
vi ~/.SpaceVim.d/init.vim
# Markdown
call SpaceVim#layers#load('lang#markdown')

# html
call SpaceVim#layers#load('lang#html')
```

```sh
# Markdown
npm -g install remark
npm -g install remark-cli
npm -g install remark-stringify

# html
npm -g install vscode-html-languageserver-bin
```

Use the following keybindings to preview the markdown.

| Key      | mode   | description                |
|----------|--------|----------------------------|
| SPC l p  | Normal | Real-time markdown preview |
| SPC l ft | Normal | Format table under cursor  |
| SPC b f  | Normal | Format current buffer      |



## nginx

```sh
sudo add-apt-repository ppa:nginx/development
sudo apt-get update && sudo apt-get install nginx-full
sudo usermod -a -G www-data ryanc
```

### WebDav

```sh
sudo htpasswd -c /etc/nginx/.htpasswd ryanc
vi /etc/nginx/sites-available/default

server {
  ...
  index index.html index.php;
  charset utf-8
  client_body_temp_path /var/www/html/dav/temp;

  location /webdav {
    alias /home/$remote_user;
    autoindex on;
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
    dav_methods PUT DELETE MKCOL COPY MOVE;
    dav_ext_methods PROPFIND OPTIONS;
    dav_access user:rw group:rw all:r;
  }
}

sudo service nginx reload
```

## Samba
### Set up a Samba server
```sh
man smb.conf # very useful
sudo vi /etc/samba/smb.conf
...
[ryanc]
comment = Ubuntu File Server
path = /home/ryanc
valid users = ryanc
writable = yes
create mask = 0644
force create mode = 0644
directory mask = 0755
force directory mode = 0755

sudo test parm # check samba config file for any errors
sudo service smbd restart
```

## Howto: btrfs
After formatting a HDD in btrfs, we can use the following
commands to create snapshots.

```sh
# Create a subvolume
btrfs subvolume create test

# Create a snapshot from subvolume test
btrfs subvolume snapshot test snapshot

# List subvolumes related to test (root required)
sudo btrfs subvolume list test

# Delete a subvolume (root required)
sudo btrfs subvolume delete test
```

## Mounting a Samba Drive
Use ``mount`` to test a drive. Then, use autofs.

Add Samba login credentials to a file.
```sh
vi ~/.smbcredentials
username=ryanc
password=1234
```

```sh
chmod 600 ~/.smbcredentials
sudo apt-get install smbclient cifs-utils
sudo mount -t cifs -o credentials=/home/ryanc/.smbcredentials,uid=1000,gid=1000,iocharset=utf8 //192.168.0.10/home /media/nas
```

## autofs
We use autofs to mount devices (safely, especially for network devices).
We mount a local hdd, an nfs, and a samba network drive.

```sh
sudo apt install autofs
sudo mkdir -p /media/mount/hdd1
sudo mkdir -p /media/mount/ds713p
sudo mkdir -p /media/mount/nfs

sudo vi /etc/auto.master
# Use /media/mount as the mounting point to mount a device using
# the settings defined in /etc/auto.drives
/media/mount /etc/auto.drives
```

```sh
cp /etc/auto.misc /etc/auto.drives
sudo vi /etc/auto.drives

hdd1 -fstype=btrfs :/dev/sdb1
nfs -fstype=nfs 192.168.0.10:/home/ryanc
ds713p -fstype=cifs,rw,dir_mode=0755,file_mode=0644,uid=1000,gid=1000,iocharset=utf8,credentials=/home/ryanc/.smbcredentials ://192.168.0.10/home
```

Finally, restart the autofs service.
```sh
sudo service autofs restart
```

## Version Management using Snapshots
Using btrfs, we can easily create snapshots.

```sh
vi backup.sh
#!/bin/sh

if [ -d /media/hdd1/snapshots/current ] ; then \
    rsync -avz --delete --delete-excluded --exclude-from "/home/ryanc/bin/backup_ignore.txt" /home/ryanc/ /media/hdd1/snapshots/current ; \
    touch /media/hdd1/snapshots/current
    d=`date +"%Y%m%d_%H%M"` ; \
    btrfs subvolume snapshot /media/hdd1/snapshots/current /media/hdd1/snapshots/$d ; \
fi;
```

Run the script using cron
```sh
crontab -e
# Run the script at 11pm everyday
0 23 * * * sh /home/ryanc/bin/backup.sh
```

## Eclipse shortcuts
Useful Eclipse shortcuts.

```
ctrl + d: delete current line
ctrl + j: incremental search
ctrl + e: switch to different editor
ctrl + o: open a member browser of the current class
ctrl + h: c/c++ search in the entire project
ctrl + g: go to the function definition
ctrl + i: auto-correction indentation
ctrl + =: macro expansion
ctrl + space: autocompletion
ctrl + tab: switch between source and header

ctrl + shift + r: open a file/resource
ctrl + shift + t: shows the class hierarchy
ctrl + shift + l: shows shortcut mappings

alt + up/down arrow: move the block up or down
alt + left/right arrow: move forward/backword last editied position
```

Ref: [most-useful-shortcut-in-eclipse-cdt](https://stackoverflow.com/questions/1266862/most-useful-shortcut-in-eclipse-cdt)

## To be updated/tested
The following sections need to be updated.

## VNC

```sh
sudo apt-get install xrdp
sudo apt-get install mate-core mate-desktop-environment mate-notification-daemon
sudo sed -i.bak '/fi/a #xrdp multiple users configuration \n mate-session \n' /etc/xrdp/startwm.sh
```

ref: [remote access](http://ubuntuhandbook.org/index.php/2016/07/remote-access-ubuntu-16-04/)
<!-- http://goodtogreate.tistory.com/entry/%EC%9A%B0%EB%B6%84%ED%88%AC-1604-%EC%9B%90%EA%B2%A9-%EB%8D%B0%EC%8A%A4%ED%81%AC%ED%83%91-%EC%84%A4%EC%A0%95 -->

## Apache
### Enable personal public\_html
```sh
sudo a2enmod userdir
sudo service apache2 restart
```

### WebDav
```sh
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
