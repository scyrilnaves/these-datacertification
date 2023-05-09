#! /bin/bash

#Install sysstat
#sudo apt-get install sysstat -y
printf "$(hostname -I)\n">>log.csv
printf "TIME|USEDMEMORY|AVAILABLEMEMORY|SWAPUSED|CPULOAD1|CPULOAD2|CPULOAD3|PAC_REC|PAC_TRA|IOWAIT|IDLE|USED|CPU1used|CPU1iowait|CPU1idle|CPU2used|CPU2iowait|CPU2idle|CPU3used|CPU3iowait|CPU3idle|CPU4used|CPU4iowait|CPU4idle\n" >> log.csv

while true

do

#date
dat=$(date)

#Ram
swapused=$(free -h | grep -v + | grep "Swap" | awk '{print $3}')

usedmem=$(free -h | grep -v + | grep "Mem" | awk '{print $3}')

availablemem=$(free -h | grep -v + | grep "Mem" | awk '{print $7}')


#Load Average
loadone=$(top -n 1 -b | grep "load average:" | awk '{print $12}')

loadtwo=$(top -n 1 -b | grep "load average:" | awk '{print $13}')

loadthree=$(top -n 1 -b | grep "load average:" | awk '{print $14}')

#mpstat
mpstatoneused=$(mpstat -P ALL | awk '(NR ==5)'| awk '{print $4}')

mpstatoneiowait=$(mpstat -P ALL | awk '(NR ==5)'| awk '{print $7}')

mpstatoneidle=$(mpstat -P ALL | awk '(NR ==5)'| awk '{print $13}')

mpstattwoused=$(mpstat -P ALL | awk '(NR ==6)'| awk '{print $4}')

mpstattwoiowait=$(mpstat -P ALL | awk '(NR ==6)'| awk '{print $7}')

mpstattwoidle=$(mpstat -P ALL | awk '(NR ==6)'| awk '{print $13}')

mpstatthreeused=$(mpstat -P ALL | awk '(NR ==7)'| awk '{print $4}')

mpstatthreeiowait=$(mpstat -P ALL | awk '(NR ==7)'| awk '{print $7}')

mpstatthreeidle=$(mpstat -P ALL | awk '(NR ==7)'| awk '{print $13}')

mpstatfourused=$(mpstat -P ALL | awk '(NR ==8)'| awk '{print $4}')

mpstatfouriowait=$(mpstat -P ALL | awk '(NR ==8)'| awk '{print $7}')

mpstatfouridle=$(mpstat -P ALL | awk '(NR ==8)'| awk '{print $13}')

#Gateway Traffic
received=$(netstat -i | grep -e Iface -e wlan0 |awk '(NR==2)'| awk '{print $4}')

transmitted=$(netstat -i | grep -e Iface -e wlan0 |awk '(NR==2)'| awk '{print $8}')

#Iostat
iowait=$(iostat | awk '(NR ==4)' | awk '{print $4}')

idle=$(iostat | awk '(NR ==4)' | awk '{print $6}')

used=$(iostat | awk '(NR ==4)' | awk '{print $1}')

printf "$dat|$usedmem|$availablemem|$swapused|$loadone|$loadtwo|$loadthree|$received|$transmitted|$iowait|$idle|$used|$mpstatoneused|$mpstatoneiowait|$mpstatoneidle|$mpstattwoused|$mpstattwoiowait|$mpstattwoidle|$mpstatthreeused|$mpstatthreeiowait|$mpstatthreeidle|$mpstatfourused|$mpstatfouriowait|$mpstatfouridle\n" >> log.csv

#Run every 60 secs
sleep 10
done
