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
swap=$(cat /tmp/ramcache | grep "Swap")

mem=$(cat /tmp/ramcache | grep "Mem")

#Disk Usage
df -h| grep 'Filesystem\|/dev/mmcblk0p2' > /tmp/diskusage
dis=$(cat /tmp/diskusage)

#Load Average
loadaverage=$(top -n 1 -b | grep "load average:" | awk '{print $10 $11 $12}')

#Gateway Traffic
net_stat=$(netstat -i | grep -e Iface -e eth0)

#Iostat
iostat=$(iostat | awk '(NR == 3) || (NR ==4)')

#Ioperation
ioperation=$(iostat | awk '(NR == 6) || (NR ==15)')

#Mpstat
mpstat=$(mpstat -P ALL | awk '(NR == 3) || (NR ==4) || (NR ==5)|| (NR ==6) || (NR ==7) || (NR ==8)')

#vmstat
vmstat=$(vmstat)

echo "#date:"$dat"#hostname:"$hostnam"#SWAP:"$swap"#RAM:"$mem"#Disk:"$dis"#Load:"$loadaverage"#Network:"$net_stat "#iostat:"$iostat"#iooperation:"$ioperation"#mpstat:"$mpstat"#vmstat:"$vmstat>>monitorresult.csv

#RemoveTemp Files
rm /tmp/ramcache /tmp/diskusage

#Run every 60 secs
sleep 60
done
