#! /bin/bash

#Install sysstat
#sudo apt-get install sysstat -y

while true

do

#date
dat=$(date)

# Hostname
hostnam=$(hostname -I)

#Ram
free -h | grep -v + > /tmp/ramcache
swap=$(cat /tmp/ramcache | grep -v "Swap")

mem=$(cat /tmp/ramcache | grep -v "Mem")

#Disk Usage
df -h| grep 'Filesystem\|/dev/sda*' > /tmp/diskusage
dis=$(cat /tmp/diskusage)

#Load Average
loadaverage=$(top -n 1 -b | grep "load average:" | awk '{print $10 $11 $12}')

#Gateway Traffic
net_stat=$(netstat -i | grep -e Iface -e wlp2s0)

#Iostat
iostat=$(iostat | awk '(NR == 3) || (NR ==4)')

#vmstat
vmstat=$(vmstat)

echo "#date:"$dat"#hostname:"$hostnam"#SWAP:"$swap"#RAM:"$mem"#Disk:"$dis"#Load:"$loadaverage"#Network:"$net_stat "#iostat:"$iostat"#vmstat:"$vmstat>>monitorresult.csv

#RemoveTemp Files
rm /tmp/ramcache /tmp/diskusage

#Run every 60 secs
sleep 60
done
