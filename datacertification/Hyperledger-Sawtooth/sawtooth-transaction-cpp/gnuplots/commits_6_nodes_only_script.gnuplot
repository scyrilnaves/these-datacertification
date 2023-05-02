set terminal pngcairo nocrop enhanced font "verdana,8" size 640,400
set output "results_commits_6_nodes_only.eps"

set terminal postscript eps enhanced color font 'Times-Roman,20'

set title "Commits and commit rate for 6 nodes"

set grid ytics lc rgb "black" lw 1.5 lt 0.1
set grid y2tics lc rgb "black" lw 1.5 lt 0.1
set grid xtics lc rgb "black" lw 1.5 lt 0.1

#set style line 1 lt 1 lc rgb "green"
#set style line 2 lt 1 lc rgb "red"
#set style fill solid

set xlabel "Input transactions per second"
set ylabel "Total Commits"
set y2label "Commit/Reject Rate"

set yrange [2000 to 12000]
set y2range [0 to 25]
set xrange [5 to 50]

set xtics nomirror
set ytics nomirror

set xtics (5, 10, 15, 20, 30, 40, 50)
#set ytics 1000
#set ytics (2000, 4000, 8000, 10000)
set y2tics 5

#set logscale y 10

#set key left bottom
set key right top

#csv settings:
set key autotitle columnhead
set datafile separator comma

plot "data_6_nodes_only.csv" using 1:2 with linespoints pt 3 pi 0 title "Total commits" axis x1y1, \
    "data_6_nodes_only.csv" using 1:3 with linespoints pt 7 pi 0 title "Avg commits/s" axis x1y2, \
    "data_6_nodes_only.csv" using 1:4 with linespoints pt 5 pi 0 title "Avg rejects/s" axis x1y2

#plot "data_6_nodes_only.csv" using 2:xticlabels(1) with histogram linecolor 'gray' title "6 nodes"

#plot "data_6_nodes_only.csv" using (column(1)):2:(0.5):($2>0?1:2):xticlabels(1) with boxes lc variable title "6 nodes"
#                          #xval:ydata:boxwidth:color_index:xtic_labels
