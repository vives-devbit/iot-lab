---
tags:
  - tutorial
  - z-wave
  - aeotec
  - ethernet
  - raspberry pi
---

# Serial (Aeotec Z-Wave stick) over ethernet

> [https://community.openhab.org/t/share-z-wave-dongle-over-ip-usb-over-ip-using-ser2net-socat-guide/34895](https://community.openhab.org/t/share-z-wave-dongle-over-ip-usb-over-ip-using-ser2net-socat-guide/34895)

## Introduction

TODO

IMAGE

## Getting the USB dongle device name

In this tutorial we start with a clean install of Raspbian.

First you need to get the device name of the USB dongle. You can list all `tty`
devices with the following command:

```bash
ls /dev/tty*
```

You can verify the name of the USB dongle by plugging it in. In this case the device
is called `ttyACM0` but it could have a different name in your setup.

## Serial server

First we need to install a tool called `ser2net`. This enables us to convert the
serial protocl to tcp/ip.

```bash
sudo apt install ser2net
```

Once installed, you need to configure ser2net.

```bash
sudo nano /etc/ser2net.conf
```

At the bottom of the configuration file you need to add the following settings:

```text
3333:raw:0:/dev/ttyACM0:115200 8DATABITS NONE 1STOPBIT
```

Press `ctrl+x` to save the file.

Restart the ser2net service:

```bash
sudo service ser2net restart
```

You can check if ser2net is configured correctly by using the following netstat
command.

```bash
netstat -antp
```

You should see `0.0.0.0:3333` somewhere in the list.

The server side setup is now ready. Ser2net is already installed as a service and
will automatically start after a reboot.

## Serial client

Now on the client machine, we need to connect to the ser2lan connection. For this,
you can use `socat`.

```bash
sudo apt install socat
```

Download and install an init.d script that allows socat to run as a service and
auto-start at startup

```bash
git clone https://github.com/asaif/socat-init.git

sudo cp socat-init/socat /etc/init.d/
sudo chmod +x /etc/init.d/socat
sudo update-rc.d socat defaults
sudo cp socat-init/defaults/socat.conf /etc/default/
```

Now you just need to configure socat.

```bash
sudo nano /etc/default/socat.conf
```

Add the following configuration that will

* Create a new serial USB device known as `ttyUSB0`
<!-- need to check if this is needed in our setup-->
* It creates a device as user 'pi' and adds it to the dialout group
* It tells socat to connect to the Raspberry Pi server using its ip and port 3333

```text
OPTIONS="pty,link=/dev/ttyUSB0,raw,user=pi,group=dialout,mode=777 tcp:172.16.11.5:3333"
```

Press `ctrl+x` to save and exit the editor.

Socat can now be started.

```bash
sudo service socat restart
```

Check the logs to see if connection was successful

```bash
tail -f /var/log/socat.log
```

```text
2020/04/20 20:56:06 socat[676] I setting option "group" to 1000
2020/04/20 20:56:06 socat[676] I setting option "perm" to 511
2020/04/20 20:56:06 socat[676] I openpty({6}, {7}, {"/dev/pts/0"},,) -> 0
2020/04/20 20:56:06 socat[676] N PTY is /dev/pts/0
2020/04/20 20:56:06 socat[676] N opening connection to AF=2 192.168.1.158:3333
2020/04/20 20:56:06 socat[676] I starting connect loop
2020/04/20 20:56:06 socat[676] I socket(2, 1, 6) -> 8
2020/04/20 20:56:06 socat[676] N successfully connected from local address AF=2 192.168.1.167:56413
2020/04/20 20:56:06 socat[676] I resolved and opened all sock addresses
2020/04/20 20:56:06 socat[676] N starting data transfer loop with FDs [6,6] and [8,8]
```

check if you can see the `ttyUSB0` device

```bash
sudo ls /dev/tty*
```

You are now ready to connect to your remote Z-Wave stick over the network.
Use the `/dev/ttyUSB0` device in your configuration.
