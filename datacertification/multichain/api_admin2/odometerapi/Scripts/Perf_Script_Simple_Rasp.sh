#! /bin/bash

#Install sysstat
#sudo apt-get install sysstat -y
printf "Date\tHost\tSWAP\tRAM\tNETWORK\tLOAD\tIOSTAT\tIOOPERATION\tMPSTAT\tVMSTAT\n" >> log.csv

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

#Load Average
loadaverage=$(top -n 1 -b | grep "load average:" | awk '{print $10 $11 $12}')

#Gateway Traffic
net_stat=$(netstat -i | grep -e Iface -e wlan0)

#Iostat
iostat=$(iostat | awk '(NR == 3) || (NR ==4)')

#Ioperation
ioperation=$(iostat | awk '(NR == 6) || (NR ==15)')

#Mpstat
mpstat=$(mpstat -P ALL | awk '(NR == 3) || (NR ==4) || (NR ==5)|| (NR ==6) || (NR ==7) || (NR ==8)')

#vmstat
vmstat=$(vmstat)

printf "$dat\t$hostnam\t$swap\t$mem\t$net_stat\t$loadaverage\t$iostat\t$ioperation\t$mpstat\t$vmstat\n" >> log.csv

#RemoveTemp Files
rm /tmp/ramcache /tmp/diskusage

#Run every 60 secs
sleep 10
done
