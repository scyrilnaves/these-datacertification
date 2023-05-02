set terminal pngcairo nocrop enhanced font "verdana,8" size 640,400
set output "results_commit_and_reject_rate.eps"


set terminal postscript eps enhanced color font 'Times-Roman,14'
set multiplot layout 2,1

set title "Commit rate for 4 to 24 nodes"

set grid ytics lc rgb "black" lw 1.5 lt 0.1
# set grid y2tics lc rgb "black" lw 1.5 lt 0.1
set grid xtics lc rgb "black" lw 1.5 lt 0.1


set xlabel "Input transactions per second"
set ylabel "Commit Rate"
# set y2label "Reject Rate"

set yrange [0 to 30]
set xrange [5 to 50]
# set y2range [0 to 150]

set xtics nomirror
set ytics nomirror

set xtics (5, 10, 15, 20, 25, 30, 40, 50)
#set ytics 2
#set ytics (2000, 4000, 8000, 10000)
# set y2tics 25

#set logscale y 10

set key at graph 0.32, 1
#set key right center

#csv settings:
set key autotitle columnhead
set datafile separator comma

plot "commit_rate_data.csv" using 1:2 with linespoints pt 2 pi 0 lt rgb "#ff00ff" title "4 nodes - commits" axis x1y1, \
    "commit_rate_data.csv" using 1:3 with linespoints pt 4 pi 0 lt rgb "#000000" title "6 nodes - commits" axis x1y1, \
    "commit_rate_data.csv" using 1:4 with linespoints pt 6 pi 0 lt rgb "#0099ff" title "12 nodes - commits" axis x1y1, \
    "commit_rate_data.csv" using 1:5 with linespoints pt 10 pi 0 lt rgb "#ff3300" title "18 nodes - commits" axis x1y1, \
    "commit_rate_data.csv" using 1:6 with linespoints pt 12 pi 0 lt rgb "#33cc33" title "24 nodes - commits" axis x1y1


set title "Total rejects for 4 to 24 nodes"

# set grid ytics lc rgb "black" lw 1.5 lt 0.1
set grid ytics lc rgb "black" lw 1.5 lt 0.1
set grid xtics lc rgb "black" lw 1.5 lt 0.1


set xlabel "Input transactions per second"
set ylabel "Commit Rate"
set ylabel "Total Rejects"

set yrange [0 to 125]
set xrange [5 to 50]
# set y2range [0 to 150]

set xtics nomirror
set ytics nomirror

set xtics (5, 10, 15, 20, 25, 30, 40, 50)
#set ytics 2
#set ytics (2000, 4000, 8000, 10000)
set ytics 25

#set logscale y 10

set key at graph 0.42, 0.9
#set key right center

#csv settings:
set key autotitle columnhead
set datafile separator comma



plot "reject_rate_data.csv" using 1:4 with linespoints pt 7 pi 0 lt rgb "#0099ff" title "12 nodes - rejects" axis x1y1, \
    "reject_rate_data.csv" using 1:5 with linespoints pt 11 pi 0 lt rgb "#ff3300" title "18 nodes - rejects" axis x1y1, \
    "reject_rate_data.csv" using 1:6 with linespoints pt 12 pi 0 lt rgb "#33cc33" title "24 nodes - rejects" axis x1y1




unset multiplot 